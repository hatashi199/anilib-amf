const getDB = require("../database/db");

let connection;

const userExist = async (req, res, next) => {
  try {
    connection = await getDB();

    const { idUser } = req.params;

    const [user] = await connection.query(`SELECT * FROM users WHERE id = ?`, [
      idUser,
    ]);

    if (user.length < 1) {
      const error = new Error("User not found");
      error.httpStatus = 404;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = userExist;
