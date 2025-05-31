document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');
    const userRole = localStorage.getItem('userRole');
    const messageElement = document.getElementById('message');
    const adminSection = document.getElementById('adminSection');
    const employeeForm = document.getElementById('employeeForm');
    const employeeIdField = document.getElementById('employeeId');
    const saveEmployeeButton = document.getElementById('saveEmployeeButton');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const clearSearchButton = document.getElementById('clearSearchButton');
    const employeesTableBody = document.querySelector('#employeesTable tbody');
    const adminOnlyCols = document.querySelectorAll('.admin-only-col');

    // Redirigir si no hay token
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Mostrar sección de admin'
    if (userRole === 'admin') {
        adminSection.style.display = 'block';
        adminOnlyCols.forEach(col => col.style.display = 'table-cell'); // Mostrar columna de acciones
    } else {
        adminOnlyCols.forEach(col => col.style.display = 'none'); // Ocultar columna de acciones
    }

    // Botón de cerrar sesión
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        window.location.href = '/login.html';
    });

    // Funcion para mostrar mensajes
    function showMessage(msg, type = 'info') {
        messageElement.textContent = msg;
        messageElement.style.display = 'block';
        if (type === 'success') {
            messageElement.style.backgroundColor = '#d4edda';
            messageElement.style.color = '#155724';
            messageElement.style.borderColor = '#c3e6cb';
        } else if (type === 'error') {
            messageElement.style.backgroundColor = '#f8d7da';
            messageElement.style.color = '#721c24';
            messageElement.style.borderColor = '#f5c6cb';
        } else { 
            messageElement.style.backgroundColor = '#ffeeba';
            messageElement.style.color = '#856404';
            messageElement.style.borderColor = '#ffc107';
        }
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }

    // Funcion para obtener y mostrar empleados
    async function fetchEmployees(searchTerm = '') {
        try {
            const url = searchTerm ? `/api/employees/search?name=${encodeURIComponent(searchTerm)}` : '/api/employees';
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    showMessage('Su sesión ha expirado o no tiene permisos. Por favor, inicie sesión de nuevo.', 'error');
                    setTimeout(() => { window.location.href = '/login.html'; }, 2000);
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const employees = await response.json();
            employeesTableBody.innerHTML = ''; 

            if (employees.length === 0) {
                employeesTableBody.innerHTML = '<tr><td colspan="7">No se encontraron empleados.</td></tr>';
                return;
            }

            employees.forEach(employee => {
                const row = employeesTableBody.insertRow();
                row.insertCell().textContent = employee.id;
                row.insertCell().textContent = employee.nombre;
                row.insertCell().textContent = employee.apellidos;
                row.insertCell().textContent = employee.telefono;
                row.insertCell().textContent = employee.correo_electronico;
                row.insertCell().textContent = employee.direccion;

                const actionsCell = row.insertCell();
                actionsCell.classList.add('employee-actions');

                if (userRole === 'admin') {
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Editar';
                    editButton.addEventListener('click', () => editEmployee(employee));
                    actionsCell.appendChild(editButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Eliminar';
                    deleteButton.classList.add('delete');
                    deleteButton.addEventListener('click', () => deleteEmployee(employee.id));
                    actionsCell.appendChild(deleteButton);
                } else {
                    actionsCell.textContent = 'Sin acciones'; 
                }
            });
        } catch (error) {
            console.error('Error al cargar empleados:', error);
            showMessage('Error al cargar la lista de empleados.', 'error');
        }
    }

    // Cargar empleados al iniciar la página
    fetchEmployees();

    // Lógica para agregar/editar empleado
    employeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = employeeIdField.value;
        const employeeData = {
            nombre: document.getElementById('nombre').value,
            apellidos: document.getElementById('apellidos').value,
            telefono: document.getElementById('telefono').value,
            correo_electronico: document.getElementById('correo_electronico').value,
            direccion: document.getElementById('direccion').value
        };

        try {
            let response;
            if (id) {
                // Editar empleado existente
                response = await fetch(`/api/employees/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(employeeData)
                });
            } else {
                // Agregar nuevo empleado
                response = await fetch('/api/employees', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(employeeData)
                });
            }

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    showMessage('Su sesión ha expirado o no tiene permisos de administrador.', 'error');
                    setTimeout(() => { window.location.href = '/login.html'; }, 2000);
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar empleado.');
            }

            showMessage(`Empleado ${id ? 'actualizado' : 'agregado'} exitosamente.`, 'success');
            employeeForm.reset(); 
            employeeIdField.value = ''; 
            saveEmployeeButton.textContent = 'Agregar Empleado'; 
            fetchEmployees(); 
        } catch (error) {
            console.error('Error al guardar empleado:', error);
            showMessage(`Error al guardar empleado: ${error.message}`, 'error');
        }
    });

    // Funcion para llenar el formulario de edición
    function editEmployee(employee) {
        employeeIdField.value = employee.id;
        document.getElementById('nombre').value = employee.nombre;
        document.getElementById('apellidos').value = employee.apellidos;
        document.getElementById('telefono').value = employee.telefono;
        document.getElementById('correo_electronico').value = employee.correo_electronico;
        document.getElementById('direccion').value = employee.direccion;
        saveEmployeeButton.textContent = 'Actualizar Empleado';
        window.scrollTo(0, document.body.scrollHeight); 
    }

    // Funcion para eliminar empleado
    async function deleteEmployee(id) {
        if (!confirm('¿Está seguro de que desea eliminar este empleado?')) {
            return;
        }

        try {
            const response = await fetch(`/api/employees/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    showMessage('Su sesión ha expirado o no tiene permisos de administrador.', 'error');
                    setTimeout(() => { window.location.href = '/login.html'; }, 2000);
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar empleado.');
            }

            showMessage('Empleado eliminado exitosamente.', 'success');
            fetchEmployees(); 
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            showMessage(`Error al eliminar empleado: ${error.message}`, 'error');
        }
    }

    // Logica de busqueda
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        fetchEmployees(searchTerm);
    });

    // Limpiar 
    clearSearchButton.addEventListener('click', () => {
        searchInput.value = '';
        fetchEmployees();
    });
});