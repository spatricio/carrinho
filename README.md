# Projeto Cadastro Web - Gerenciador de Tarefas

Aplicação web para cadastro e gerenciamento de tarefas.

Tecnologias:
- Front-end: Angular
- Back-end: ASP.NET Core Web API (C#)
- Banco de dados: SQL Server
- ORM: Entity Framework Core
- Comunicação: API REST (JSON)

## Estrutura do projeto

- backend/TaskManager.Api: API REST
- frontend: aplicação Angular

## Pré-requisitos

Instale no Windows:
- .NET SDK 8.0 ou superior
- Node.js 20 ou superior
- npm
- Angular CLI 17 ou superior
- SQL Server (Express ou Developer)

Valide no terminal:

  dotnet --version
  node --version
  npm --version
  ng version

## 1. Configuração do banco de dados

Arquivo de configuração:
- backend/TaskManager.Api/appsettings.json

Connection string padrão:

  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=TaskManagerDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }

Se necessário, ajuste o servidor SQL para o seu ambiente.

## 2. Aplicar migrações (Entity Framework Core)

No terminal, execute:

  cd backend/TaskManager.Api
  dotnet restore
  dotnet tool install --global dotnet-ef
  dotnet ef database update

Observação:
- Se ainda não existir migração no seu ambiente, crie antes:

  dotnet ef migrations add InitialCreate

## 3. Executar o back-end

No terminal:

  cd backend/TaskManager.Api
  dotnet run

URLs padrão:
- API: http://localhost:5239
- Swagger: http://localhost:5239/swagger

## 4. Executar o front-end

Em outro terminal:

  cd frontend
  npm install
  npm start

URL padrão:
- Front-end: http://localhost:4200

## 5. Endpoints da API

Base URL:
- http://localhost:5239/api/tarefas

Endpoints:
- GET /api/tarefas: lista todas as tarefas
- GET /api/tarefas/{id}: busca tarefa por ID
- POST /api/tarefas: cria nova tarefa
- PUT /api/tarefas/{id}: atualiza tarefa
- DELETE /api/tarefas/{id}: exclui tarefa

## 6. Modelo da entidade Tarefa

Campos:
- Id (int, gerado automaticamente)
- Titulo (string)
- Descricao (string)
- Status (Pendente ou Concluida)
- DataCriacao (DateTime)

## 7. Funcionalidades implementadas no front-end

- Listagem de tarefas
- Criação de tarefa
- Edição de tarefa
- Exclusão de tarefa
- Filtro por status

## 8. Teste rápido da API (opcional)

Após subir a API, teste no Swagger ou com ferramenta como Postman/Insomnia.

## 9. Solução de problemas comuns

Erro de conexão com SQL Server:
- Verifique se o serviço do SQL Server está em execução.
- Confirme o nome da instância na connection string.

Porta em uso no back-end:
- Encerre o processo que está usando a porta 5239 ou ajuste a porta no launchSettings.

Erro de CORS no front-end:
- Confirme que a API está rodando em http://localhost:5239.
- Confirme que o front-end está em http://localhost:4200.

## 10. Comandos úteis

Back-end:

  cd backend/TaskManager.Api
  dotnet build

Front-end:

  cd frontend
  npm run build
