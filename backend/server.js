require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();

const { PORT } = process.env;

// MIDDLEWARES
const { userAuth, userExist } = require("./middlewares/index");

// USERS_CONTROLLERS
const { getUser, logIn } = require("./controllers/users/index");

app.use(morgan("dev"));
app.use(express.json());

app.get("/users/:idUser", userExist, userAuth, getUser);
app.post("/users/login", logIn);

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
