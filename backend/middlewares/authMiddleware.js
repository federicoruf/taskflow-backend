const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../config/logger");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        logger.warn(
          `Intento de acceso con token válido pero usuario inexistente ID: ${decoded.id}`,
        );
        return res
          .status(401)
          .json({ message: "No autorizado, usuario no encontrado" });
      }

      logger.info(
        `Usuario ${req.user.email} autenticado correctamente en ${req.originalUrl || req.path}`,
      );

      return next();

    } catch (error) {
      console.error("Error al verificar el token:", error.message);
      res
        .status(401)
        .json({ message: "No autorizado, token fallido o expirado" });
    }
  }

  if (!token) {
    logger.warn(
      `Intento de acceso no autenticado a ruta protegida desde la IP: ${req.ip}`,
    );
    res
      .status(401)
      .json({ message: "No autorizado, no se proporcionó ningún token" });
  }

};

module.exports = { protect };
