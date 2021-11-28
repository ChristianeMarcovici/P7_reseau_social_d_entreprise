//SECURISE LES DONNEES
const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateTokenForUser(userData) {
  return jwt.sign(
    {
      userId: userData.id,
      admin: userData.admin,
      username: userData.username,
    },
    `${process.env.JWT_KEY_TOKEN}`,
    {
      expiresIn: "10h",
    }
  );
}

function parseAuthorization(authorization) {
  return authorization != null ? authorization.replace("Bearer ", "") : null;
}

function getUserId(authorization) {
  const token = parseAuthorization(authorization);
  const jwtToken = jwt.verify(token, `${process.env.JWT_KEY_TOKEN}`);
  console.log("token de get userid");
  console.log(token);
  console.log("jwttoken de get userid");
  console.log(jwtToken);

  if (jwtToken != null) {
    const userId = jwtToken.userId;
    console.log("userId de get userid");
    console.log(userId);
    return userId;
  }
}

module.exports.generateTokenForUser = generateTokenForUser;
module.exports.getUserId = getUserId;
