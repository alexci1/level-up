document.addEventListener("DOMContentLoaded", () => {
    const sesion = typeof obtenerSesionActiva === "function" ? obtenerSesionActiva() : null;

    if (!sesion) {
        alert("Debes iniciar sesión para acceder a tu perfil.");
        window.location.href = "login.html";
        return;
    }

    const emailUsuario = sesion.email ? sesion.email.toLowerCase().trim() : "";

    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");

            tabBtns.forEach(b => b.classList.remove("active"));
            tabPanes.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            document.getElementById(targetTab).classList.add("active");
        });
    });

    const elName = document.getElementById("profileName");
    const elEmail = document.getElementById("profileEmail");
    const elRole = document.getElementById("profileRole");
    const elRun = document.getElementById("profRun");
    const elNombreForm = document.getElementById("profNombre");
    const elDireccion = document.getElementById("profDireccion");
    const elRegion = document.getElementById("profRegion");
    const elComuna = document.getElementById("profComuna");
    const elTelefono = document.getElementById("profTelefono");

    if (elName) elName.textContent = `${sesion.nombre} ${sesion.apellidos || ''}`;
    if (elEmail) elEmail.textContent = sesion.email;
    if (elRole) elRole.textContent = sesion.rol || 'CLIENTE';
    if (elRun) elRun.value = sesion.run || '11111111K';
    if (elNombreForm) elNombreForm.value = `${sesion.nombre} ${sesion.apellidos || ''}`;
    if (elDireccion) elDireccion.value = sesion.direccion || '';
    if (elRegion) elRegion.value = sesion.region || '';
    if (elComuna) elComuna.value = sesion.comuna || '';
    if (elTelefono) elTelefono.value = sesion.telefono || '';

    // Manejo de Avatar
    let selectedAvatar = sesion.avatar || "../img/icons/Monkey.avif";
    const currentAvatarImg = document.getElementById("profileCurrentAvatar");
    if (currentAvatarImg) currentAvatarImg.setAttribute("src", selectedAvatar);

    const avatarOpts = document.querySelectorAll(".avatar-opt");
    avatarOpts.forEach(opt => {
        if (opt.getAttribute("data-avatar") === selectedAvatar) {
            opt.classList.add("active");
        } else {
            opt.classList.remove("active");
        }

        opt.addEventListener("click", () => {
            avatarOpts.forEach(o => o.classList.remove("active"));
            opt.classList.add("active");
            selectedAvatar = opt.getAttribute("data-avatar");
            if (currentAvatarImg) currentAvatarImg.setAttribute("src", selectedAvatar);
        });
    });

    // Guardar cambios de perfil
    const profileForm = document.getElementById("profileForm");
    if (profileForm) {
        profileForm.addEventListener("submit", (e) => {
            e.preventDefault();

            sesion.direccion = elDireccion.value.trim();
            sesion.region = elRegion.value.trim();
            sesion.comuna = elComuna.value.trim();
            sesion.telefono = elTelefono.value.trim();
            sesion.avatar = selectedAvatar;

            localStorage.setItem("levelup_sesion_activa", JSON.stringify(sesion));

            const usuarios = JSON.parse(localStorage.getItem("levelup_usuarios")) || [];
            const idx = usuarios.findIndex(u => u.email.toLowerCase() === emailUsuario);
            if (idx !== -1) {
                usuarios[idx] = { ...usuarios[idx], ...sesion };
                localStorage.setItem("levelup_usuarios", JSON.stringify(usuarios));
            }

            alert("¡Perfil y dirección guardados con éxito!");
            location.reload();
        });
    }

    const logoutBtn = document.getElementById("btnSidebarLogout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            cerrarSesion();
        });
    }

    // COMPRAS DEFAULT INDIVIDUALES
    const COMPRAS_POR_DEFECTO = {
        "matias@duoc.cl": [
            {
                id: "ORD-2026-9812",
                fecha: "05/09/2026",
                estado: "Entregado",
                total: 799990,
                productos: [
                    { nombre: "PLAYSTATION 5 SLIM 1TB", cantidad: 1, precio: 799990, imagen: "../img/png/ps5.png" }
                ]
            },
            {
                id: "ORD-2026-4401",
                fecha: "10/09/2026",
                estado: "En Camino",
                total: 143980,
                productos: [
                    { nombre: "LOGITECH G502 X PLUS", cantidad: 1, precio: 125990, imagen: "../img/png/mouse.png" },
                    { nombre: "LOGITECH G440", cantidad: 1, precio: 17990, imagen: "../img/png/mousepad.png" }
                ]
            }
        ],
        "alex@duoc.cl": [
            {
                id: "ORD-2026-3310",
                fecha: "02/09/2026",
                estado: "Entregado",
                total: 710990,
                productos: [
                    { nombre: "NOTEBOOK ASUS TUF A15", cantidad: 1, precio: 710990, imagen: "../img/png/notebook.png" }
                ]
            }
        ],
        "andres@duoc.cl": [
            {
                id: "ORD-2026-1120",
                fecha: "08/09/2026",
                estado: "En Camino",
                total: 199990,
                productos: [
                    { nombre: "SONY PULSE ELITE", cantidad: 1, precio: 199990, imagen: "../img/png/sony.png" }
                ]
            }
        ]
    };

    function cargarHistorialCompras() {
        const ordersContainer = document.getElementById("ordersContainer");
        if (!ordersContainer) return;

        const userOrdersKey = `levelup_user_orders_v2_${emailUsuario}`;
        let ordenes = JSON.parse(localStorage.getItem(userOrdersKey));

        if (!ordenes) {
            ordenes = COMPRAS_POR_DEFECTO[emailUsuario] || [];
            localStorage.setItem(userOrdersKey, JSON.stringify(ordenes));
        }

        if (ordenes.length === 0) {
            ordersContainer.innerHTML = `<p class="no-orders">Aún no has realizado ninguna compra en Level Up Gamer.</p>`;
            return;
        }

        ordersContainer.innerHTML = ordenes.map(orden => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <span class="order-id">N° ${orden.id}</span>
                        <div class="order-date"><ion-icon name="calendar-outline"></ion-icon> ${orden.fecha}</div>
                    </div>
                    <span class="order-status ${orden.estado === 'Entregado' ? 'status-entregado' : 'status-en-camino'}">
                        ${orden.estado}
                    </span>
                </div>

                <div class="order-items">
                    ${orden.productos.map(p => `
                        <div class="order-item-single">
                            <img src="${p.imagen}" alt="${p.nombre}">
                            <div class="order-item-details">
                                <span class="order-item-name">${p.nombre}</span>
                                <span class="order-item-qty-price">${p.cantidad}x $${Number(p.precio).toLocaleString("es-CL")}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="order-footer">
                    <span class="order-total-label">TOTAL COMPRA:</span>
                    <span class="order-total-price">$${Number(orden.total).toLocaleString("es-CL")}</span>
                </div>
            </div>
        `).join('');
    }

    cargarHistorialCompras();
});