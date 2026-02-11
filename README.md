# Code Tester Playground

A lightweight web app where users can practice code in multiple programming languages from one place.

## Features

- Supports JavaScript, Python, C, C++, Java, Go, and Rust
- Starter template auto-loads when language changes
- Optional standard input box
- Output panel for stdout/stderr
- Runs code through the public Piston execution API

## Run locally

Use any static server. Example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Notes

This project uses a public third-party API endpoint (`https://emkc.org/api/v2/piston/execute`) for code execution.
