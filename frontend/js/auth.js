function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem('levelup_usuarios')) || []
};

function guardarUsuario(usuario) {
    const usuarios = obtenerUsuarios();
    usuarios.push(usuario);
    localStorage.setItem('levelup_usuarios', JSON.stringify(usuarios));
}

function obtenerSesionActiva() {
    return JSON.parse(localStorage.getItem('levelup_sesion_activa'))
        || null;
}

function cerrarSesion() {
    localStorage.removeItem('levelup_sesion_activa');
    window.location.href = 'index.html';
}

function validarEmailDominio(email) {
    const dominiosValidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
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
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
    }

    let dvEsperado = 11 - (suma % 11);
    if (dvEsperado === 11) dvEsperado = '0';
    else if (dvEsperado === 10) dvEsperado = 'K';
    else dvEsperado = dvEsperado.toString();

    return dv === dvEsperado;
}


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

        const password = document.getElementById('regPassword').value.trim();

        if (!validarRutChileno(run)) {
            document.getElementById('errorRegRun').textContent = "RUN inválido. El formato esperado es 1234567K (sin puntos ni guión)";
            esValido = false;
        }

        if (!nombre || nombre.length > 50) {
            document.getElementById('errorRegNombre').textContent = "El nombre es obligatorio (MAX. 50 caracteres)."
            esValido = false;
        }

        if (!apellidos || apellidos.length > 100) {
            document.getElementById('errorRegApellidos').textContent = "Los apellidos son obligatorio (MAX. 100 caracteres)."
            esValido = false;
        }

        if (!email || email.length > 100 || !validarEmailDominio(email)) {
            document.getElementById('errorRegEmail').textContent = "Correo no permitido. Solo dominios: @duoc.cl, @profesor.duoc.cl y @gmail.com."
            esValido = false;
        } else {
            const usuariosExistentes = obtenerUsuarios();
            if (usuariosExistentes.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                document.getElementById('errorRegEmail').textContent = "El correo ya se encuentra registrado.";
                esValido = false;
            }

        }

        if (password.length < 4 || password.length > 10) {
            document.getElementById('errorRegPassword').textContent = "La constraseña debe tener entre 4 a 10 caracteres.";
            esValido = false;
        }

        if (esValido) {
            const nuevoUsuario = {
                run,
                nombre,
                apellidos,
                email,
                password,
                rol: 'Cliente'
            };

            guardarUsuario(nuevoUsuario);
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

        if (!validarEmailDominio(email)) {
            document.getElementById('errorLoginEmail').textContent = "El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com.";
            return;
        }

        if (password.length < 4 || password.length > 10) {
            document.getElementById('errorLoginPassword').textContent = "La constraseña debe tener entre 4 y 10 caracteres";
            return;
        }

        const usuarios = obtenerUsuarios();
        const usuarioEncontrado = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if (usuarioEncontrado) {
            localStorage.setItem('levelup_sesion_activa', JSON.stringify(usuarioEncontrado));
            alert(`¡Bienvenido de vuelta, ${usuarioEncontrado.nombre}!`);

            if (usuarioEncontrado.rol === 'Administrador') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'index.html'
            }
        } else {
            errorGeneral.textContent = "Correo o contraseña incorrectos.";
        }

    });
}

document.addEventListener('DOMContentLoaded', () => {
    const sesion = obtenerSesionActiva();
    const navActions = document.querySelector('.nav-actions');

    if (sesion && navActions) {
        navActions.innerHTML = `<span style="color: #00E5FF; font-weight: bold; font-size: 14px;">Hola, ${sesion.nombre}</span>
            <span class="separator" > | </span>
      <a href="cart.html" class="cart-link">
        <ion-icon name="cart"></ion-icon>
        <span>CARRITO</span>
      </a>
      <span class="separator">|</span>
      <button id="btnLogout" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-weight:bold; font-family:'Montserrat';">CERRAR SESIÓN</button>`;

        document.getElementById('btnLogout').addEventListener('click', cerrarSesion);
    }
});