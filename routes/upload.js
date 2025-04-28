// routes/upload.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploads');

router.post('/imagen', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }
  res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;
