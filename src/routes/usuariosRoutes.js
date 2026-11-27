import express from "express";
import {
  cadastrarUsuario,
  login
} from "../controllers/usuariosController.js";

const router = express.Router();

/**
 * @swagger
 * /usuarios:
 *   post:
 *     tags:
 *       - Usuários
 *     summary: Cadastra um usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nome: Ana Souza
 *             email: ana@email.com
 *             senha: 123456
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Campos obrigatórios não informados
 */
router.post("/", cadastrarUsuario);

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     tags:
 *       - Usuários
 *     summary: Realiza login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: ana@email.com
 *             senha: 123456
 *     responses:
 *       200:
 *         description: Login efetuado com sucesso
 *       400:
 *         description: Email ou senha não informados
 *       401:
 *         description: Email ou senha inválidos
 */
router.post("/login", login);

export default router;
