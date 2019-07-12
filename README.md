# Ego Token Utils
[![Coverage Status](https://coveralls.io/repos/github/icgc-argo/ego-token-utils/badge.svg?branch=master)](https://coveralls.io/github/icgc-argo/ego-token-utils?branch=master)
[![Build Status](https://travis-ci.org/icgc-argo/ego-token-utils.svg?branch=master)](https://travis-ci.org/icgc-argo/ego-token-utils)
[![Prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://prettier.io/)

This repo contains a library of utility functions written in __Typescript__ interpret __Ego JWT__ content in the Argo system.

## Usage
- install: 
    ```
    npm i --save @icgc-argo/ego-token-utils
    ```
- use:
    ```typescript
    import TokenUtils from '@icgc-argo/ego-token-utils'
    
    TokenUtils.decodeToken(egoJwt)
    TokenUtils.canReadProgram(egoJwt, "PROGRAM-TEST-AU.READ")
    ...
    ```
Interactive documentation is available at: https://icgc-argo.github.io/ego-token-utils/

## Development
This project uses the following bootstrap setup: [typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter)

### Notes
- `npm i`: install dependencies
- `npm run test:watch`: to start developing with interactive live test
- `npm run build:watch`: to trigger build on change.
- Once happy, submit a PR to the `develop` branch.
- Releases happen automatically through Travis once merged to `master`

Further development notes can be found [here](/DEVELOPMENT.md)
