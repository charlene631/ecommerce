import multer from "multer";
import fs from "fs";
import path from "path";

// stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads";
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + ext);
    },
});

// filtre de format
const fileFilter = (req, file, cb) => {
    file.mimetype.startsWith("image/")
        ? cb(null, true)
        : cb(new Error("Seuls les fichiers image sont autorisés"), false);
};

// limite de taille
const limits = { fileSize: 5 * 1024 * 1024 }; // 5 Mo

const upload = multer({
    storage,
    fileFilter,
    limits,
});

export default upload;
