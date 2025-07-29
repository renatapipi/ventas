const salesTemplate = `
<template id="sales-template">
  <div class="sales-section">
    <h2><i class="fas fa-cash-register"></i> Punto de Venta</h2>
    
    <div class="sale-container">
      <div class="sale-products">
        <div class="search-sale-product">
          <input type="text" id="sale-product-search" placeholder="Buscar producto...">
          <button id="search-sale-product"><i class="fas fa-search"></i></button>
        </div>
        <div id="sale-products-list" class="products-list"></div>
      </div>
      
      <div class="sale-details">
        <div class="sale-summary">
          <h3>Detalle de Venta</h3>
          <div class="client-select">
            <label for="sale-client">Cliente:</label>
            <select id="sale-client">
              <option value="0">Consumidor Final</option>
            </select>
          </div>
          <table id="sale-items-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <div class="sale-totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span id="sale-subtotal">$0.00</span>
            </div>
            <div class="total-row">
              <span>IVA (12%):</span>
              <span id="sale-tax">$0.00</span>
            </div>
            <div class="total-row grand-total">
              <span>Total:</span>
              <span id="sale-total">$0.00</span>
            </div>
          </div>
          <div class="sale-actions">
            <button id="cancel-sale" class="btn-danger">
              <i class="fas fa-times"></i> Cancelar
            </button>
            <button id="complete-sale" class="btn-success">
              <i class="fas fa-check"></i> Finalizar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
`;

document.write(salesTemplate);