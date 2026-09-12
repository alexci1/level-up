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
    const adminSidebarContainer = document.getElementById('adminSidebarContainer');
    const tabBtnCompras = document.getElementById('tabBtnCompras');

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

        if (adminSidebarContainer) {
            adminSidebarContainer.innerHTML = `
                <a href="admin.html" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; background-color: #00E5FF; color: #0b0b0f; text-decoration: none; font-weight: bold; border-radius: 5px; transition: 0.3s; font-size: 13px;">
                    <ion-icon name="settings-outline" style="font-size: 18px;"></ion-icon> PANEL ADMIN
                </a>
            `;
        }
    } else {
        if (profRun) profRun.value = sesion.run || '';
        if (profNombre) profNombre.value = sesion.nombre || '';
        if (profDireccion) profDireccion.value = sesion.direccion || '';
        if (profRegion) profRegion.value = sesion.region || '';
        if (profComuna) profComuna.value = sesion.comuna || '';
        if (profTelefono) profTelefono.value = sesion.telefono || '';
    }

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