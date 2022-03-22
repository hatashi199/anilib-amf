require("dotenv").config();
const sharp = require("sharp");
const path = require("path");
const { ensureDir, unlink } = require("fs-extra");
const { v4: uuidv4 } = require("uuid");

const { AVATAR_UPLOADS } = process.env;
const avatarUploads_Dir = path.join(__dirname, `static/${AVATAR_UPLOADS}`);

const saveAvatar = async (avatar) => {
  try {
    await ensureDir(avatarUploads_Dir);
    const sharpImage = sharp(avatar.data);
    const imgMetadata = await sharpImage.metadata();
    const IMAGE_MAX_WIDTH = 1000;
    if (imgMetadata.width > IMAGE_MAX_WIDTH) {
      sharpImage.resize(IMAGE_MAX_WIDTH);
    }
    const savedNameImg = `${uuidv4()}.jpg`;
    const imgSavedPath = path.join(avatarUploads_Dir, savedNameImg);
    await sharpImage.toFile(imgSavedPath);
    return savedNameImg;
  } catch (error) {
    console.log(error);
  }
};

const delAvatar = (avatar) => {
  try {
    const avatarPath = path.join(avatarUploads_Dir, avatar);
    await unlink(avatarPath);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { saveAvatar, delAvatar };
