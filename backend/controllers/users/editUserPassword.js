const { format } = require("date-fns");
const getDB = require("../../database/db");

let connection;

const editUserPassword = async (req, res, next) => {
  try {
    connection = await getDB();

    const { idUser } = req.params;
    const { oldPass, newPass } = req.body;

    if (req.userAuth.idUser !== Number(idUser)) {
      const error = new Error(`You can't edit information of this user`);
      error.httpStatus = 401;
      throw error;
    }

    const [userOldPass] = await connection.query(
      `SELECT password FROM users WHERE id = ? AND password = SHA2(?, 512)`,
      [idUser, oldPass]
    );

    if (userOldPass.length < 1) {
      const error = new Error(`Incorrect old password`);
      error.httpStatus = 401;
      throw error;
    }

    await connection.query(
      `UPDATE users SET password = SHA2(?, 512), modifiedAt = ? WHERE id = ?`,
      [newPass, format(new Date(), "yyyy-MM-dd HH:mm:ss"), idUser]
    );

    res.send({
      status: 200,
      message: "Updated password",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editUserPassword;
