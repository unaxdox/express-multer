var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de Multer para la subida de archivos
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

// Configuración de Multer para los límites de tamaño y los tipos de archivo permitidos
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limitar tamaño de archivo a 2MB
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
            cb(null, true);  // Solo permitir archivos PNG, JPG o JPEG
        } else {
            cb(new Error('Solo se permiten archivos PNG, JPG o JPEG'));
        }
    }
});

// Ruta GET para servir el formulario HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/form.html'));
});

// Ruta POST para procesar la subida de datos
router.post('/', upload.single('avatar'), (req, res) => {
    if (req.file && req.body.izena) {
        const userIzena = req.body.izena;  // Captura el nombre del usuario (izena)
        const filePath = `/uploads/${req.file.filename}`;  // Ruta del archivo subido

        // Enviar la información al cliente como parámetros de URL
        res.redirect(`/profile?izena=${userIzena}&file=${filePath}`);
    } else {
        res.status(400).send('Faltan datos: izena o archivo.');
    }
});

// Middleware para manejar errores de Multer
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.log('Error de Multer:', err.message);
        return res.status(400).send(err.message);
    }
    if (err) {
        console.log('Error:', err.message);
        return res.status(400).send(err.message);
    }
    next();
});

module.exports = router;
