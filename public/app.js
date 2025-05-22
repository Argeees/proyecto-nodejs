// public/app.js

// Si estamos en login.html
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      document.getElementById('mensaje').textContent = 'Credenciales incorrectas';
    }
  });
}

// Si estamos en dashboard.html
if (window.location.pathname.endsWith('dashboard.html')) {
  const token = localStorage.getItem('token');

  fetch('/api/employees', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
    .then(res => res.json())
    .then(data => {
      const empleadosDiv = document.getElementById('empleados');
      empleadosDiv.innerHTML = '<h3>Empleados:</h3>' + data.map(emp => `
        <p>${emp.nombre} ${emp.apellidos} - ${emp.correo}</p>
      `).join('');
    });

  window.logout = () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
}
