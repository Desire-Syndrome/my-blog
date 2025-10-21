const multer = require("multer");

const path = require("path");
const fs = require("fs");


// set folders and file types
const settings = {
  avatar: {
    folder: "avatars",
    mimeTypes: ["image/jpeg", "image/png", "image/gif", "image/svg+xml"]
  },
  articleImage: {
    folder: "articles",
    mimeTypes: ["image/jpeg", "image/png", "image/gif", "image/svg+xml"]
  },
};


// create memory storage
const storage = multer.memoryStorage();
// file filter
const fileFilter = (req, file, cb) => {
  const type = file.fieldname;
  if (!settings[type]) {
    return cb(new Error("Invalid field name"), false);
  }
  const isValid = settings[type].mimeTypes.includes(file.mimetype);
  if (!isValid) {
    return cb(new Error(`Unsupported file format for ${type}.`), false);
  }
  cb(null, true);
};

// init multer
const upload = multer({ storage, fileFilter });


// upload file
const saveUploadedFile = async (file, field) => {
  // check file
  const config = settings[field];
  if (!config) throw new Error("Unsupported file type");
  // setup folder
  const uploadDir = path.join(__dirname, `../data/uploads/${config.folder}`);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  // set file name
  const ext = path.extname(file.originalname);
  const filename = `${field}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  // save file
  const fullPath = path.join(uploadDir, filename);
  await fs.promises.writeFile(fullPath, file.buffer);
  return `/uploads/${config.folder}/${filename}`;
};

// delete file
const deleteUploadedFile = async (relativePath) => {
  // create path
  const cleanPath = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath;
  const absolutePath = path.join(__dirname, "..", "data", cleanPath);
  // delete file
  if (fs.existsSync(absolutePath)) {
    await fs.promises.unlink(absolutePath);
  }
};


module.exports = { upload, saveUploadedFile, deleteUploadedFile };