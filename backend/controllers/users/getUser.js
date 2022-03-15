const getDB = require("../../database/db");

let connection;

const getUser = async (req, res, next) => {
  try {
    connection = await getDB();

    const { idUser } = req.params;

    const [user] = await connection.query(`SELECT * FROM users WHERE id = ?`, [
      idUser,
    ]);

    if (user[0].id !== req.userAuth.idUser && req.userAuth.role !== "admin") {
      const error = new Error(
        `You don't have permissions to access at this information`
      );
      error.httpStatus = 403;
      throw error;
    }

    res.send({
      status: 200,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUser;
