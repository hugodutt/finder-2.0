# GitHub Email Finder

Uma aplicação React para descobrir e-mails públicos de usuários do GitHub através de eventos e commits.

## Funcionalidades

- 🔍 Busca e-mails públicos de usuários do GitHub
- 📊 Suporte a tokens para aumentar limites da API
- 💾 Salva tokens no navegador (opcional)
- 🎨 Interface moderna e responsiva
- ⚡ Validação de e-mails (filtra noreply e domínios locais)

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

## Uso

1. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

2. Abra o navegador em `http://localhost:3000`

3. Digite o nome de usuário do GitHub e clique em "Buscar"

4. (Opcional) Adicione um token do GitHub para aumentar os limites da API

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Constrói a aplicação para produção
- `npm run preview` - Visualiza a build de produção

## Tecnologias

- React 18
- TypeScript
- Vite
- Lucide React (ícones)
- Tailwind CSS (estilos)

## Estrutura do Projeto

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── Button.tsx
│   ├── Input.tsx
│   └── EmailFinding.tsx
├── types/              # Definições de tipos TypeScript
│   └── index.ts
├── utils/              # Funções utilitárias
│   ├── emailUtils.ts
│   └── githubApi.ts
├── App.tsx             # Componente principal
└── main.tsx            # Ponto de entrada
```
