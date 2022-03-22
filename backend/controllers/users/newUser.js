const getDB = require("../../database/db");
const { saveAvatar } = require("../../helpers");
const sendEmail = require("../../sgMail");
const { format } = require("date-fns");

let connection;

const newUser = async (req, res, next) => {
  try {
    connection = await getDB();

    const {
      username,
      email,
      name,
      last_name_1,
      last_name_2,
      gender,
      birthday,
      passsword,
    } = req.body;

    const [userExist] = await connection.query(
      `SELECT username, email FROM users WHERE username = ? AND email = ?`,
      [username, email]
    );

    if (userExist.length > 0) {
      const error = new Error("Username or Email already exists");
      error.httpStatus = 403;
      throw error;
    }

    const registrationCode = cryptoRandomString({ length: 20 });

    await sendEmail({
      to: email,
      subject: `<h1>Activación de cuenta en Anilib</h1>`,
      body: `
        <p>Te acabas de registrar en Anilib.</p>
        </br>
        <span>Correo: ${email}</span>
        <span>Username: ${username}</span>
        </br>
        <a href="${process.env.FRONT_SERVER}/register-activation/${registrationCode}" target="_blank">Activa tu cuenta</a>
      `,
    });

    if (req.files.avatar) {
      const avatar = await saveAvatar(req.files.avatar);

      await connection.query(
        `INSERT INTO users(username, email,name,last_name_1,last_name_2,gender,birthday,avatar,password,registrationCode,createdAt) 
        VALUES (?,?,?,?,?,?,?,'${avatar}',SHA2(?,512),${registrationCode},'${format(
          new Date(),
          "yyyy-MM-dd HH:mm:ss"
        )}')`
      );
    } else {
      await connection.query(
        `INSERT INTO users(username, email,name,last_name_1,last_name_2,gender,birthday,password,registrationCode,createdAt) 
        VALUES (?,?,?,?,?,?,?,SHA2(?,512),${registrationCode},'${format(
          new Date(),
          "yyyy-MM-dd HH:mm:ss"
        )}')`
      );
    }

    res.send({
      status: 200,
      code: registrationCode,
      message: "Account created, look your email to activate it",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = newUser;
