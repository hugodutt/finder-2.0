# Configuração do Token GitHub

## Para fazer o token funcionar:

1. **Renomeie o arquivo:**
   ```bash
   mv env.local .env
   ```

2. **Edite o arquivo `.env` e coloque seu token real:**
   ```
   VITE_GITHUB_TOKEN=ghp_seu_token_real_aqui
   ```

3. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```

## O que foi corrigido:

- ✅ Vite configurado para carregar variáveis de ambiente
- ✅ Código atualizado para usar `process.env.VITE_GITHUB_TOKEN`
- ✅ Arquivo `.env` será carregado automaticamente

## Verificação:

Após configurar, você deve ver:
- Limite: X/5000 (em vez de X/60)
- Sem erro de rate limit
- Token sendo usado automaticamente

**Importante:** O arquivo `.env` não vai para o Git (está no .gitignore)
