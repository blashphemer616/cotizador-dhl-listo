const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Pool de conexiones a la base de datos
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Función para insertar la cotización en la base de datos
async function insertarCotizacion(cotizacion) {
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO cotizaciones (tipo_paquete, peso, ancho, alto, fondo, volumen, origen, destino, distancia, costo_base, costo_volumen, costo_transporte, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                cotizacion.tipo_paquete, cotizacion.peso, cotizacion.ancho, cotizacion.alto, cotizacion.fondo,
                cotizacion.volumen, cotizacion.origen, cotizacion.destino, cotizacion.distancia,
                cotizacion.costo_base, cotizacion.costo_volumen, cotizacion.costo_transporte, cotizacion.total
            ]
        );
        connection.release();
        return result;
    } catch (error) {
        throw error;
    }
}

// Ruta para guardar cotizaciones
app.post('/api/cotizaciones', async (req, res) => {
    try {
        const cotizacion = req.body;

        // Validación básica (¡IMPORTANTE!) - Adaptado a los tipos de datos de la base
        if (!cotizacion.tipo_paquete || typeof cotizacion.tipo_paquete !== 'string' ||
            !cotizacion.peso || typeof cotizacion.peso !== 'number' ||
            !cotizacion.ancho || typeof cotizacion.ancho !== 'number' ||
            !cotizacion.alto || typeof cotizacion.alto !== 'number' ||
            !cotizacion.fondo || typeof cotizacion.fondo !== 'number' ||
            !cotizacion.volumen || typeof cotizacion.volumen !== 'number' ||
            !cotizacion.origen || typeof cotizacion.origen !== 'string' ||
            !cotizacion.destino || typeof cotizacion.destino !== 'string' ||
            !cotizacion.distancia || typeof cotizacion.distancia !== 'number' ||
            !cotizacion.costo_base || typeof cotizacion.costo_base !== 'number' ||
            !cotizacion.costo_volumen || typeof cotizacion.costo_volumen !== 'number' ||
            !cotizacion.costo_transporte || typeof cotizacion.costo_transporte !== 'number' ||
            !cotizacion.total || typeof cotizacion.total !== 'number') {
            return res.status(400).json({ error: 'Datos de cotización incompletos o inválidos.' });
        }

        // Más validación (ejemplo)
        if (cotizacion.peso <= 0 || cotizacion.ancho <= 0 || cotizacion.alto <= 0 || cotizacion.fondo <= 0 || cotizacion.distancia <= 0) {
            return res.status(400).json({ error: 'Los valores de peso, ancho, alto, fondo y distancia deben ser positivos.' });
        }

        const result = await insertarCotizacion(cotizacion);
        console.log('Cotización guardada:', result);
        res.json({ success: true, message: 'Cotización guardada correctamente.' });

    } catch (error) {
        console.error('Error al guardar la cotización:', error);
        // Devuelve el mensaje real del error para facilitar el debug
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor Node.js corriendo en el puerto ${PORT}`);
});