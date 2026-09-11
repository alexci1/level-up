document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const inputNombre = document.getElementById('contactNombre');
    const inputEmail = document.getElementById('contactEmail');
    const inputMensaje = document.getElementById('contactMensaje');

    const errorNombre = document.getElementById('errorContactNombre');
    const errorEmail = document.getElementById('errorContactEmail');
    const errorMensaje = document.getElementById('errorContactMensaje');
    const successMsg = document.getElementById('contactSuccess');

    // Expresión regular para validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Función para validar el campo Nombre
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

    // Función para validar el campo Correo
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

    // Función para validar el campo Mensaje
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

    // Validaciones en tiempo real mientras el usuario escribe (evento input)
    inputNombre.addEventListener('input', validarNombre);
    inputEmail.addEventListener('input', validarEmail);
    inputMensaje.addEventListener('input', validarMensaje);

    // Evento al enviar el formulario
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Ejecutar todas las validaciones
        const esNombreValido = validarNombre();
        const esEmailValido = validarEmail();
        const esMensajeValido = validarMensaje();

        // Si todos los campos son válidos
        if (esNombreValido && esEmailValido && esMensajeValido) {
            successMsg.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
            contactForm.reset();

            // Ocultar el mensaje de éxito después de 5 segundos
            setTimeout(() => {
                successMsg.textContent = '';
            }, 5000);
        } else {
            successMsg.textContent = '';
        }
    });
});