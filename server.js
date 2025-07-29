require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();


// Configuración ABSOLUTAMENTE NECESARIA
app.use(express.static(path.join(__dirname, 'public')));

// Ruta PRINCIPAL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Agrega esto temporalmente en server.js para debuggear
app.get('/debug', (req, res) => {
  res.json({
    message: "Debug OK",
    paths: {
      static: path.join(__dirname, 'public'),
      indexHTML: path.join(__dirname, 'public', 'index.html')
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  ====================================
  🛒 Sistema de Ventas Multiusuario 🛒
  ====================================
  ✅ Servidor: http://localhost:${PORT}
  ✅ Login:    http://localhost:${PORT}/login
  ====================================
  `);
});