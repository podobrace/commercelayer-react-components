# Commerce Layer React Components

This repository is a fork of the [Commercelayer React Components](https://github.com/commercelayer/commercelayer-react-components). We needed this fork, because adding a payment gateway also requires changes to the React components package.

## Installation

To start working with this repository you need to install all dependencies using [PNPM](https://pnpm.io/):

```
pnpm install
```

## Running commands

To run commands in the `packages/react-components` package, use `pnpm components <command>`, e.g. `pnpm components build`.

## Publishing

The versions of this package are published to GitHub Packages, to be used by other projects. In order to publish to this (private) repository, you need a [Personal Access Token (PAT) from GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

To create one, click [here](https://github.com/settings/tokens/new?scopes=repo,write:packages,read:packages&description=Podobrace%20-%20Development).

If you have created the PAT, copy it. Then, make a copy of the `.npmrc.example` file and name it `.npmrc`. In the `.npmrc` file, replace the `<AUTH_TOKEN>` with the token you copied.

You should now be able to publish new versions of the components by first updating the version in `packages/react-components/package.json`, committing your changes and then running:

```
pnpm components build
pnpm components publish
```