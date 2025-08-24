// middlewares/upload.js
import multer, { diskStorage } from "multer";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";

// 👇 create __dirname manually (ESM doesn’t have it)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, "../uploads/")); // ✅ now works
  },
  filename: (req, file, cb) => {
    const ext = extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

// Accept only images (jpg, jpeg, png)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files allowed!"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

export default upload;
