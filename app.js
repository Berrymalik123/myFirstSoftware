const languageSelect = document.getElementById("language");
const editor = document.getElementById("editor");
const stdin = document.getElementById("stdin");
const output = document.getElementById("output");
const runBtn = document.getElementById("runBtn");

const runtimeOptions = [
  {
    label: "JavaScript (Node.js)",
    language: "javascript",
    version: "18.15.0",
    starter: 'console.log("Hello, world!");'
  },
  {
    label: "Python",
    language: "python",
    version: "3.10.0",
    starter: 'print("Hello, world!")'
  },
  {
    label: "C",
    language: "c",
    version: "10.2.0",
    starter: '#include <stdio.h>\n\nint main() {\n    printf("Hello, world!\\n");\n    return 0;\n}'
  },
  {
    label: "C++",
    language: "cpp",
    version: "10.2.0",
    starter: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, world!" << std::endl;\n    return 0;\n}'
  },
  {
    label: "Java",
    language: "java",
    version: "15.0.2",
    starter:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}'
  },
  {
    label: "Go",
    language: "go",
    version: "1.16.2",
    starter:
      'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, world!")\n}'
  },
  {
    label: "Rust",
    language: "rust",
    version: "1.68.2",
    starter: 'fn main() {\n    println!("Hello, world!");\n}'
  }
];

function loadLanguages() {
  for (const option of runtimeOptions) {
    const el = document.createElement("option");
    el.value = option.language;
    el.textContent = option.label;
    languageSelect.append(el);
  }
}

function currentOption() {
  return runtimeOptions.find((item) => item.language === languageSelect.value);
}

function setStarterCode() {
  const chosen = currentOption();
  if (chosen) {
    editor.value = chosen.starter;
  }
}

async function runCode() {
  const chosen = currentOption();

  if (!chosen) {
    output.textContent = "Please choose a language.";
    return;
  }

  runBtn.disabled = true;
  runBtn.textContent = "Running...";
  output.textContent = "Executing your code...";

  try {
    const res = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        language: chosen.language,
        version: chosen.version,
        files: [{ content: editor.value }],
        stdin: stdin.value
      })
    });

    if (!res.ok) {
      throw new Error(`Execution failed (${res.status})`);
    }

    const data = await res.json();
    const runResult = data.run || {};
    const outputParts = [];

    if (runResult.stdout) {
      outputParts.push(runResult.stdout);
    }

    if (runResult.stderr) {
      outputParts.push(`stderr:\n${runResult.stderr}`);
    }

    if (runResult.output && !runResult.stdout) {
      outputParts.push(runResult.output);
    }

    if (!outputParts.length) {
      outputParts.push("Program finished with no output.");
    }

    output.textContent = outputParts.join("\n").trim();
  } catch (error) {
    output.textContent = `Unable to execute code right now. ${error.message}`;
  } finally {
    runBtn.disabled = false;
    runBtn.textContent = "Run Code";
  }
}

loadLanguages();
languageSelect.selectedIndex = 0;
setStarterCode();
languageSelect.addEventListener("change", setStarterCode);
runBtn.addEventListener("click", runCode);
