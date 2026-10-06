# OrçaFácil

API para freelancers e prestadores de serviço criarem orçamentos, cadastrarem clientes e enviarem um link para o cliente aprovar o orçamento, sem precisar de conta.

> Projeto de portfólio em andamento. O backend está pronto; o frontend (React) é a próxima etapa.

## Funcionalidades

- Cadastro e login de usuários com senha protegida por hash (bcrypt) e autenticação por token (JWT)
- CRUD completo de clientes (criar, listar, editar e apagar)
- Criação e listagem de orçamentos vinculados a um cliente
- Link público para o cliente final ver e aprovar o orçamento, sem login
- Cada usuário acessa apenas os próprios clientes e orçamentos

## Tecnologias

- **Node.js** + **TypeScript** (executado com `tsx`)
- **Express 5**
- **Prisma** (ORM) + **SQLite**
- **bcryptjs** (hash de senha) e **jsonwebtoken** (JWT)

## Como rodar localmente

Pré-requisito: Node.js 20 ou superior.

```bash
# 1. Clonar o repositório
git clone https://github.com/jhuliocezzar17/orcafacil.git
cd orcafacil/backend

# 2. Instalar as dependências
npm install

# 3. Criar o arquivo .env (use o .env.example como modelo)
#    DATABASE_URL="file:./dev.db"
#    JWT_SECRET="uma-chave-secreta-longa"

# 4. Criar o banco de dados
npx prisma migrate dev

# 5. Iniciar o servidor
npm run dev
```

A API sobe em `http://localhost:3333`.

## Rotas da API

| Método | Rota | Protegida | O que faz |
|---|---|---|---|
| POST | `/auth/register` | Não | Cria uma conta |
| POST | `/auth/login` | Não | Faz login e devolve o token |
| GET | `/me` | Sim | Dados do usuário logado |
| POST | `/clients` | Sim | Cadastra um cliente |
| GET | `/clients` | Sim | Lista os clientes do usuário |
| PUT | `/clients/:id` | Sim | Edita um cliente (nome e e-mail) |
| DELETE | `/clients/:id` | Sim | Apaga um cliente (409 se ele tiver orçamentos) |
| POST | `/proposals` | Sim | Cria um orçamento para um cliente do usuário |
| GET | `/proposals` | Sim | Lista os orçamentos do usuário |
| GET | `/public/proposals/:id` | Não | Cliente final vê o orçamento pelo link |
| PATCH | `/public/proposals/:id/approve` | Não | Cliente final aprova o orçamento |

Rotas protegidas exigem o cabeçalho `Authorization: Bearer <token>`.

Todas as rotas foram testadas no **Postman**. Os arquivos `.http` na pasta `backend` (`api.http`, `clientes.http`, `orcamentos.http`, `publico.http`) também têm exemplos prontos para testar com a extensão REST Client do VS Code.

## Decisões de segurança

- **Senhas com hash (bcrypt):** a senha nunca é salva em texto. Hash é de mão única, diferente de criptografia.
- **Mensagem única no login:** e-mail inexistente e senha errada retornam a mesma mensagem, para evitar enumeração de usuários.
- **JWT com validade de 7 dias**, assinado com uma chave guardada no `.env`.
- **Middleware de autenticação** valida o token antes das rotas protegidas e identifica o usuário (`req.userId`).
- **Isolamento de dados:** toda consulta filtra pelo usuário logado. Ao criar orçamento, editar ou apagar cliente, a API confere se o registro pertence ao usuário (proteção contra IDOR).
- **Integridade:** um cliente com orçamentos não pode ser apagado (409), para não deixar orçamentos órfãos.
- **Rotas públicas** usam o id do orçamento (UUID), que não pode ser adivinhado. A aprovação retorna `404` para id inexistente e `409` se o orçamento já foi respondido.
- **Segredos fora do repositório:** `.env` e o banco local estão no `.gitignore`.

## Estrutura

```
backend/
├── prisma/
│   └── schema.prisma        # Tabelas: User, Client, Proposal
└── src/
    ├── server.ts            # Inicia o servidor e registra as rotas
    ├── lib/prisma.ts        # Conexão com o banco
    ├── middlewares/auth.ts  # Valida o token JWT
    └── routes/
        ├── auth.ts          # Cadastro, login e /me
        ├── clients.ts       # Clientes
        ├── proposals.ts     # Orçamentos
        └── public.ts        # Link público de aprovação
```

## Próximos passos

- [ ] Frontend com React, Vite, Tailwind e React Query
- [ ] Recusar orçamento pelo link público
- [ ] Deploy (backend no Render ou Railway, frontend na Vercel)

## Autor

Desenvolvido por **Jhulio Cezzar** como projeto de estudo, com o Claude (IA da Anthropic) usado como tutor durante o aprendizado.
