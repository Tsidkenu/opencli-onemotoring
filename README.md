# OpenCLI OneMotoring Adapter

OpenCLI adapter for querying public OneMotoring road tax expiry information by Vincent Lau.

## Requirements

- Node.js
- OpenCLI
- Browser Bridge configured on 

## Pre-requisite

First install OpenCLI
```bash
npm install -g @jackwener/opencli
```
Note that you must be using Node version 22 and above.

Then install the Browser Bridge by dowloading this
https://github.com/jackwener/OpenCLI/releases/download/v1.8.0/opencli-extension-v1.0.15.zip
(lateest versions can be found in https://github.com/jackwener/opencli/releases)

1. Unzip the file and open chrome://extensions, enable Developer mode (top-right toggle).
2. Click Load unpacked and select the unzipped folder.

The daemon autostarts when in use. You can verify that with this command:
```bash
opencli doctor            # Check extension + daemon connectivity
```

## Installation

```bash
opencli plugin install github:Tsidkenu/opencli-onemotoring
```

## Usage

```bash
opencli onemotoring roadtax SXX1234A -f json
```
If you just want to see it as a table in CLI, remove the -f json flag.

## Notes

- Uses public OneMotoring enquiry page only
- Does not bypass CAPTCHA, CSRF, login, or access controls
- Manual reCAPTCHA completion may be required