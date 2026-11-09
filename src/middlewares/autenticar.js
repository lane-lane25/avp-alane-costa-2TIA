export default function autenticar(req, res, next) {
  const tokenSecreto = process.env.TOKEN_SECRETO;
  const authHeader = req.headers.authorization;

  if (!tokenSecreto || authHeader !== `Bearer ${tokenSecreto}`) {
    return res.status(401).json({
      erro: "Acesso não autorizado. Token ausente ou inválido"
    });
  }

  next();
}
