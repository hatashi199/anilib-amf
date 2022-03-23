const { format } = require("date-fns");
const getDB = require("../../database/db");

let connection;

const editUserEmail = async (req, res, next) => {
  try {
    connection = await getDB();

    const { idUser } = req.params;
    const { email } = req.body;

    if (req.userAuth.idUser !== Number(idUser)) {
      const error = new Error(`You can't edit information of this user`);
      error.httpStatus = 401;
      throw error;
    }

    const [existingEmail] = await connection.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    if (existingEmail.length > 0) {
      const error = new Error(`There are an user with this email`);
      error.httpStatus = 409;
      throw error;
    }

    await connection.query(
      `UPDATE users SET email = ?, modifiedAt = ? WHERE id = ?`,
      [email, format(new Date(), "yyyy-MM-dd HH:mm:ss", idUser)]
    );

    const [updatedEmail] = await connection.query(
      `SELECT email FROM users WHERE id = ?`,
      [idUser]
    );

    res.send({
      status: 200,
      emailUpdated: updatedEmail[0].email,
      message: "Updated user email",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editUserEmail;
