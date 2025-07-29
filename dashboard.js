const dashboardTemplate = `
<template id="dashboard-template">
  <div class="dashboard">
    <h2><i class="fas fa-tachometer-alt"></i> Panel de Control</h2>
    <div class="stats-container">
      <div class="stat-card">
        <h3>Ventas Hoy</h3>
        <p id="today-sales">$0.00</p>
        <i class="fas fa-calendar-day"></i>
      </div>
      <div class="stat-card">
        <h3>Productos Bajos</h3>
        <p id="low-stock">0</p>
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <div class="stat-card">
        <h3>Ganancias Mes</h3>
        <p id="month-profit">$0.00</p>
        <i class="fas fa-chart-line"></i>
      </div>
    </div>
    <div class="recent-sales">
      <h3>Ventas Recientes</h3>
      <table id="recent-sales-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Vendedor</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</template>
`;

document.write(dashboardTemplate);