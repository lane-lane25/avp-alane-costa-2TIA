import prisma from "../config/prisma.js";

export function listarTodos() {
  return prisma.livros.findMany({
    orderBy: {
      id: "asc"
    }
  });
}

export function buscarPorId(id) {
  return prisma.livros.findUnique({
    where: { id }
  });
}

export function criar(dados) {
  return prisma.livros.create({
    data: dados
  });
}

export function atualizar(id, dados) {
  return prisma.livros.update({
    where: { id },
    data: dados
  });
}

export function remover(id) {
  return prisma.livros.delete({
    where: { id }
  });
}
