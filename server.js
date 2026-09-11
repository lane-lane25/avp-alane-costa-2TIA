import express from "express";
import "dotenv/config";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = 3000;

app.use(express.json());

const livros = [
  {
    id: 1,
    titulo: "O Pequeno Príncipe",
    autor: "Antoine de Saint-Exupéry",
    anoPublicacao: 1943,
    genero: "Literatura",
    disponivel: true
  }
];

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  const tokenSecreto = process.env.TOKEN_SECRETO;

  if (authHeader !== `Bearer ${tokenSecreto}`) {
    return res.status(401).json({
      erro: "Acesso não autorizado. Token ausente ou inválido"
    });
  }

  next();
}

app.get("/", (req, res) => {
  res.json({
    mensagem: "Servidor Express funcionando!",
    disciplina: "Desenvolvimento de Websites",
    bimestre: "3º bimestre"
  });
});

/**
 * @swagger
 * /livros:
 *   get:
 *     tags:
 *       - Livro
 *     summary: Lista todos os livros
 *     description: Retorna todos os livros cadastrados na biblioteca.
 *     responses:
 *       200:
 *         description: Lista de livros retornada com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 titulo: O Pequeno Príncipe
 *                 autor: Antoine de Saint-Exupéry
 *                 anoPublicacao: 1943
 *                 genero: Literatura
 *                 disponivel: true
 */
app.get("/livros", (req, res) => {
  res.json(livros);
});

/**
 * @swagger
 * /livros/{id}:
 *   get:
 *     tags:
 *       - Livro
 *     summary: Busca um livro por ID
 *     description: Retorna os dados de um livro usando seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do livro que será buscado.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Livro encontrado.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               titulo: O Pequeno Príncipe
 *               autor: Antoine de Saint-Exupéry
 *               anoPublicacao: 1943
 *               genero: Literatura
 *               disponivel: true
 *       404:
 *         description: Livro não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               message: Livro não encontrado
 */
app.get("/livros/:id", (req, res) => {
  const id = Number(req.params.id);

  const livro = livros.find((livro) => livro.id === id);

  if (!livro) {
    return res.status(404).json({
      message: "Livro não encontrado"
    });
  }

  res.json(livro);
});

/**
 * @swagger
 * /livros:
 *   post:
 *     tags:
 *       - Livro
 *     summary: Cadastra um novo livro
 *     description: Adiciona um livro à biblioteca. É necessário enviar um Bearer Token válido.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             titulo: Dom Casmurro
 *             autor: Machado de Assis
 *             anoPublicacao: 1899
 *             genero: Romance
 *             disponivel: true
 *     responses:
 *       201:
 *         description: Livro cadastrado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Livro cadastrado com sucesso
 *               livro:
 *                 id: 2
 *                 titulo: Dom Casmurro
 *                 autor: Machado de Assis
 *                 anoPublicacao: 1899
 *                 genero: Romance
 *                 disponivel: true
 *       400:
 *         description: Dados obrigatórios ausentes ou inválidos.
 *       401:
 *         description: Token ausente ou inválido.
 */
app.post("/livros", autenticar, (req, res) => {
  const { titulo, autor, anoPublicacao, genero, disponivel } = req.body;

  if (!titulo || !autor || !anoPublicacao || !genero || typeof disponivel !== "boolean") {
    return res.status(400).json({
      message: "Informe todos os campos do livro corretamente"
    });
  }

  const novoLivro = {
    id: livros.length + 1,
    titulo,
    autor,
    anoPublicacao,
    genero,
    disponivel
  };

  livros.push(novoLivro);

  res.status(201).json({
    mensagem: "Livro cadastrado com sucesso",
    livro: novoLivro
  });
});

/**
 * @swagger
 * /livros/{id}:
 *   patch:
 *     tags:
 *       - Livro
 *     summary: Atualiza parcialmente um livro
 *     description: Altera somente os campos enviados de um livro. É necessário enviar um Bearer Token válido.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do livro que será atualizado.
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             disponivel: false
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               titulo: O Pequeno Príncipe
 *               autor: Antoine de Saint-Exupéry
 *               anoPublicacao: 1943
 *               genero: Literatura
 *               disponivel: false
 *       400:
 *         description: Campo enviado com valor inválido.
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Livro não encontrado.
 */
app.patch("/livros/:id", autenticar, (req, res) => {
  const id = Number(req.params.id);
  const camposPermitidos = ["titulo", "autor", "anoPublicacao", "genero", "disponivel"];
  const camposEnviados = Object.keys(req.body);

  const livro = livros.find((livro) => livro.id === id);

  if (!livro) {
    return res.status(404).json({
      message: "Livro não encontrado"
    });
  }

  if (camposEnviados.some((campo) => !camposPermitidos.includes(campo))) {
    return res.status(400).json({
      message: "O corpo possui campos inválidos"
    });
  }

  if ("disponivel" in req.body && typeof req.body.disponivel !== "boolean") {
    return res.status(400).json({
      message: "O campo disponivel deve ser booleano"
    });
  }

  Object.assign(livro, req.body);
  res.json(livro);
});

/**
 * @swagger
 * /livros/{id}:
 *   delete:
 *     tags:
 *       - Livro
 *     summary: Exclui um livro
 *     description: Remove um livro da biblioteca. É necessário enviar um Bearer Token válido.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do livro que será excluído.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Livro excluído com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               message: Livro removido com sucesso
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Livro não encontrado.
 */
app.delete("/livros/:id", autenticar, (req, res) => {
  const id = Number(req.params.id);

  const livroIndex = livros.findIndex((livro) => livro.id === id);

  if (livroIndex === -1) {
    return res.status(404).json({
      message: "Livro não encontrado"
    });
  }

  livros.splice(livroIndex, 1);

  res.json({
    message: "Livro removido com sucesso"
  });
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Biblioteca de Livros",
      version: "1.0.0",
      description: "API escolar para cadastro e consulta de livros."
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "Token"
        }
      }
    }
  },
  apis: ["./server.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});