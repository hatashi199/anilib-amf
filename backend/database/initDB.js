require("dotenv").config();
const getDB = require("./db");
const { faker } = require("@faker-js/faker");
const { format } = require("date-fns");

let connection;

const { ADMIN_PASSWORD, GENERIC_PASSWORD } = process.env;

const initDB = async () => {
  try {
    connection = await getDB();

    console.log("Connection established successfully");

    await connection.query("DROP DATABASE IF EXISTS anilib_amf;");

    console.log("Database deleted");

    await connection.query("CREATE DATABASE anilib_amf;");
    await connection.query("USE anilib_amf;");

    console.log("Database created");

    await connection.query("DROP TABLE IF EXISTS users;");
    await connection.query("DROP TABLE IF EXISTS anime_ratings;");
    await connection.query("DROP TABLE IF EXISTS manga_ratings;");
    await connection.query("DROP TABLE IF EXISTS ani_man_favs");
    await connection.query("DROP TABLE IF EXISTS anime_list");
    await connection.query("DROP TABLE IF EXISTS manga_list");
    await connection.query("DROP TABLE IF EXISTS animes_per_list");
    await connection.query("DROP TABLE IF EXISTS mangas_per_list");

    console.log("Tables deleted");

    await connection.query(`CREATE TABLE users (
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(80) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(80) NOT NULL,
      last_name_1 VARCHAR(80) NOT NULL, 
      last_name_2 VARCHAR(80) NOT NULL,
      biography TEXT,
      gender ENUM('male', 'female', 'other') NOT NULL,
      birthday DATE,
      avatar VARCHAR(200),
      role ENUM('regular', 'admin') NOT NULL,
      password VARCHAR(200) NOT NULL,
      registrationCode VARCHAR(100),
      recoverCode VARCHAR(100),
      deleted BOOLEAN DEFAULT 0,
      active BOOLEAN DEFAULT 0,
      createdAt DATETIME,
      modifiedAt DATETIME
    );`);

    await connection.query(`CREATE TABLE anime_ratings (
      id_user INT UNSIGNED,
        FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
      id_anime INT UNSIGNED,
      rating TINYINT
    );`);

    await connection.query(`CREATE TABLE manga_ratings (
      id_user INT UNSIGNED,
        FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
      id_manga INT UNSIGNED,
      rating TINYINT
    );`);

    await connection.query(`CREATE TABLE ani_man_favs (
      id_user INT UNSIGNED,
        FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
      id_anime INT UNSIGNED,
      id_manga INT UNSIGNED
    );`);

    await connection.query(`CREATE TABLE anime_list (
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(80) UNIQUE,
      id_user INT UNSIGNED,
        FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
    );`);

    await connection.query(`CREATE TABLE manga_list (
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(80) UNIQUE,
      id_user INT UNSIGNED,
        FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
    );`);

    await connection.query(`CREATE TABLE animelist_animes (
      id_anilist INT UNSIGNED,
        FOREIGN KEY (id_anilist) REFERENCES anime_list (id) ON DELETE CASCADE ON UPDATE CASCADE,
      id_user INT UNSIGNED,
        FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
    )`);

    await connection.query(`CREATE TABLE mangalist_mangas (
      id_manlist INT UNSIGNED,
        FOREIGN KEY (id_manlist) REFERENCES manga_list (id) ON DELETE CASCADE ON UPDATE CASCADE,
      id_user INT UNSIGNED,
        FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
    )`);

    console.log("Tables created");

    await connection.query(`INSERT INTO users (username, email,name,last_name_1,last_name_2,biography,gender,birthday,avatar,role,password,active,createdAt) VALUES
    ('hatashi199','alejandromf_199@hotmail.com','Alejandro','Mariño','Fandiño',null,'male','1995-08-15',null,'admin',SHA2('${ADMIN_PASSWORD}', 512),true,'${format(
      new Date(),
      "yyyy-MM-dd HH:mm:ss"
    )}')`);

    console.log("Admin user added");

    for (let i = 1; i <= 10; i++) {
      const sqlDate = new Date(faker.date.between("1950-01-01", "2020-12-31"));

      const fakeData = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        name: faker.name.firstName(),
        lastName1: faker.name.lastName(),
        lastName2: faker.name.lastName(),
        biography: null,
        gender: faker.random.arrayElement(["male", "female", "other"]),
        birthday: format(sqlDate, "yyyy-MM-dd"),
        avatar: null,
        password: GENERIC_PASSWORD,
        active: true,
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };

      await connection.query(`INSERT INTO users (username, email,name,last_name_1,last_name_2,biography,gender,birthday,avatar,password,active,createdAt) VALUES
        ('${fakeData.username}','${fakeData.email}','${fakeData.name}','${fakeData.lastName1}','${fakeData.lastName2}','${fakeData.biography}','${fakeData.gender}','${fakeData.birthday}','${fakeData.avatar}',SHA2('${fakeData.password}',512),${fakeData.active},'${fakeData.createdAt}');
      `);

      console.log(`Regular user ${i} added`);
    }
  } catch (error) {
    console.log(error);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
};

initDB();
