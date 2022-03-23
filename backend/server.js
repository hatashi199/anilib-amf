require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const app = express();
const path = require("path");
const cors = require("cors");

const { PORT, FRONT_SERVER } = process.env;

const corsOptions = {
  origin: `${FRONT_SERVER}`,
};

// MIDDLEWARES
const { userAuth, userExist } = require("./middlewares/index");

// USERS_CONTROLLERS
const {
  getUser,
  logIn,
  newUser,
  activateUser,
  editUserInfo,
  editUserEmail,
  editUserAvatar,
  editUserPassword,
} = require("./controllers/users/index");

// CONFIGURACION_NECESARIA
app.use(morgan("dev"));
app.use(express.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "static/")));
app.use(cors(corsOptions));

// USERS_ENDPOINTS
app.get("/users/:idUser", userExist, userAuth, getUser);
app.post("/users/login", logIn);
app.post("/users", newUser);
app.put("/users/activate/:registrationCode", activateUser);
app.put("/users/edit-info/:idUser", userExist, userAuth, editUserInfo);
app.put("/users/edit-email/:idUser", userExist, userAuth, editUserEmail);
app.put("/users/edit-avatar/:idUser", userExist, userAuth, editUserAvatar);
app.put("/users/edit-pwd/:idUser", userExist, userAuth, editUserPassword);

// MIDDLEWARE_DE_ERROR
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.httpStatus || 500).send({
    status: `ERROR: ${error.httpStatus}`,
    message: error.message,
  });
});

app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not Found",
  });
});

app.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
);
