document.addEventListener('DOMContentLoaded', () => {
    const sesion = typeof obtenerSesionActiva === "function" ? obtenerSesionActiva() : null;

    if (!sesion) {
        alert("Debes iniciar sesión para ver tu perfil.");
        window.location.href = "login.html";
        return;
    }

    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileRole = document.getElementById('profileRole');
    const profileCurrentAvatar = document.getElementById('profileCurrentAvatar');

    const profRun = document.getElementById('profRun');
    const profNombre = document.getElementById('profNombre');
    const profDireccion = document.getElementById('profDireccion');
    const profRegion = document.getElementById('profRegion');
    const profComuna = document.getElementById('profComuna');
    const profTelefono = document.getElementById('profTelefono');

    const profileForm = document.getElementById('profileForm');
    const adminInfoPanel = document.getElementById('adminInfoPanel');
    const tabBtnCompras = document.getElementById('tabBtnCompras');
    const ordersContainer = document.getElementById('ordersContainer');

    if (profileName) profileName.textContent = sesion.nombre || "Usuario";
    if (profileEmail) profileEmail.textContent = sesion.email || "--";
    if (profileRole) profileRole.textContent = sesion.rol ? sesion.rol.toUpperCase() : "CLIENTE";

    const avatarPorDefecto = sesion.rol && sesion.rol.toLowerCase() === 'administrador'
        ? "../img/icons/Smiley-Face-Man.avif"
        : "../img/icons/Mouse.avif";

    const avatarGuardado = sesion.avatar || avatarPorDefecto;
    if (profileCurrentAvatar) profileCurrentAvatar.src = avatarGuardado;

    const esAdmin = sesion.rol && (sesion.rol.toLowerCase() === 'admin' || sesion.rol.toLowerCase() === 'administrador');

    if (esAdmin) {
        if (profileForm) profileForm.style.display = 'none';
        if (tabBtnCompras) tabBtnCompras.style.display = 'none';
        if (adminInfoPanel) adminInfoPanel.style.display = 'block';
    } else {
        if (profRun) profRun.value = sesion.run || '';
        if (profNombre) profNombre.value = sesion.nombre || '';
        if (profDireccion) profDireccion.value = sesion.direccion || '';
        if (profRegion) profRegion.value = sesion.region || '';
        if (profComuna) profComuna.value = sesion.comuna || '';
        if (profTelefono) profTelefono.value = sesion.telefono || '';

        if (ordersContainer) {
            const emailUsuario = sesion.email.toLowerCase().trim();
            const userOrdersKey = `levelup_user_orders_v2_${emailUsuario}`;
            const userOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];

            if (userOrders.length === 0) {
                ordersContainer.innerHTML = `<p style="color: #b8b8c2; text-align: center; padding: 20px;">No tienes compras registradas todavía.</p>`;
            } else {
                ordersContainer.innerHTML = '';
                userOrders.forEach(order => {
                    const orderCard = document.createElement('div');
                    orderCard.style.cssText = "background: #15151c; border: 1px solid #25252d; border-radius: 8px; padding: 20px; margin-bottom: 20px;";

                    let productosHTML = '';
                    order.productos.forEach(prod => {
                        productosHTML += `
                            <div style="display: flex; align-items: center; gap: 15px; margin-top: 10px; border-top: 1px solid #25252d; padding-top: 10px;">
                                <img src="${prod.imagen}" alt="${prod.nombre}" style="width: 50px; height: 50px; object-fit: contain; background: #0b0b0f; border-radius: 4px; padding: 4px;">
                                <div style="flex: 1;">
                                    <h4 style="font-size: 14px; color: #fff; margin-bottom: 4px;">${prod.nombre}</h4>
                                    <p style="font-size: 12px; color: #b8b8c2;">Cantidad: ${prod.cantidad} | Precio: $${prod.precio.toLocaleString('es-CL')}</p>
                                </div>
                            </div>
                        `;
                    });

                    const estadoTexto = order.estado ? order.estado.toUpperCase() : 'EN CAMINO';
                    const esEntregado = estadoTexto === 'ENTREGADO';
                    const estadoBg = esEntregado ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 229, 255, 0.1)';
                    const estadoColor = esEntregado ? '#00ff88' : '#00E5FF';

                    orderCard.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span style="color: #00E5FF; font-weight: bold; font-size: 14px;">Orden: ${order.id}</span>
                            <span style="background: ${estadoBg}; color: ${estadoColor}; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">${estadoTexto}</span>
                        </div>
                        <p style="color: #b8b8c2; font-size: 13px; margin-bottom: 10px; display: flex; align-items: center; gap: 5px;">
                            <ion-icon name="calendar-outline"></ion-icon> ${order.fecha}
                        </p>
                        ${productosHTML}
                        <div style="margin-top: 15px; text-align: right; font-weight: bold; color: #fff; font-size: 15px;">
                            Total Pagado: $${order.total.toLocaleString('es-CL')}
                        </div>
                    `;
                    ordersContainer.appendChild(orderCard);
                });
            }
        }
    }

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');

            const targetTabId = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(targetTabId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    const avatarOpts = document.querySelectorAll('.avatar-opt');
    avatarOpts.forEach(imgOpt => {
        imgOpt.addEventListener('click', () => {
            const nuevoAvatar = imgOpt.getAttribute('data-avatar');
            if (profileCurrentAvatar) profileCurrentAvatar.src = nuevoAvatar;
            sesion.avatar = nuevoAvatar;
            localStorage.setItem('levelup_sesion_activa', JSON.stringify(sesion));

            let listaUsuarios = JSON.parse(localStorage.getItem('levelup_usuarios')) || [];
            const index = listaUsuarios.findIndex(u => u.email.toLowerCase() === sesion.email.toLowerCase());
            if (index !== -1) {
                listaUsuarios[index].avatar = nuevoAvatar;
                localStorage.setItem('levelup_usuarios', JSON.stringify(listaUsuarios));
            }

            alert("¡Avatar actualizado con éxito!");
        });
    });

    if (profileForm && !esAdmin) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sesion.nombre = profNombre.value;
            sesion.direccion = profDireccion.value;
            sesion.region = profRegion.value;
            sesion.comuna = profComuna.value;
            sesion.telefono = profTelefono.value;

            localStorage.setItem('levelup_sesion_activa', JSON.stringify(sesion));

            let listaUsuarios = JSON.parse(localStorage.getItem('levelup_usuarios')) || [];
            const index = listaUsuarios.findIndex(u => u.email.toLowerCase() === sesion.email.toLowerCase());
            if (index !== -1) {
                listaUsuarios[index] = { ...listaUsuarios[index], ...sesion };
                localStorage.setItem('levelup_usuarios', JSON.stringify(listaUsuarios));
            }

            alert("¡Datos de perfil guardados correctamente!");
        });
    }

    const btnSidebarLogout = document.getElementById('btnSidebarLogout');
    if (btnSidebarLogout) {
        btnSidebarLogout.addEventListener('click', () => {
            localStorage.removeItem('levelup_sesion_activa');
            window.location.href = 'index.html';
        });
    }
});