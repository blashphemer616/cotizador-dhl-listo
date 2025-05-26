const express = require('express');
const router = express.Router();
const db = require('../db'); // Asegúrate que el archivo db.js esté en la raíz o ajusta la ruta

// Ruta para guardar una cotización
router.post('/guardar', async (req, res) => {
  try {
    const {
      tipo_paquete, peso, ancho, alto, fondo, volumen,
      origen, destino, distancia, costo_base, costo_volumen,
      costo_transporte, total
    } = req.body;

    const [result] = await db.execute(`
      INSERT INTO cotizaciones (
        tipo_paquete, peso, ancho, alto, fondo, volumen, origen, destino,
        distancia, costo_base, costo_volumen, costo_transporte, total
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      tipo_paquete, peso, ancho, alto, fondo, volumen, origen, destino,
      distancia, costo_base, costo_volumen, costo_transporte, total
    ]);

    res.json({ success: true, insertId: result.insertId });
  } catch (error) {
    console.error('Error al guardar cotización:', error);
    res.status(500).json({ success: false, error: 'Error en el servidor' });
  }
});

module.exports = router;
