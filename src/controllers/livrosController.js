import * as livrosModel from "../models/livrosModel.js";

const camposPermitidos = [
  "titulo",
  "autor",
  "anoPublicacao",
  "genero",
  "disponivel"
];

function validarId(id) {
  return Number.isInteger(id) && id > 0;
}

function validarObjeto(dados) {
  return dados !== null && typeof dados === "object" && !Array.isArray(dados);
}

function validarCampos(dados) {
  if (!validarObjeto(dados)) {
    return false;
  }

  if (
    !dados.titulo ||
    typeof dados.titulo !== "string" ||
    !dados.autor ||
    typeof dados.autor !== "string" ||
    !Number.isInteger(dados.anoPublicacao) ||
    !dados.genero ||
    typeof dados.genero !== "string" ||
    typeof dados.disponivel !== "boolean"
  ) {
    return false;
  }

  return true;
}

export async function listarLivros(req, res) {
  const livros = await livrosModel.listarTodos();
  res.json(livros);
}

export async function buscarLivro(req, res) {
  const id = Number(req.params.id);

  if (!validarId(id)) {
    return res.status(400).json({ message: "ID do livro inválido" });
  }

  const livro = await livrosModel.buscarPorId(id);

  if (!livro) {
    return res.status(404).json({ message: "Livro não encontrado" });
  }

  res.json(livro);
}

export async function cadastrarLivro(req, res) {
  if (!validarCampos(req.body)) {
    return res.status(400).json({
      message: "Informe todos os campos do livro corretamente"
    });
  }

  const livro = await livrosModel.criar({
    titulo: req.body.titulo,
    autor: req.body.autor,
    anoPublicacao: req.body.anoPublicacao,
    genero: req.body.genero,
    disponivel: req.body.disponivel
  });

  res.status(201).json({
    mensagem: "Livro cadastrado com sucesso",
    livro
  });
}

export async function editarLivro(req, res) {
  const id = Number(req.params.id);
  const dados = req.body;

  if (!validarId(id)) {
    return res.status(400).json({ message: "ID do livro inválido" });
  }

  if (!validarObjeto(dados)) {
    return res.status(400).json({
      message: "O corpo da requisição deve ser um objeto JSON"
    });
  }

  const camposEnviados = Object.keys(dados);

  if (
    camposEnviados.length === 0 ||
    camposEnviados.some((campo) => !camposPermitidos.includes(campo))
  ) {
    return res.status(400).json({
      message: "Informe pelo menos um campo válido para atualizar"
    });
  }

  if (
    ("titulo" in dados && (typeof dados.titulo !== "string" || !dados.titulo)) ||
    ("autor" in dados && (typeof dados.autor !== "string" || !dados.autor)) ||
    ("anoPublicacao" in dados && !Number.isInteger(dados.anoPublicacao)) ||
    ("genero" in dados && (typeof dados.genero !== "string" || !dados.genero)) ||
    ("disponivel" in dados && typeof dados.disponivel !== "boolean")
  ) {
    return res.status(400).json({
      message: "Um ou mais campos enviados possuem valor inválido"
    });
  }

  const livroExistente = await livrosModel.buscarPorId(id);

  if (!livroExistente) {
    return res.status(404).json({ message: "Livro não encontrado" });
  }

  const livro = await livrosModel.atualizar(id, dados);
  res.json(livro);
}

export async function removerLivro(req, res) {
  const id = Number(req.params.id);

  if (!validarId(id)) {
    return res.status(400).json({ message: "ID do livro inválido" });
  }

  const livro = await livrosModel.buscarPorId(id);

  if (!livro) {
    return res.status(404).json({ message: "Livro não encontrado" });
  }

  await livrosModel.remover(id);

  res.json({
    message: "Livro removido com sucesso"
  });
}
