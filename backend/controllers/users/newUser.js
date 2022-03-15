const getDB = require("../../database/db");

let connection;

const newUser = async (req, res, next) => {
  try {
    connection = await getDB();
  } catch (error) {
    next(error);
  }
};

module.exports = newUser;
