```
   ___ ___  _ __  _   _       ___  ___ _ __ ___  ___ _ __        _ __ ___  ___ _   _ _ __ ___(_)_   _____| |_   _ 
  / __/ _ \| '_ \| | | |_____/ __|/ __| '__/ _ \/ _ \ '_ \ _____| '__/ _ \/ __| | | | '__/ __| \ \ / / _ \ | | | |
 | (_| (_) | |_) | |_| |_____\__ \ (__| | |  __/  __/ | | |_____| | |  __/ (__| |_| | |  \__ \ |\ V /  __/ | |_| |
  \___\___/| .__/ \__, |     |___/\___|_|  \___|\___|_| |_|     |_|  \___|\___|\__,_|_|  |___/_| \_/ \___|_|\__, |
           |_|    |___/                                                                                     |___/ 
 Version v1.1.0 - tongngochuunghia@gmail.com 
```

Welcome to the `copy-screen-recursively`!

## Introduction
CLI tools used to copy & rename the screen folder on a new screen, used for design projects according to the structure of each folder is a screen.

**Before**
```
root
+-- src
|   +-- pages
|       +-- Login
|           |-- LoginController.ts
|           |-- LoginLogic.ts
|           |-- LoginModel.ts
|           |-- LoginView.tsx
|
|-- package.json
|-- README.md
```

**Using `copy-screen-recursively`**
```bash
$ copy-screen-recursively --screenPath=./src/pages
# What is the screen name you want to copy?
# [SOURCE] Screen name: Login
# What is the screen name you want to create?
# [DESTINATION] Screen name: Register
#
# NEW SCREEN COPY COMPLETED!!!
```

**After**
```
root
+-- src
|   +-- pages
|       +-- Login
|       |   |-- LoginController.ts
|       |   |-- LoginLogic.ts
|       |   |-- LoginModel.ts
|       |   |-- LoginView.tsx
|       |
|       +-- Register
|           |-- RegisterController.ts
|           |-- RegisterLogic.ts
|           |-- RegisterModel.ts
|           |-- RegisterView.tsx
|
|-- package.json
|-- README.md
```

## System Requirements
- [Node.js 12.16.1](https://nodejs.org/en/) or later
- MacOS, Windows and Linux are supported

## Setup
Install `copy-screen-recursively` in your project:
```bash
npm install https://github.com/tongngochuunghia/copy-screen-recursively.git
# or
yarn add https://github.com/tongngochuunghia/copy-screen-recursively.git
```

Open `package.json` and add the following `scripts`:
```bash
"scripts": {
  "copy-screen": "copy-screen-recursively --screenPath=./src/pages"
}
```
- `--screenPath`: The folder contains screens, default `./src/pages`
- `--debug`: Enabled debug mode, default `false`

## Using
```bash
$ npm run copy-screen
# or
$ yarn copy-screen
```

## Reference
- [Build a JavaScript Command Line Interface (CLI) with Node.js](https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/)
