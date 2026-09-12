const DEFAULT_ADMIN = {
    run: "111111111", 
    nombre: "Administrador",
    apellidos: "General",
    email: "admin@duoc.cl",
    fechaNacimiento: "1990-01-01",
    referido: "",
    password: "admin123",
    descuentoDuoc: true,
    rol: "Administrador"
};

const DEFAULT_CLIENT = {
    run: "19011022K",
    nombre: "Matias",
    apellidos: "Latrach",
    email: "matias@duoc.cl",
    fechaNacimiento: "2000-08-22",
    referido: "",
    password: "matias123",
    descuentoDuoc: true,
    rol: "Cliente",
    avatar: "../img/icons/Monkey.avif",
    direccion: "Av. Siempre Viva 742",
    region: "Región Metropolitana",
    comuna: "Santiago",
    telefono: "+56 9 1234 5678"
};

const DEFAULT_CLIENT_2 = {
    run: "182345674",
    nombre: "Alex",
    apellidos: "Carita",
    email: "alex@duoc.cl",
    fechaNacimiento: "1999-05-14",
    referido: "",
    password: "alex123",
    descuentoDuoc: true,
    rol: "Cliente",
    avatar: "../img/icons/Panda.avif",
    direccion: "Av. Vicuña Mackenna 456",
    region: "Región Metropolitana",
    comuna: "Providencia",
    telefono: "+56 9 8765 4321"
};

const DEFAULT_CLIENT_3 = {
    run: "201234568",
    nombre: "Andres",
    apellidos: "Bustamante",
    email: "andres@duoc.cl",
    fechaNacimiento: "2001-11-30",
    referido: "",
    password: "andres123",
    descuentoDuoc: true,
    rol: "Cliente",
    avatar: "../img/icons/Blue-Face-Man.avif",
    direccion: "Calle Las Condes 7890",
    region: "Región Metropolitana",
    comuna: "Las Condes",
    telefono: "+56 9 5555 1234"
};

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem('levelup_usuarios')) || [];
}

function guardarUsuario(usuario) {
    const usuarios = obtenerUsuarios();
    usuarios.push(usuario);
    localStorage.setItem('levelup_usuarios', JSON.stringify(usuarios));
}

function obtenerSesionActiva() {
    return JSON.parse(localStorage.getItem('levelup_sesion_activa')) || null;
}

function cerrarSesion() {
    localStorage.removeItem('levelup_sesion_activa');
    window.location.href = 'index.html';
}

function initData() {
    let usuarios = obtenerUsuarios();
    let huboCambios = false;

    const usuariosIniciales = [DEFAULT_ADMIN, DEFAULT_CLIENT, DEFAULT_CLIENT_2, DEFAULT_CLIENT_3];

    usuariosIniciales.forEach(usrDefault => {
        const existe = usuarios.some(usr => usr.email.toLowerCase() === usrDefault.email.toLowerCase());
        if (!existe) {
            usuarios.push(usrDefault);
            huboCambios = true;
        }
    });

    if (huboCambios) {
        localStorage.setItem('levelup_usuarios', JSON.stringify(usuarios));
    }
}

function validarEmailDominio(email) {
    const dominiosValidos = ['@duoc.cl', '@duocuc.cl', '@profesor.duoc.cl', '@gmail.com'];
    return dominiosValidos.some(dominio => email.toLowerCase().endsWith(dominio));
}

function validarRutChileno(rutFull) {
    if (!/^[0-9]{7,8}[0-9kK]{1}$/.test(rutFull)) return false;
    const cuerpo = rutFull.slice(0, -1);
    let dv = rutFull.slice(-1).toUpperCase();

    let suma = 0;
    let multiplicador = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    let dvEsperado = 11 - (suma % 11);
    if (dvEsperado === 11) dvEsperado = '0';
    else if (dvEsperado === 10) dvEsperado = 'K';
    else dvEsperado = dvEsperado.toString();

    return dv === dvEsperado;
}

document.addEventListener('DOMContentLoaded', () => {
    initData();

    const registroForm = document.getElementById('registroForm');
    if (registroForm) {
        registroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let esValido = true;

            document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

            const run = document.getElementById('regRun').value.trim();
            const nombre = document.getElementById('regNombre').value.trim();
            const apellidos = document.getElementById('regApellidos').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const fechaNacimientoInput = document.getElementById('regFechaNacimiento');
            const fechaNacimiento = fechaNacimientoInput ? fechaNacimientoInput.value : '';
            const referidoInput = document.getElementById('regReferido');
            const referido = referidoInput ? referidoInput.value.trim() : '';
            const password = document.getElementById('regPassword').value.trim();

            if (!validarRutChileno(run)) {
                document.getElementById('errorRegRun').textContent = "RUN inválido. Formato: 1234567K (sin puntos ni guión)";
                esValido = false;
            }

            if (!nombre || nombre.length > 50) {
                document.getElementById('errorRegNombre').textContent = "El nombre es obligatorio (MÁX. 50 caracteres).";
                esValido = false;
            }

            if (!apellidos || apellidos.length > 100) {
                document.getElementById('errorRegApellidos').textContent = "Los apellidos son obligatorios (MÁX. 100 caracteres).";
                esValido = false;
            }

            if (!email || email.length > 100 || !validarEmailDominio(email)) {
                document.getElementById('errorRegEmail').textContent = "Correo no permitido. Permite: @duoc.cl, @duocuc.cl, @profesor.duoc.cl o @gmail.com.";
                esValido = false;
            } else {
                const usuariosExistentes = obtenerUsuarios();
                if (usuariosExistentes.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                    document.getElementById('errorRegEmail').textContent = "El correo ya se encuentra registrado.";
                    esValido = false;
                }
            }

            const errorFecha = document.getElementById('errorRegFechaNacimiento');
            if (!fechaNacimiento) {
                if (errorFecha) errorFecha.textContent = "La fecha de nacimiento es obligatoria.";
                esValido = false;
            } else {
                const hoy = new Date();
                const fechaNac = new Date(fechaNacimiento);
                let edad = hoy.getFullYear() - fechaNac.getFullYear();
                const mes = hoy.getMonth() - fechaNac.getMonth();

                if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
                    edad--;
                }

                if (edad < 18) {
                    if (errorFecha) errorFecha.textContent = "Debes ser mayor de 18 años para registrarte.";
                    esValido = false;
                }
            }

            if (password.length < 4 || password.length > 10) {
                document.getElementById('errorRegPassword').textContent = "La contraseña debe tener entre 4 y 10 caracteres.";
                esValido = false;
            }

            if (esValido) {
                const esDuoc = email.toLowerCase().endsWith('@duoc.cl') || email.toLowerCase().endsWith('@duocuc.cl');

                const nuevoUsuario = {
                    run,
                    nombre,
                    apellidos,
                    email,
                    fechaNacimiento,
                    referido,
                    password,
                    descuentoDuoc: esDuoc,
                    rol: 'Cliente'
                };

                guardarUsuario(nuevoUsuario);
                localStorage.removeItem('levelup_sesion_activa');

                alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión');
                window.location.href = 'login.html';
            }
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const errorGeneral = document.getElementById('loginGeneralError');
            let esValido = true;

            if (!email) {
                document.getElementById('errorLoginEmail').textContent = "El correo es obligatorio.";
                esValido = false;
            } else if (!validarEmailDominio(email)) {
                document.getElementById('errorLoginEmail').textContent = "El correo no pertenece a un dominio válido.";
                esValido = false;
            }

            if (!password) {
                document.getElementById('errorLoginPassword').textContent = "La contraseña es obligatoria.";
                esValido = false;
            } else if (password.length < 4 || password.length > 10) {
                document.getElementById('errorLoginPassword').textContent = "La contraseña debe tener entre 4 y 10 caracteres.";
                esValido = false;
            }

            if (!esValido) return;

            const usuarios = obtenerUsuarios();
            const usuarioEncontrado = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

            if (usuarioEncontrado) {
                localStorage.setItem('levelup_sesion_activa', JSON.stringify(usuarioEncontrado));
                alert(`¡Bienvenido de vuelta, ${usuarioEncontrado.nombre}!`);

                if (usuarioEncontrado.rol === 'Administrador') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                if (errorGeneral) errorGeneral.textContent = "Correo o contraseña incorrectos.";
            }
        });
    }

    const sesion = obtenerSesionActiva();
    const navActions = document.querySelector('.nav-actions');

    if (sesion && navActions) {
        const avatarUser = sesion.avatar || '../img/icons/Mouse.avif';

        navActions.innerHTML = `
            <a href="profile.html" style="display:flex; align-items:center; gap:8px; text-decoration:none;">
                <img src="${avatarUser}" alt="Avatar" style="width:32px; height:32px; border-radius:50%; border:2px solid #00E5FF; object-fit:cover; background:#0b0b0f;">
                <span style="color: #00E5FF; font-weight: bold; font-size: 14px;">${sesion.nombre}</span>
            </a>
            ${sesion.rol === 'Administrador' ? `<a href="admin.html" style="color:#00ff88; font-size: 14px; font-weight:bold; margin-left:5px;">[ADMIN]</a>` : ''}
            <span class="separator"> | </span>
            <a href="cart.html" class="cart-link">
                <ion-icon name="cart"></ion-icon>
                <span>CARRITO</span>
            </a>
            <span class="separator">|</span>
            <button id="btnLogout" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size: 14px; font-weight:bold; font-family:'Montserrat';">CERRAR SESION</button>
        `;

        document.getElementById('btnLogout').addEventListener('click', cerrarSesion);
    }
});