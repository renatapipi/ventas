const reportsTemplate = `
<template id="reports-template">
  <div class="reports-section">
    <h2><i class="fas fa-chart-bar"></i> Reportes</h2>
    
    <div class="report-filters">
      <div class="filter-group">
        <label for="report-type">Tipo de Reporte:</label>
        <select id="report-type">
          <option value="sales">Ventas</option>
          <option value="profits">Ganancias</option>
          <option value="products">Productos</option>
          <option value="employees" class="admin-only">Empleados</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="report-period">Período:</label>
        <select id="report-period">
          <option value="today">Hoy</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
          <option value="custom">Personalizado</option>
        </select>
      </div>
      
      <div class="custom-dates" style="display: none;">
        <div class="filter-group">
          <label for="start-date">Desde:</label>
          <input type="date" id="start-date">
        </div>
        <div class="filter-group">
          <label for="end-date">Hasta:</label>
          <input type="date" id="end-date">
        </div>
      </div>
      
      <button id="generate-report" class="btn-primary">
        <i class="fas fa-filter"></i> Generar Reporte
      </button>
      <button id="export-report" class="btn-secondary">
        <i class="fas fa-file-export"></i> Exportar
      </button>
    </div>
    
    <div class="report-results">
      <div id="report-chart" class="chart-container"></div>
      <table id="report-table" class="report-table">
        <!-- Los datos del reporte se cargarán aquí -->
      </table>
    </div>
  </div>
</template>
`;

document.write(reportsTemplate);