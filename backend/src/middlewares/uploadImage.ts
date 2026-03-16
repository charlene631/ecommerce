// backend/src/middlewares/uploadImage.ts
import multer, { FileFilterCallback } from "multer";
import fs from "node:fs";
import path from "node:path";
import { Request } from "express";

// stockage
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req: Request, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

// filtre de format
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Seuls les fichiers image sont autorisés"));
};

// limite de taille
const limits = { fileSize: 5 * 1024 * 1024 }; // 5 Mo

const upload = multer({ storage, fileFilter, limits });

export default upload;
