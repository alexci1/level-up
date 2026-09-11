// admin.js - Versión Final Corregida y Unificada

document.addEventListener("DOMContentLoaded", () => {
    // 1. Control de Permisos: Verificar sesión activa desde 'levelup_sesion_activa'
    const session = JSON.parse(localStorage.getItem("levelup_sesion_activa"));

    if (!session || session.rol !== "Administrador") {
        alert("Acceso denegado. Se requieren permisos de Administrador.");
        window.location.href = "login.html";
        return;
    }

    // Mostrar correo del usuario en el encabezado
    const adminEmailElem = document.getElementById("adminUserEmail");
    if (adminEmailElem) {
        adminEmailElem.textContent = session.email;
    }

    // Botón de Cerrar Sesión
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("levelup_sesion_activa");
            window.location.href = "login.html";
        });
    }

    // 2. Cargar datos iniciales en las tablas
    renderProducts();
    renderUsers();

    // 3. Formulario para Agregar Nuevo Producto
    const productForm = document.getElementById("productForm");
    if (productForm) {
        productForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const newProduct = {
                code: document.getElementById("prodCode").value.trim(),
                name: document.getElementById("prodName").value.trim(),
                price: Number(document.getElementById("prodPrice").value),
                stock: Number(document.getElementById("prodStock").value),
                criticalStock: Number(document.getElementById("prodCriticalStock").value)
            };

            let products = JSON.parse(localStorage.getItem("levelup_productos")) || [];
            products.push(newProduct);
            localStorage.setItem("levelup_productos", JSON.stringify(products));

            productForm.reset();
            renderProducts();
        });
    }
});

// Inicializador de Productos Predeterminados
function initProducts() {
    let productos = JSON.parse(localStorage.getItem("levelup_productos")) || [];
    if (productos.length === 0) {
        productos = [
            { code: "PROD-001", name: "CATAN", price: 27990, stock: 10, criticalStock: 2 },
            { code: "PROD-002", name: "SONY PULSE ELITE", price: 199990, stock: 8, criticalStock: 2 },
            { code: "PROD-003", name: "PLAYSTATION 5 SLIM 1TB", price: 799990, stock: 5, criticalStock: 1 },
            { code: "PROD-004", name: "NOTEBOOK ASUS TUF A15", price: 710990, stock: 6, criticalStock: 2 },
            { code: "PROD-005", name: "SILLA COUGAR", price: 129990, stock: 12, criticalStock: 3 },
            { code: "PROD-006", name: "LOGITECH G502 X PLUS", price: 125990, stock: 15, criticalStock: 3 },
            { code: "PROD-007", name: "LOGITECH G440", price: 17990, stock: 20, criticalStock: 5 },
            { code: "PROD-008", name: "POLERA GAMER ZONE", price: 19990, stock: 25, criticalStock: 5 },
            { code: "PROD-009", name: "POLERON GAMER ZONE", price: 29990, stock: 18, criticalStock: 4 },
            { code: "PROD-010", name: "SERVICIO TÉCNICO PS5", price: 85990, stock: 50, criticalStock: 5 }
        ];
        localStorage.setItem("levelup_productos", JSON.stringify(productos));
    }
}

// Renderizado de Tabla de Productos
function renderProducts() {
    initProducts();
    const products = JSON.parse(localStorage.getItem("levelup_productos")) || [];
    const tbody = document.getElementById("productTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    products.forEach((prod, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${prod.code}</strong></td>
            <td>${prod.name}</td>
            <td>$${prod.price.toLocaleString("es-CL")}</td>
            <td>${prod.stock}</td>
            <td>${prod.criticalStock}</td>
            <td>
                <button class="btn-delete" onclick="deleteProduct(${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Renderizado de Tabla de Usuarios
function renderUsers() {
    // Lee desde la clave global unificada 'levelup_usuarios'
    const users = JSON.parse(localStorage.getItem("levelup_usuarios")) || [];
    const tbody = document.getElementById("userTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    users.forEach((usr, index) => {
        // Soporta tanto usr.apellidos como usr.apellido
        const apellidoMostrar = usr.apellidos || usr.apellido || '';
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${usr.run}</td>
            <td>${usr.nombre} ${apellidoMostrar}</td>
            <td>${usr.email}</td>
            <td><strong>${usr.rol}</strong></td>
            <td>
                ${usr.rol !== "Administrador" ? `<button class="btn-delete" onclick="deleteUser(${index})">Eliminar</button>` : '<em>Protegido</em>'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Funciones de Eliminación
function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem("levelup_productos")) || [];
    products.splice(index, 1);
    localStorage.setItem("levelup_productos", JSON.stringify(products));
    renderProducts();
}

function deleteUser(index) {
    let users = JSON.parse(localStorage.getItem("levelup_usuarios")) || [];
    users.splice(index, 1);
    localStorage.setItem("levelup_usuarios", JSON.stringify(users));
    renderUsers();
}