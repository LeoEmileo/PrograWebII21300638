const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los productos
router.get('/', (req, res) => {
  db.query('SELECT * FROM productos', (err, resultados) => {
    if (err) return res.status(500).send(err);
    res.json(resultados);
  });
});

module.exports = router;
