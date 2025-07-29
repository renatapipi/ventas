const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// ...existing code...
const backendApp = require('./backend/backend/backedn.js');
app.use('/api', backendApp);
// ...existing code...
// Configuración
const SECRET_KEY = 'tu_clave_secreta_super_segura';
const SALT_ROUNDS = 10;

// Base de datos simulada
let users = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('admin123', SALT_ROUNDS),
    name: 'Administrador',
    role: 'admin',
    status: 'active'
  },
  {
    id: 2,
    username: 'empleado1',
    password: bcrypt.hashSync('empleado123', SALT_ROUNDS),
    name: 'Juan Pérez',
    role: 'employee',
    status: 'active'
  }
];

let products = [
  {
    id: 1,
    code: 'PROD001',
    name: 'Laptop HP',
    purchasePrice: 700,
    salePrice: 950,
    stock: 15,
    minStock: 5
  },
  {
    id: 2,
    code: 'PROD002',
    name: 'Mouse Inalámbrico',
    purchasePrice: 10,
    salePrice: 25,
    stock: 50,
    minStock: 20
  }
];

let sales = [];
let clients = [];

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Rutas de autenticación
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.status === 'active');
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
  }
  
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, name: user.name },
    SECRET_KEY,
    { expiresIn: '8h' }
  );
  
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    }
  });
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.sendStatus(200);
});

// Rutas de usuarios
app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  res.json(users.map(u => ({ ...u, password: undefined })));
});

app.post('/api/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  
  const { username, password, name, role, status } = req.body;
  
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ message: 'El nombre de usuario ya existe' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      name,
      role,
      status: status || 'active'
    };
    
    users.push(newUser);
    res.status(201).json({ ...newUser, password: undefined });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});

// Rutas de productos
app.get('/api/products', authenticateToken, (req, res) => {
  const { search, available } = req.query;
  let filteredProducts = [...products];
  
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) || 
      p.code.toLowerCase().includes(searchTerm)
    );
  }
  
  if (available === 'true') {
    filteredProducts = filteredProducts.filter(p => p.stock > 0);
  }
  
  res.json(filteredProducts);
});

// Rutas de ventas
app.post('/api/sales', authenticateToken, (req, res) => {
  const { clientId, employeeId, items } = req.body;
  
  // Validar stock
  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({ 
        message: `No hay suficiente stock para el producto ${product?.name || item.productId}`
      });
    }
  }
  
  // Calcular totales
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const tax = subtotal * 0.12;
  const total = subtotal + tax;
  
  // Crear venta
  const newSale = {
    id: sales.length + 1,
    date: new Date().toISOString(),
    clientId,
    employeeId,
    items: [...items],
    subtotal,
    tax,
    total
  };
  
  // Actualizar stock
  items.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    product.stock -= item.quantity;
  });
  
  sales.push(newSale);
  res.status(201).json({ saleId: newSale.id });
});

// Rutas de reportes
app.get('/api/reports/:type', authenticateToken, (req, res) => {
  const { type } = req.params;
  const { start, end } = req.query;
  
  // Filtro por fechas
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate >= startDate && saleDate <= endDate;
  });
  
  // Generar reporte según tipo
  switch (type) {
    case 'sales':
      const salesReport = filteredSales.map(sale => ({
        date: sale.date,
        saleId: sale.id,
        client: clients.find(c => c.id === sale.clientId)?.name || 'Consumidor Final',
        employee: users.find(u => u.id === sale.employeeId)?.name || 'Desconocido',
        subtotal: sale.subtotal,
        tax: sale.tax,
        total: sale.total
      }));
      
      // Datos para el gráfico (ventas por día)
      const salesByDay = {};
      filteredSales.forEach(sale => {
        const date = sale.date.split('T')[0];
        salesByDay[date] = (salesByDay[date] || 0) + sale.total;
      });
      
      res.json({
        data: salesReport,
        chart: {
          title: 'Ventas por día',
          labels: Object.keys(salesByDay),
          data: Object.values(salesByDay)
        }
      });
      break;
      
    case 'profits':
      // Calcular ganancias por producto
      const profitData = [];
      const productProfits = {};
      
      filteredSales.forEach(sale => {
        sale.items.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            const unitProfit = item.unitPrice - product.purchasePrice;
            const totalProfit = unitProfit * item.quantity;
            
            if (!productProfits[product.id]) {
              productProfits[product.id] = {
                product: product.name,
                quantity: 0,
                unitProfit: 0,
                totalProfit: 0
              };
            }
            
            productProfits[product.id].quantity += item.quantity;
            productProfits[product.id].unitProfit = unitProfit;
            productProfits[product.id].totalProfit += totalProfit;
          }
        });
      });
      
      res.json({
        data: Object.values(productProfits),
        chart: {
          title: 'Ganancias por producto',
          labels: Object.values(productProfits).map(p => p.product),
          data: Object.values(productProfits).map(p => p.totalProfit)
        }
      });
      break;
      
    default:
      res.status(400).json({ message: 'Tipo de reporte no válido' });
  }
});

// Ruta del dashboard
app.get('/api/dashboard', authenticateToken, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Ventas de hoy
  const todaySales = sales
    .filter(sale => sale.date.startsWith(today))
    .reduce((sum, sale) => sum + sale.total, 0);
  
  // Productos con stock bajo
  const lowStock = products.filter(p => p.stock <= p.minStock).length;
  
  // Ganancias del mes
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthProfit = sales
    .filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    })
    .reduce((sum, sale) => {
      const profit = sale.items.reduce((itemSum, item) => {
        const product = products.find(p => p.id === item.productId);
        return itemSum + (item.unitPrice - product.purchasePrice) * item.quantity;
      }, 0);
      return sum + profit;
    }, 0);
  
  // Ventas recientes (últimas 5)
  const recentSales = sales
    .slice(-5)
    .reverse()
    .map(sale => ({
      id: sale.id,
      date: sale.date,
      total: sale.total,
      employee: users.find(u => u.id === sale.employeeId)?.name || 'Desconocido'
    }));
  
  res.json({
    todaySales,
    lowStock,
    monthProfit,
    recentSales
  });
});

module.exports = app;// ...existing code...
const backendApp = require('./backend/backend/backedn.js');
app.use('/api', backendApp);
// ...existing code...