const usersTemplate = `
<template id="users-template">
  <div class="users-section">
    <div class="section-header">
      <h2><i class="fas fa-user-cog"></i> Gestión de Usuarios</h2>
      <button id="add-user-btn" class="btn-primary">
        <i class="fas fa-plus"></i> Nuevo Usuario
      </button>
    </div>
    
    <table id="users-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuario</th>
          <th>Nombre</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    
    <div id="user-modal" class="modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h3 id="modal-user-title">Nuevo Usuario</h3>
        <form id="user-form">
          <input type="hidden" id="user-id">
          <div class="form-group">
            <label for="user-username">Usuario:</label>
            <input type="text" id="user-username" required>
          </div>
          <div class="form-group">
            <label for="user-password">Contraseña:</label>
            <input type="password" id="user-password">
          </div>
          <div class="form-group">
            <label for="user-name">Nombre Completo:</label>
            <input type="text" id="user-name" required>
          </div>
          <div class="form-group">
            <label for="user-role">Rol:</label>
            <select id="user-role" required>
              <option value="admin">Administrador</option>
              <option value="employee">Empleado</option>
            </select>
          </div>
          <div class="form-group">
            <label for="user-status">Estado:</label>
            <select id="user-status" required>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
          <button type="submit" class="btn-primary">Guardar</button>
        </form>
      </div>
    </div>
  </div>
</template>
`;

document.write(usersTemplate);