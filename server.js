import express from 'express';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ventasRoutes from './routes/ventas.js';
import 'dotenv/config';

const app = express();
const currentDirectory = dirname(fileURLToPath(import.meta.url));

// 1. Middleware para procesar req.body
app.use(express.json());

// 2. Documentación
app.use(express.static(join(currentDirectory, 'public')));

// 3. Rutas
app.use('/api/v1/ventas', ventasRoutes);

// 4. Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor Express en http://localhost:${PORT}`);
});