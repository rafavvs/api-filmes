// 1. Importar Express
const express = require('express');

// 2. Criar aplicação
const app = express();

// 3. Definir porta
const PORT = 3000;

// 4. Middleware para JSON
app.use(express.json());

// 5. Primeiro endpoint
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API de filmes funcionando!',
        status: 'sucesso',
        timestamp: new Date().toISOString()
    });
});

// 6. Endpoint de informações
app.get('/info', (req, res) => {
    res.json({
        nome: 'Minha API REST de filmes',
        versao: '1.0.0',
        autor: 'Rafael Vasconcelos'
    });
});

// Array de filmes
const filmes = [
    { id: 1, título: 'Shrek', diretor: 'Andrew Adamson', ano: 2001, gênero: 'Comédia', nota: 7.9 },
    { id: 2, título: 'Interestellar', diretor: 'Christopher Nolan', ano: 2014, gênero: 'Sci-Fi', nota: 8.7},
    { id: 3, título: 'O Diabo Veste Prada', diretor: 'David Frankel', ano: 2006, gênero: 'Drama', nota: 7.0 },
    { id: 4, título: 'Frozen', diretor: 'Chris Buck', ano: 2013, gênero: 'Musical', nota: 7.4 },
    { id: 5, título: 'Forrest Gump', diretor: 'Robert Zemeckis', ano: 1994, gênero: 'Drama', nota: 8.8 },
    { id: 6, título: 'Inception', diretor: 'Christopher Nolan', ano: 2010, gênero: 'Sci-Fi', nota: 8.8 },
    { id: 7, título: 'Matrix', diretor: 'The Wachowskis', ano: 1999, gênero: 'Sci-Fi', nota: 8.7 },
    { id: 8, título: 'Bastardos inglórios', diretor: 'Quentin Tarantino', ano: 2009, gênero: 'Ação', nota: 8.4 },
    { id: 9, título: 'IT', diretor: 'Andrés Muschietti', ano: 2017, gênero: 'Horror', nota: 7.3 },
    { id: 10, título: 'Pânico', diretor: 'Wes Craven', ano: 1997, gênero: 'Horror', nota: 7.4 },
    { id: 11, título: 'Jurassic Park', diretor: 'Steven Spielberg', ano: 1993, gênero: 'Aventura', nota: 8.1 },
    { id: 12, título: 'O Lorax', diretor: 'Chris Renaud', ano: 2012, gênero: 'Fantasia', nota: 6.4 }
];

// 7. Endpoint para listar todos os filmes com filtros, ordenação e paginação
app.get('/movies', (req, res) => {
    const { gênero, ordem, page, limit } = req.query;
    let filmesFiltrados = [...filmes];

    // Filtrar por gênero
    if (gênero) {
        filmesFiltrados = filmesFiltrados.filter(filme => filme.gênero.toLowerCase() === gênero.toLowerCase());
    }

    // Ordenar
    if (ordem) {
        if (ordem === 'título') {
            filmesFiltrados.sort((a, b) => a.título.localeCompare(b.título));
        } else if (ordem === 'nota') {
            filmesFiltrados.sort((a, b) => b.nota - a.nota);
        }
    }

    // Paginação
    const possuiPagina = !!page;
    const possuiLimite = !!limit;
    let filmesRetorno = filmesFiltrados;
    const resposta = {
        total: filmesFiltrados.length,
        filmes: filmesRetorno
    };

    if (possuiPagina || possuiLimite) {
        const pagina = parseInt(page || '1', 10);
        const limite = parseInt(limit || '10', 10);

        if ((possuiPagina && (isNaN(pagina) || pagina < 1)) || (possuiLimite && (isNaN(limite) || limite < 1))) {
            return res.status(400).json({ erro: 'page e limit devem ser inteiros positivos quando fornecidos.' });
        }

        const indiceInicial = (pagina - 1) * limite;
        const indiceFinal = indiceInicial + limite;
        filmesRetorno = filmesFiltrados.slice(indiceInicial, indiceFinal);
        resposta.filmes = filmesRetorno;
        resposta.page = pagina;
        resposta.limit = limite;
    }

    res.json(resposta);
});

// 8. Endpoint para criar um filme
app.post('/movies', (req, res) => {
    const { título, diretor, ano, gênero, nota } = req.body;
    const erros = [];

    if (!título || typeof título !== 'string' || título.trim().length === 0) {
        erros.push('O campo título é obrigatório e deve ser uma string.');
    }
    if (!diretor || typeof diretor !== 'string' || diretor.trim().length === 0) {
        erros.push('O campo diretor é obrigatório e deve ser uma string.');
    }
    if (!ano || typeof ano !== 'number' || !Number.isInteger(ano) || ano < 1888 || ano > new Date().getFullYear()) {
        erros.push('O campo ano é obrigatório e deve ser um inteiro válido entre 1888 e o ano atual.');
    }
    if (!gênero || typeof gênero !== 'string' || gênero.trim().length === 0) {
        erros.push('O campo gênero é obrigatório e deve ser uma string.');
    }
    if (nota === undefined || typeof nota !== 'number' || nota < 0 || nota > 10) {
        erros.push('O campo nota é obrigatório e deve ser um número entre 0 e 10.');
    }

    const existeTitulo = filmes.some(filme => filme.título.toLowerCase() === String(título).toLowerCase());
    if (existeTitulo) {
        erros.push('Já existe um filme com esse título.');
    }

    if (erros.length > 0) {
        return res.status(400).json({ erros });
    }

    const novoId = filmes.length > 0 ? Math.max(...filmes.map(f => f.id)) + 1 : 1;
    const novoFilme = { id: novoId, título: título.trim(), diretor: diretor.trim(), ano, gênero: gênero.trim(), nota };

    filmes.push(novoFilme);
    res.status(201).json(novoFilme);
});

// 9. Endpoint para buscar filme por ID
app.get('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const filme = filmes.find(f => f.id === id);
    if (filme) {
        res.json(filme);
    } else {
        res.status(404).json({ erro: 'Filme não encontrado' });
    }
});

// 10. Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
