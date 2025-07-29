const productsTemplate = `
<template id="products-template">
  <div class="products-section">
    <div class="section-header">
      <h2><i class="fas fa-boxes"></i> Gestión de Productos</h2>
      <button id="add-product-btn" class="btn-primary">
        <i class="fas fa-plus"></i> Nuevo Producto
      </button>
    </div>
    
    <div class="search-bar">
      <input type="text" id="product-search" placeholder="Buscar productos...">
      <button id="search-product-btn"><i class="fas fa-search"></i></button>
    </div>
    
    <table id="products-table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Nombre</th>
          <th>Precio Venta</th>
          <th>Precio Compra</th>
          <th>Stock</th>
          <th>Ganancia</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    
    <div id="product-modal" class="modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h3 id="modal-product-title">Nuevo Producto</h3>
        <form id="product-form">
          <input type="hidden" id="product-id">
          <div class="form-group">
            <label for="product-code">Código:</label>
            <input type="text" id="product-code" required>
          </div>
          <div class="form-group">
            <label for="product-name">Nombre:</label>
            <input type="text" id="product-name" required>
          </div>
          <div class="form-group">
            <label for="product-purchase">Precio Compra:</label>
            <input type="number" id="product-purchase" step="0.01" required>
          </div>
          <div class="form-group">
            <label for="product-sale">Precio Venta:</label>
            <input type="number" id="product-sale" step="0.01" required>
          </div>
          <div class="form-group">
            <label for="product-stock">Stock:</label>
            <input type="number" id="product-stock" required>
          </div>
          <div class="form-group">
            <label for="product-min-stock">Stock Mínimo:</label>
            <input type="number" id="product-min-stock" required>
          </div>
          <button type="submit" class="btn-primary">Guardar</button>
        </form>
      </div>
    </div>
  </div>
</template>
`;

document.write(productsTemplate);