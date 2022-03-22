const getDB = require("../../database/db");

let connection;

const activateUser = async (req, res, next) => {
  try {
    connection = await getDB();

    const { registrationCode } = req.params;

    const [userRegisCode] = await connection.query(
      `SELECT * FROM users WHERE registrationCode = ?`,
      [registrationCode]
    );

    if (userRegisCode.length < 1) {
      const error = new Error(`There isn't a user with this code`);
      error.httpStatus = 404;
      throw error;
    }

    await connection.query(
      `UPDATE users SET active = true, registrationCode = NULL WHERE registrationCode = ?`,
      [registrationCode]
    );

    res.send({
      status: 200,
      message: "User activated",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = activateUser;
