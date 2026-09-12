document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const messageInput = document.getElementById('contactMessage');
  const charCount = document.getElementById('charCount');

  if (messageInput && charCount) {
    messageInput.addEventListener('input', () => {
      charCount.textContent = messageInput.value.length;
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      
      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const subject = document.getElementById('contactSubject');
      const message = document.getElementById('contactMessage');

      document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
      document.getElementById('formSuccess').textContent = '';

      if (!name.value.trim() || name.value.trim().length < 3) {
        document.getElementById('errorName').textContent = 'El nombre debe tener al menos 3 caracteres.';
        isValid = false;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
      if (!emailRegex.test(email.value.trim())) {
        document.getElementById('errorEmail').textContent = 'Ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).';
        isValid = false;
      }

      if (!subject.value) {
        document.getElementById('errorSubject').textContent = 'Por favor selecciona un asunto.';
        isValid = false;
      }

      if (!message.value.trim() || message.value.length > 500) {
        document.getElementById('errorMessage').textContent = 'El mensaje no puede estar vacío ni superar los 500 caracteres.';
        isValid = false;
      }

      if (isValid) {
        document.getElementById('formSuccess').textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
        contactForm.reset();
        charCount.textContent = '0';
      }
    });
  }
});