const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  const accessToken = authorizationHeader && authorizationHeader.split(" ")[1];

  if (!accessToken) {
    return res.sendStatus(403); // Подумать по поводу статусов ошибок
    //return res.status(401).json({ message: "Access token is missing" }); // Используйте статус 401 для отсутствия токена
  }

  try {
    req.user = jwt.verify(accessToken, process.env.GWT_ACCESS_TOKEN_KEY);
    const userIdFromToken = req.user.userId;
    const userIdFromRequest =
      req.query.idUser || req.params.idUser || req.body.params.idUser;

    if (userIdFromToken != userIdFromRequest) {
      return res
        .status(403)
        .json({ message: "Доступ запрещен: неверный userId" });
    }
    return next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Access token is invalid or expired" });
  }
};

module.exports = authenticateToken;
