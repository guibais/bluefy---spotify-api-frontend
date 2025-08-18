<a id="readme-top"></a>

<br />
<div align="center">
  <h1>Purplefy</h1>
  <p>Modern Spotify client built with React + Vite.</p>
</div>

## Sumário

- [Sobre](#sobre)
- [Stack](#stack)
- [Como rodar](#como-rodar)
- [Scripts](#scripts)
- [Links](#links)

## Sobre

Purplefy é um cliente moderno do Spotify focado em performance e DX. Usa arquitetura de componentes baseada em Atomic Design, roteamento file‑based, cache e sincronização de dados reativos, e PWA.

## Stack

- React + Vite (TypeScript)
- Tailwind CSS
- Atomic Design (atoms, molecules, organisms)
- TanStack Router (file‑based) e TanStack Query
- Zustand (estado global)
- Storybook (design system)
- Paraglide (i18n)
- Vite PWA
- Vitest + Testing Library

## Como rodar

Pré‑requisitos

- Node 18+
- Yarn
- Credenciais do Spotify API

Passos

```bash
git clone https://github.com/guibais/purplefy-spotify-api-frontend.git
cd purplefy-spotify-api-frontend
yarn install
yarn dev
```

i18n (Paraglide)

```bash
yarn i18n:compile
```

Storybook

```bash
STORYBOOK=true yarn storybook
```

Testes e build

```bash
yarn test
yarn build && yarn serve
```

## CI

O workflow em `.github/workflows/tests.yml` executa:

- Checkout do repositório
- Node.js 20 com cache de Yarn
- Instalação de dependências (`yarn install --frozen-lockfile`)
- Compilação de i18n (`yarn i18n:compile`)
- Testes com cobertura (`yarn test:coverage`)
- Upload do artefato de cobertura

## Scripts

- dev: inicia o app em desenvolvimento
- build: gera build de produção
- serve: serve o build
- test: roda a suíte de testes
- storybook: inicia o Storybook

## Links

- App: https://purplefy---spotify-api-frontend.pages.dev
- Storybook: https://storybook-purplefy.pages.dev
