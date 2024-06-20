const jwt = require("jsonwebtoken");

// Middleware для проверки JWT-токена
const authenticateToken = async (req, res, next) => {
  let accessToken =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (accessToken) {
    try {
      req.user = jwt.verify(accessToken, process.env.GWT_ACCESS_TOKEN_KEY);
      console.log(req.user);
      const userIdFromToken = req.user.userId;
      const userIdFromRequest =
        req.query.idUser || req.params.idUser || req.params.id; //Потом оставить только User
      console.log(req.user, userIdFromToken, userIdFromRequest);
      if (userIdFromToken != userIdFromRequest) {
        return res
          .status(403)
          .json({ message: "Доступ запрещен: неверный userId" });
      }
      console.log("Успешно проверен Access Token!");
      return next(); // Access Token is valid, proceed to the next middleware or route handler
    } catch (err) {
      console.error("Access token invalid or expired:", err.message);
      return res.sendStatus(403);
    }
  } else {
    return res.sendStatus(401); // Подумать по поводу статусов ошибок
  }
};

module.exports = authenticateToken;
