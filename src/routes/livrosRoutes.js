import express from "express";
import autenticar from "../middlewares/autenticar.js";
import {
  buscarLivro,
  cadastrarLivro,
  editarLivro,
  listarLivros,
  removerLivro
} from "../controllers/livrosController.js";

const router = express.Router();

/**
 * @swagger
 * /livros:
 *   get:
 *     tags:
 *       - Livros
 *     summary: Lista todos os livros
 *     responses:
 *       200:
 *         description: Lista de livros retornada com sucesso
 */
router.get("/", listarLivros);

/**
 * @swagger
 * /livros/{id}:
 *   get:
 *     tags:
 *       - Livros
 *     summary: Busca um livro pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livro encontrado
 *       404:
 *         description: Livro não encontrado
 */
router.get("/:id", buscarLivro);

/**
 * @swagger
 * /livros:
 *   post:
 *     tags:
 *       - Livros
 *     summary: Cadastra um livro
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Livro cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token ausente ou inválido
 */
router.post("/", autenticar, cadastrarLivro);

/**
 * @swagger
 * /livros/{id}:
 *   patch:
 *     tags:
 *       - Livros
 *     summary: Atualiza parcialmente um livro
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livro atualizado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Livro não encontrado
 */
router.patch("/:id", autenticar, editarLivro);

/**
 * @swagger
 * /livros/{id}:
 *   delete:
 *     tags:
 *       - Livros
 *     summary: Remove um livro
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livro removido
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Livro não encontrado
 */
router.delete("/:id", autenticar, removerLivro);

export default router;
