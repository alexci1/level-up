document.addEventListener("DOMContentLoaded", () => {

    const session = JSON.parse(localStorage.getItem("levelup_sesion_activa"));

    if (!session || session.rol !== "Administrador") {
        alert("Acceso denegado. Se requieren permisos de Administrador.");
        window.location.href = "login.html";
        return;
    }

    const adminEmailElem = document.getElementById("adminUserEmail");
    if (adminEmailElem) {
        adminEmailElem.textContent = session.email;
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("levelup_sesion_activa");
            window.location.href = "login.html";
        });
    }

    renderProducts();
    renderUsers();

    const productForm = document.getElementById("productForm");
    if (productForm) {
        productForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const code = document.getElementById("prodCode").value.trim();
            const name = document.getElementById("prodName").value.trim();
            const price = Number(document.getElementById("prodPrice").value);
            const stock = Number(document.getElementById("prodStock").value);
            const criticalStock = Number(document.getElementById("prodCriticalStock").value);
            const category = document.getElementById("prodCategory").value;
            const imageInput = document.getElementById("prodImageFile");

            if (!imageInput.files || imageInput.files.length === 0) {
                alert("Por favor selecciona una imagen para el producto.");
                return;
            }

            const file = imageInput.files[0];
            const reader = new FileReader();

            reader.onload = function (uploadEvent) {
                const base64Image = uploadEvent.target.result;

                const newProduct = {
                    code: code,
                    name: name.toUpperCase(),
                    price: price,
                    stock: stock,
                    criticalStock: criticalStock,
                    category: category,
                    image: base64Image
                };

                let products = JSON.parse(localStorage.getItem("levelup_productos")) || [];
                products.push(newProduct);
                localStorage.setItem("levelup_productos", JSON.stringify(products));

                productForm.reset();
                renderProducts();
                alert("¡Producto agregado con éxito!");
            };

            reader.readAsDataURL(file);
        });
    }
});

function initProducts() {
    let productos = JSON.parse(localStorage.getItem("levelup_productos")) || [];
    if (productos.length === 0) {
        productos = [
            { code: "PROD-001", name: "CATAN", price: 27990, stock: 10, criticalStock: 2, category: "juegos", image: "../img/png/catan.png" },
            { code: "PROD-002", name: "SONY PULSE ELITE", price: 199990, stock: 8, criticalStock: 2, category: "accesorios", image: "../img/png/sony.png" },
            { code: "PROD-003", name: "PLAYSTATION 5 SLIM 1TB", price: 799990, stock: 5, criticalStock: 1, category: "consolas", image: "../img/png/ps5.png" },
            { code: "PROD-004", name: "NOTEBOOK ASUS TUF A15", price: 710990, stock: 6, criticalStock: 2, category: "computadores", image: "../img/png/notebook.png" },
            { code: "PROD-005", name: "SILLA COUGAR", price: 129990, stock: 12, criticalStock: 3, category: "sillas", image: "../img/png/silla.png" },
            { code: "PROD-006", name: "LOGITECH G502 X PLUS", price: 125990, stock: 15, criticalStock: 3, category: "mouse", image: "../img/png/mouse.png" },
            { code: "PROD-007", name: "LOGITECH G440", price: 17990, stock: 20, criticalStock: 5, category: "mousepad", image: "../img/png/mousepad.png" },
            { code: "PROD-008", name: "POLERA GAMER ZONE", price: 19990, stock: 25, criticalStock: 5, category: "poleras", image: "../img/png/polera.png" },
            { code: "PROD-009", name: "POLERON GAMER ZONE", price: 29990, stock: 18, criticalStock: 4, category: "polerones", image: "../img/png/poleron.png" },
            { code: "PROD-010", name: "SERVICIO TÉCNICO PS5", price: 85990, stock: 50, criticalStock: 5, category: "servicio", image: "../img/png/ser_tec_ps5.png" }
        ];
        localStorage.setItem("levelup_productos", JSON.stringify(productos));
    }
}

function renderProducts() {
    initProducts();
    const products = JSON.parse(localStorage.getItem("levelup_productos")) || [];
    const tbody = document.getElementById("productTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    products.forEach((prod, index) => {
        const esCritico = prod.stock <= prod.criticalStock;
        const stockBadge = esCritico
            ? `<span style="color: #ff4d4d; font-weight: bold;" title="¡Stock Crítico!">${prod.stock} ⚠️</span>`
            : `${prod.stock}`;

        const imgThumbnail = prod.image ? prod.image : '../img/level-up.png';

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${prod.code}</strong></td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${imgThumbnail}" alt="Img" style="width: 35px; height: 35px; object-fit: contain; background: #0b0b0f; border-radius: 4px; padding: 2px;">
                    <span>${prod.name}</span>
                </div>
            </td>
            <td>$${prod.price.toLocaleString("es-CL")}</td>
            <td>${stockBadge}</td>
            <td>${prod.criticalStock}</td>
            <td>
                <button onclick="cambiarStock(${index}, -1)" style="padding: 4px 8px; background: #ff4d4d; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">-</button>
                <button onclick="cambiarStock(${index}, 1)" style="padding: 4px 8px; background: #00ff88; color: #0b0b0f; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-right: 5px;">+</button>
                <button class="btn-delete" onclick="deleteProduct(${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function cambiarStock(index, cantidad) {
    let products = JSON.parse(localStorage.getItem("levelup_productos")) || [];
    if (products[index]) {
        products[index].stock += cantidad;
        if (products[index].stock < 0) products[index].stock = 0;
        localStorage.setItem("levelup_productos", JSON.stringify(products));
        renderProducts();
    }
}

function renderUsers() {
    const users = JSON.parse(localStorage.getItem("levelup_usuarios")) || [];
    const tbody = document.getElementById("userTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    users.forEach((usr, index) => {
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