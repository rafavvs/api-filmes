# API de Filmes

Esta é uma API REST simples para gerenciar uma lista de filmes, construída com Node.js e Express.

## Funcionalidades

- Listar todos os filmes
- Buscar filme por ID
- Filtrar por gênero
- Ordenar por título ou nota
- Paginação

# Endpoints

## GET /movies
Lista todos os filmes com opções de filtro, ordenação e paginação.

Parâmetros de consulta:
- "gênero": Filtrar por gênero (ex: "?gênero=Drama")
- "ordem": Ordenar por "título" ou "nota" (ex: "?ordem=título")
- "page": Página para paginação (opcional)
- "limit": Número de itens por página (opcional)

Se "page" e "limit" não forem usados, a resposta retorna todos os filmes disponíveis.

Exemplo sem paginação: "GET /movies?gênero=Drama&ordem=nota"
Exemplo com paginação: "GET /movies?gênero=Drama&ordem=nota&page=1&limit=5"

Resposta esperada sem paginação:

{
  "total": 12,
  "filmes": [
    {
      "id": 1,
      "título": "Shrek",
      "diretor": "Andrew Adamson",
      "ano": 2001,
      "gênero": "Comédia",
      "nota": 7.9
    }
  ]
}

## POST /movies
Cria um novo filme.

Corpo da requisição (JSON):

{
  "título": "Nome do filme",
  "diretor": "Nome do diretor",
  "ano": 2024,
  "gênero": "Drama",
  "nota": 8.5
}

Resposta de sucesso (201):

{
  "id": 13,
  "título": "Nome do filme",
  "diretor": "Nome do diretor",
  "ano": 2024,
  "gênero": "Drama",
  "nota": 8.5
}

Resposta de erro (400):

{
  "erros": [
    "O campo título é obrigatório e deve ser uma string.",
    "O campo ano é obrigatório e deve ser um inteiro válido entre 1888 e o ano atual."
  ]
}

Validações implementadas:
- "título": obrigatório, string não vazia, único na coleção.
- "diretor": obrigatório, string não vazia.
- "ano": obrigatório, inteiro entre 1888 e o ano atual.
- "gênero": obrigatório, string não vazia.
- "nota": obrigatório, número entre 0 e 10.

## GET /movies/:id
Busca um filme específico pelo ID.

Exemplo: "GET /movies/1"

Resposta esperada:

{
  "id": 1,
  "título": "Shrek",
  "diretor": "Andrew Adamson",
  "ano": 2001,
  "gênero": "Comédia",
  "nota": 7.9
}

## GET /
Retorna uma mensagem de status simples.

Exemplo: "GET /"

Resposta esperada:

{
  "mensagem": "API de filmes funcionando!",
  "status": "sucesso",
  "timestamp": "2026-04-13T00:00:00.000Z"
}

## GET /info
Retorna informações sobre a API.

Exemplo: "GET /info"

Resposta esperada:

{
  "nome": "Minha API REST de filmes",
  "versao": "1.0.0",
  "autor": "Rafael Vasconcelos"
}

## Como executar

1. Instale as dependências: "npm install"
2. Execute o servidor: "npm start" ou "npm run dev" para desenvolvimento
3. A API estará disponível em "http://localhost:3000"

## Estrutura dos dados

Cada filme tem os seguintes campos:
- "id": Identificador único
- "título": Título do filme
- "diretor": Diretor do filme
- "ano": Ano de lançamento
- "gênero": Gênero do filme
- "nota": Nota do filme (0-10)

## Postman Collection

Importe o arquivo "postman_collection.json" no Postman para testar todos os endpoints.

A coleção inclui exemplos de:
- Listar todos os filmes
- Filtrar por gênero
- Ordenar por título ou nota
- Ver todos os filmes sem paginação
- Usar paginação com "page" e "limit"
- Buscar filmes por ID
- Criar novos filmes com "POST /movies" (5 exemplos de recursos)