import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("🚀 ~ file:", file);
    cb(null, "./public/tempImages");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    console.log("file.originalname:::", file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

export default upload;
