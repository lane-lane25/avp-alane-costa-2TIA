import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";

import prisma from "./src/config/prisma.js";
import swaggerSpec from "./src/config/swagger.js";
import livrosRoutes from "./src/routes/livrosRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API da Biblioteca funcionando!"
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/livros", livrosRoutes);

try {
  await prisma.$connect();
  console.log("Banco de dados conectado!");

  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
} catch (error) {
  console.error("Erro ao iniciar a API ou conectar ao banco:", error);
  await prisma.$disconnect();
  process.exitCode = 1;
}
