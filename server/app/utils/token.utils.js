const jwt = require("jsonwebtoken");

function generateToken(user, res) {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    timestamp: Date.now(),
  }; //занести сюда время, когда токен истечет (тек. + срок действия в unix-формате)?
  const accessToken = jwt.sign(payload, process.env.GWT_ACCESS_TOKEN_KEY, {
    expiresIn: "10m",
  });
  const refreshToken = jwt.sign(payload, process.env.GWT_REFRESH_TOKEN_KEY, {
    expiresIn: "7d",
  }); // Стоит ли хранить refreshToken в массиве? или в бд?

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
  });

  return accessToken;
}

module.exports = { generateToken };
