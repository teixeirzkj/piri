# Piri Coxinha

Cardápio digital (site público) + Painel do Dono (admin com login), em
React + Vite + Tailwind + Framer Motion, com Supabase como backend.

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`. Sem o Supabase configurado, o site
roda com dados de demonstração locais — inclusive o login do admin
(`/admin/login`), que nesse modo aceita qualquer e-mail/senha.

## Conectando o Supabase (dados de verdade)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **SQL Editor**, cole e rode o conteúdo de `supabase/schema.sql`
   (cria as tabelas, permissões e já popula o cardápio inicial).
3. Em **Authentication → Users → Add user**, crie o usuário
   administrador (o e-mail e senha que você vai usar pra entrar no
   painel).
4. Em **Project Settings → API**, copie a **Project URL** e a
   **anon public key**.
5. Copie `.env.example` para `.env` e cole os dois valores:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
6. Reinicie `npm run dev`. A partir daqui, tudo é real: pedidos feitos
   no cardápio aparecem no Painel → Pedidos, o cardápio editado no
   admin aparece pro cliente, etc.

## Publicando (Netlify ou Vercel)

Qualquer um dos dois funciona do mesmo jeito, direto deste repositório
(os arquivos `netlify.toml`/`vercel.json` já cuidam do roteamento):

- Conecte o repositório na Netlify ou na Vercel.
- Configure as variáveis de ambiente `VITE_SUPABASE_URL` e
  `VITE_SUPABASE_ANON_KEY` (as mesmas do `.env`) nas configurações do
  projeto lá.
- Deploy. O cardápio fica em `/` e o painel em `/admin`.

## Estrutura

- `src/pages/Cardapio.jsx` — site público.
- `src/pages/admin/` — painel do dono (login, dashboard, cardápio,
  pedidos, nova venda, vendas, relatório, configurações).
- `src/hooks/` — acesso a dados (Supabase quando configurado, senão
  dados locais de demonstração).
- `supabase/schema.sql` — schema completo pra colar no Supabase.
