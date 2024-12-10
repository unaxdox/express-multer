var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../public/uploads/');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); 
        }
        cb(null, uploadPath); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); 
        const ext = path.extname(file.originalname); 
        const baseName = path.basename(file.originalname, ext); 
        cb(null, `${baseName}-${uniqueSuffix}${ext}`); 
    }
});

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.redirect('form.html');
});

router.post('/', upload.single('avatar'), (req, res) => {
    console.log(req.file); 
    res.send("Jasota"); 
});

module.exports = router;
