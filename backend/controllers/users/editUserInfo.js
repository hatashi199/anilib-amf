const { format } = require("date-fns");
const getDB = require("../../database/db");

let connection;

const editUserInfo = async (req, res, next) => {
  try {
    connection = await getDB();

    const { idUser } = req.params;
    const { biography, gender, birthday } = req.body;

    if (req.userAuth.idUser !== Number(idUser)) {
      const error = new Error(`You can't edit information of this user`);
      error.httpStatus = 401;
      throw error;
    }

    const [user] = await connection.query(`SELECT * FROM users WHERE id = ?`, [
      idUser,
    ]);

    biography = !biography ? user[0].biography : biography;
    gender = !gender ? user[0].gender : gender;
    birthday = !birthday ? user[0].birthday : birthday;

    await connection.query(
      `
            UPDATE users SET biography = ?, gender = ?, birthday = ?, modifiedAt = ? WHERE id = ?`,
      [
        biography,
        gender,
        birthday,
        format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        idUser,
      ]
    );

    const [updatedUser] = await connection.query(
      `SELECt * FROM users WHERE id = ?`,
      [idUser]
    );

    res.send({
      status: 200,
      updatedInfo: {
        ...updatedUser[0],
        modifiedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      },
      message: "Updated user",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editUserInfo;
