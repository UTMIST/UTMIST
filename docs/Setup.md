# Development Environment Setup

## Prerequisites
### Operating System 
> UNIX based systems (e.g. macOS and Linux Distributions) can proceed to next prerequisites.

Developers on Windows are encouraged to install Window Subsystem for Linux (WSL) for development because it is easier to work with the UNIX terminals and package management. 

- If developer is interested in using WSL, please refer to [Microsoft's WSL installation guide](https://learn.microsoft.com/en-us/windows/wsl/install).
  
  - It is recommended to use <b>Ubuntu 20.04</b> for the Linux Distribution
- If developer is NOT interested in using WSL, please for the appropriate setup instructions found on official documentations on the tools and libraries the codebase uses.

<b>Note</b>: The documentation's setup instructions are written for UNIX development environments.


### Package Manager

The project uses `npm` as the package manager for managing dependencies and scripts. Ensure you have `Node.js` installed on your system, as it includes `npm` by default. You can download and install the latest LTS version of Node.js from [Node.js official website](https://nodejs.org/).

To verify the installation, run the following commands:
```bash
node -v
npm -v
```
This will display the installed versions of Node.js and npm, respectively.

## Install Dependencies
```bash
cd src/client
npm install
```

## Running the Application
### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## Troubleshooting
- For issues related to getting WSL running, please refer to [Microsoft WSL's troubleshooting guide](https://learn.microsoft.com/en-us/windows/wsl/troubleshooting).
