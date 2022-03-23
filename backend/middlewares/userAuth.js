require("dotenv").config();
const getDB = require("../database/db");
const jwt = require("jsonwebtoken");

let connection;
const { SECRET_AUTH } = process.env;

const userAuth = async (req, res, next) => {
  try {
    connection = await getDB();

    const { authorization } = req.headers;

    if (!authorization) {
      const error = new Error("No authorization in header");
      errror.httpStatus = 404;
      throw error;
    }

    let tokenInfo;

    try {
      tokenInfo = jwt.verify(authorization, SECRET_AUTH);
    } catch (error) {
      const errorToken = new Error("No valid Token");
      errorToken.httpStatus = 401;
      throw error;
    }

    req.userAuth = tokenInfo;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = userAuth;
