document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const inputNombre = document.getElementById('contactNombre');
    const inputEmail = document.getElementById('contactEmail');
    const inputMensaje = document.getElementById('contactMensaje');

    const errorNombre = document.getElementById('errorContactNombre');
    const errorEmail = document.getElementById('errorContactEmail');
    const errorMensaje = document.getElementById('errorContactMensaje');
    const successMsg = document.getElementById('contactSuccess');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validarNombre = () => {
        const valor = inputNombre.value.trim();
        if (valor === '') {
            errorNombre.textContent = 'El nombre completo es obligatorio.';
            inputNombre.style.borderColor = '#ff4d4d';
            return false;
        } else if (valor.length < 3) {
            errorNombre.textContent = 'El nombre debe tener al menos 3 caracteres.';
            inputNombre.style.borderColor = '#ff4d4d';
            return false;
        } else {
            errorNombre.textContent = '';
            inputNombre.style.borderColor = '#25252d';
            return true;
        }
    };


    const validarEmail = () => {
        const valor = inputEmail.value.trim();
        if (valor === '') {
            errorEmail.textContent = 'El correo electrónico es obligatorio.';
            inputEmail.style.borderColor = '#ff4d4d';
            return false;
        } else if (!emailRegex.test(valor)) {
            errorEmail.textContent = 'Ingresa un correo electrónico válido (ej: usuario@dominio.com).';
            inputEmail.style.borderColor = '#ff4d4d';
            return false;
        } else {
            errorEmail.textContent = '';
            inputEmail.style.borderColor = '#25252d';
            return true;
        }
    };

    const validarMensaje = () => {
        const valor = inputMensaje.value.trim();
        if (valor === '') {
            errorMensaje.textContent = 'El mensaje no puede estar vacío.';
            inputMensaje.style.borderColor = '#ff4d4d';
            return false;
        } else if (valor.length < 10) {
            errorMensaje.textContent = 'El mensaje debe contener al menos 10 caracteres.';
            inputMensaje.style.borderColor = '#ff4d4d';
            return false;
        } else {
            errorMensaje.textContent = '';
            inputMensaje.style.borderColor = '#25252d';
            return true;
        }
    };

    inputNombre.addEventListener('input', validarNombre);
    inputEmail.addEventListener('input', validarEmail);
    inputMensaje.addEventListener('input', validarMensaje);

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const esNombreValido = validarNombre();
        const esEmailValido = validarEmail();
        const esMensajeValido = validarMensaje();

        if (esNombreValido && esEmailValido && esMensajeValido) {
            successMsg.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
            contactForm.reset();

            setTimeout(() => {
                successMsg.textContent = '';
            }, 5000);
        } else {
            successMsg.textContent = '';
        }
    });
});