# OpenCLI OneMotoring Adapter

OpenCLI adapter for querying public OneMotoring road tax expiry information by Vincent Lau.

## Requirements

- Node.js
- OpenCLI
- Browser Bridge configured

## Installation

```bash
npm install -g git+https://github.com/Tsidkenu/opencli-onemotoring.git
```

## Usage

```bash
opencli onemotoring roadtax SXX1234A -f json
```

## Notes

- Uses public OneMotoring enquiry page only
- Does not bypass CAPTCHA, CSRF, login, or access controls
- Manual reCAPTCHA completion may be required