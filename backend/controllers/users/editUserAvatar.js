const { format } = require("date-fns");
const getDB = require("../../database/db");
const { delAvatar, saveAvatar } = require("../../helpers");

let connection;

const editUserAvatar = async (req, res, next) => {
  try {
    connection = await getDB();

    const { idUser } = req.params;
    const { avatar } = req.files;

    const [avatarUser] = await connection.query(
      `
            SELECT avatar FROM users WHERE id = ?
        `,
      [idUser]
    );

    let avatarName;

    if (avatarUser[0].avatar) {
      await delAvatar(avatarUser[0].avatar);

      avatarName = await saveAvatar(avatar);
      await connection.query(
        `UPDATE users SET avatar = ?, modifiedAt = ? WHERE id = ?`,
        [avatarName, format(new Date(), "yyyy-MM-dd HH:mm:ss"), idUser]
      );
    }

    const [updatedUserAvatar] = await connection.query(
      `SELECT avatar FROM users WHERE id = ?`,
      [idUser]
    );

    res.send({
      status: 200,
      avatar: updatedUserAvatar[0].avatar,
      message: "Avatar updated",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editUserAvatar;
