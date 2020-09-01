# Ego Token Utils

[![Coverage Status](https://coveralls.io/repos/github/icgc-argo/ego-token-utils/badge.svg?branch=master)](https://coveralls.io/github/icgc-argo/ego-token-utils?branch=master)
[![Build Status](https://jenkins.qa.cancercollaboratory.org/buildStatus/icon?job=ARGO%2Fego-token-utils%2Fdevelop)](https://jenkins.qa.cancercollaboratory.org/job/ARGO/job/ego-token-utils/job/develop/)
[![npm version](https://badge.fury.io/js/%40icgc-argo%2Fego-token-utils.svg)](https://badge.fury.io/js/%40icgc-argo%2Fego-token-utils)
[![Prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://prettier.io/)

This repo contains a library of utility functions written in **Typescript** interpret **Ego JWT** content in the Argo system.

## Usage

- install:
  ```
  npm i --save @icgc-argo/ego-token-utils
  ```
- use:

  ```typescript
    import TokenUtils from '@icgc-argo/ego-token-utils'

    TokenUtils.decodeToken(egoJwt)
    TokenUtils.canReadProgram(egoJwt, "TEST-AU")
    ...
  ```

  Interactive documentation is available at: https://icgc-argo.github.io/ego-token-utils/

## Development

This project uses the following bootstrap setup: [typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter)

### Notes

- `npm i`: install dependencies
- `npm run test:watch`: to start developing with interactive live test
- `npm run build`: to trigger build (for local testing only)
- `npm run commit`: to commit changes. **IMPORTANT** as commits are analyzed for release
- Once happy, submit a PR to the `develop` branch.
- Releases happen automatically through Travis once merged to `master`

Further development notes can be found [here](/DEVELOPMENT.md)
