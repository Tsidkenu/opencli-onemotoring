# OpenCLI OneMotoring Adapter

OpenCLI plugin for OneMotoring road tax enquiry and vehicle classification by Vincent Lau.

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

Pass the license plate info to enquire the vehicle registration with OneMotoring.
```bash
opencli onemotoring roadtax SXX1234A -f json
```
If it is valid, you will get the road tax expiry date and the vehicle make.

You can then use the vehicle make to check what kind of vehicle it is from Google.
```bash
opencli onemotoring istippertruck "MITSUBISHI / FUSO FV51SJD2DEA" -f json
```
If the results confidence is high, then is_tipper_truck will be true.

To see the results as a table in CLI, remove the -f json flag.

## Notes

- Uses public OneMotoring enquiry page only
- Does not bypass CAPTCHA, CSRF, login, or access controls
- Manual reCAPTCHA completion may be required