require("dotenv").config();
const getDB = require("../../database/db");
const jwt = require("jsonwebtoken");

let connection;
const { SECRET_AUTH } = process.env;

const logIn = async (req, res, next) => {
  try {
    connection = await getDB();

    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      const error = new Error("Missing data");
      error.httpStatus = 400;
      throw error;
    }

    const [userEmail] = await connection.query(
      `SELECT * FROM users WHERE email = ? AND password = SHA2(?, 512)`,
      [email, password]
    );

    const [userName] = await connection.query(
      `SELECT * FROM users WHERE username = ? AND password = SHA2(?, 512)`,
      [username, password]
    );

    if (userEmail.length < 1 && userName.length < 1) {
      const error = new Error("Incorrect Username/Email or Password");
      error.httpStatus = 401;
      throw error;
    }

    if (userEmail[0]?.active === 0 && userName[0]?.active === 0) {
      const error = new Error("User need validation");
      error.httpStatus = 402;
      throw error;
    }

    let tokenInfo;

    if (userName[0]) {
      tokenInfo = {
        idUser: userName[0].id,
        role: userName[0].role,
      };
    } else if (userEmail[0]) {
      tokenInfo = {
        idUser: userEmail[0].id,
        role: userEmail[0].role,
      };
    }

    const token = jwt.sign(tokenInfo, SECRET_AUTH, { expiresIn: "1d" });

    res.send({
      status: 200,
      data: {
        username,
        email,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = logIn;
