const jwt = require('jsonwebtoken');

// Middleware для проверки JWT-токена
function authenticateToken(req, res, next) {
  // Извлечение токена из заголовка Authorization
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  // Проверка наличия токена
  if (!token) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }

  // Проверка валидности токена
  jwt.verify(token, process.env.GWT_TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Токен недействителен' });
    }
    else {
      const decodedToken = decoded;
      const userIdFromToken = decodedToken.userId;
      const userIdFromRequest = req.params.id;
  
      if (userIdFromToken != userIdFromRequest) {
        return res.status(403).json({ message: 'Доступ запрещен: неверный userId' });
      }
  
      // Если токен валиден, сохраняем информацию о пользователе в объекте запроса
      //console.log('Токен успешно проверен');
      req.user = decoded;
    }
    next();
  });
}

module.exports = authenticateToken;
