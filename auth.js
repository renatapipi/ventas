class Auth {
  constructor() {
    this.currentUser = null;
    this.token = null;
    this.initEventListeners();
  }

  /**
   * Inicializa los event listeners
   */
  initEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupLogin();
      this.setupLogout();
      this.checkInitialAuth();
    });
  }

  /**
   * Configura el evento de login
   */
  setupLogin() {
    const loginBtn = document.getElementById('login-btn');
    if (!loginBtn) return;

    loginBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await this.handleLogin();
    });
  }

  /**
   * Configura el evento de logout
   */
  setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.logout();
    });
  }

  /**
   * Maneja el proceso de login
   */
  async handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('login-error');

    if (!username || !password) {
      errorMessage.textContent = 'Por favor ingrese usuario y contraseña';
      return;
    }

    try {
      const user = await this.login(username, password);
      this.updateUIAfterLogin(user);
    } catch (error) {
      errorMessage.textContent = error.message;
      console.error('Login error:', error);
    }
  }

  /**
   * Actualiza la UI después del login exitoso
   * @param {Object} user - Datos del usuario
   */
  updateUIAfterLogin(user) {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('current-user').textContent = `Bienvenido, ${user.name}`;
    
    if (this.isAdmin()) {
      document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = 'block';
      });
      document.body.classList.add('user-admin');
    }
    
    if (typeof App !== 'undefined' && App.loadSection) {
      App.loadSection('dashboard');
    }
  }

  /**
   * Verifica la autenticación al cargar la página
   */
  async checkInitialAuth() {
    const isAuthenticated = await this.checkAuth();
    if (!isAuthenticated) return;

    document.getElementById('login-form').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('current-user').textContent = `Bienvenido, ${this.currentUser.name}`;
    
    if (this.isAdmin()) {
      document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = 'block';
      });
      document.body.classList.add('user-admin');
    }
    
    if (typeof App !== 'undefined' && App.loadSection) {
      App.loadSection('dashboard');
    }
  }

  /**
   * Método para iniciar sesión
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} - Datos del usuario autenticado
   */
  async login(username, password) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error de autenticación');
    }

    const data = await response.json();
    this.currentUser = data.user;
    this.token = data.token;

    localStorage.setItem('authToken', this.token);
    localStorage.setItem('userData', JSON.stringify(this.currentUser));

    return this.currentUser;
  }

  /**
   * Método para cerrar sesión
   */
  logout() {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/';
  }

  /**
   * Verifica si hay una sesión activa
   * @returns {Promise<boolean>} - True si está autenticado
   */
  async checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        this.logout();
        return false;
      }

      const userData = localStorage.getItem('userData');
      if (!userData) {
        this.logout();
        return false;
      }

      this.currentUser = JSON.parse(userData);
      this.token = token;
      return true;
    } catch (error) {
      console.error('Auth verification error:', error);
      this.logout();
      return false;
    }
  }

  /**
   * Verifica si el usuario es administrador
   * @returns {boolean} - True si es admin
   */
  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  /**
   * Obtiene los headers de autenticación
   * @returns {Object} - Headers para las peticiones
   */
  getAuthHeader() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }
}

// Instancia global de Auth
const auth = new Auth();