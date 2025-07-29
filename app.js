class App {
  static init() {
    // Configurar los listeners de los botones del menú
    document.querySelectorAll('[data-section]').forEach(button => {
      button.addEventListener('click', () => {
        const section = button.getAttribute('data-section');
        this.loadSection(section);
        
        // Actualizar el botón activo
        document.querySelectorAll('[data-section]').forEach(btn => {
          btn.classList.remove('active');
        });
        button.classList.add('active');
      });
    });
    
    // Inicializar módulos
    Products.init();
    Sales.init();
    Reports.init();
    Users.init();
  }
  
  static async loadSection(section) {
    const content = document.getElementById('content');
    content.innerHTML = '';
    
    // Mostrar el template correspondiente
    const template = document.getElementById(`${section}-template`);
    if (template) {
      const clone = template.content.cloneNode(true);
      content.appendChild(clone);
      
      // Cargar datos de la sección
      switch(section) {
        case 'dashboard':
          await this.loadDashboard();
          break;
        case 'products':
          await Products.loadProducts();
          break;
        case 'sales':
          await Sales.initSale();
          break;
        case 'reports':
          await Reports.initReports();
          break;
        case 'users':
          if (auth.isAdmin()) {
            await Users.loadUsers();
          }
          break;
      }
    }
  }
  
  static async loadDashboard() {
    try {
      // Obtener estadísticas del dashboard
      const response = await fetch('/api/dashboard', {
        headers: auth.getAuthHeader()
      });
      
      if (!response.ok) throw new Error('Error al cargar el dashboard');
      
      const data = await response.json();
      
      // Actualizar UI
      document.getElementById('today-sales').textContent = `$${data.todaySales.toFixed(2)}`;
      document.getElementById('low-stock').textContent = data.lowStock;
      document.getElementById('month-profit').textContent = `$${data.monthProfit.toFixed(2)}`;
      
      // Llenar tabla de ventas recientes
      const salesTable = document.querySelector('#recent-sales-table tbody');
      salesTable.innerHTML = '';
      
      data.recentSales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${sale.id}</td>
          <td>${new Date(sale.date).toLocaleDateString()}</td>
          <td>$${sale.total.toFixed(2)}</td>
          <td>${sale.employee}</td>
        `;
        salesTable.appendChild(row);
      });
    } catch (error) {
      console.error('Dashboard error:', error);
    }
  }
  
  static async fetchData(endpoint, options = {}) {
    try {
      const defaultOptions = {
        headers: auth.getAuthHeader(),
        ...options
      };
      
      const response = await fetch(endpoint, defaultOptions);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la solicitud');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Fetch error (${endpoint}):`, error);
      throw error;
    }
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});