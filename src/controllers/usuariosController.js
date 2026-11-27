import bcrypt from "bcrypt";
import * as usuariosModel from "../models/usuariosModel.js";

export async function cadastrarUsuario(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      message: "Informe nome, email e senha"
    });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const novoUsuario = await usuariosModel.cadastrarUsuario({
    nome,
    email,
    senhaHash
  });

  res.status(201).json({
    message: "Usuário cadastrado com sucesso",
    usuario: novoUsuario
  });
}

export async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      message: "Informe email e senha"
    });
  }

  const usuario = await usuariosModel.buscarPorEmail(email);

  if (!usuario) {
    return res.status(401).json({
      message: "Email ou senha inválidos"
    });
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash);

  if (!senhaCorreta) {
    return res.status(401).json({
      message: "Email ou senha inválidos"
    });
  }

  res.json({
    message: "Login efetuado com sucesso.",
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    }
  });
}
