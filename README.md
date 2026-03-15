# About

A simple "Hello World" template with TypeScript, Docker, and ESLint pre-configured.

# Usage

Use this repository as a template for your project by copying with [github](https://github.com)'s UI or manually with `git clone`.

It is recommended to run `pnpm up` to update dev-dependencies (eslint, tsx, etc.) after copying this template.

## Copy with github.com UI

Please refer to [this page](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template) for details.

## Copy manually

```sh
git clone https://github.com/osipovts/skeleton.git
mv skeleton my_project
cd my_project
git remote remove origin
git remote add origin <YOUR_REPO_URL>
git push -u origin --all
git push -u origin --tags
```

# Run

- `pnpm build && pnpm start`: Compile TypeScript to JavaScript and run the app
- `pnpm dev`: Run in "watch mode" for development
- `pnpm lint`: Run ESLint to check code style
- `pnpm lint:fix`: Automatically fix code style issues

# Docker

- `docker compose up app-dev --build`: Run in dev mode
- `docker compose up app-prod --build`: Run in prod mode

## Notes

1. Using `pnpm fetch` cache stage: offline installation (`--offline` flag) ensures build reliability and speed using cached layers.
2. Using distroless image in production to minimize image size.
3. Using non-root user to improve security.
4. Anonymous volume in dev mode prevents host OS from overwriting container `node_modules`.

# VS Code tips

## Auto-linter on save

To run Prettier and ESLint fix automaticly on file save:

1. Install `dbaeumer.vscode-eslint` and `esbenp.prettier-vscode` extensions via Extensions (`Ctrl + Shift + X`) or Quick Open (`Ctrl + P`):

```
ext install dbaeumer.vscode-eslint
ext install esbenp.prettier-vscode
```

2. Edit your settings.json:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "typescript", "typescriptreact", "javascriptreact"],
  "prettier.requireConfig": true
}
```
