require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const app = express();
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

// Middlewares de seguridad

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"], 

        },
    },
}));
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));

// Limitar peticiones
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 peticiones por IP
});
app.use(limiter);

// Logging
app.use(morgan('dev'));

// Parsear JSON
app.use(express.json());

// Archivos estaticos
app.use(express.static('public'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// Ruta para el dashboard 
app.get('/dashboard.html', (req, res) => {
    res.sendFile(__dirname + '/public/dashboard.html');
});

// Ruta de prueba
app.get('/api/status', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;