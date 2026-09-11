document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cartContainer');
    const totalAmount = document.getElementById('totalAmount');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const discountAmount = document.getElementById('discountAmount');
    const discountRow = document.getElementById('discountRow');
    const btnClearCart = document.getElementById('btnClearCart');
    const btnCheckout = document.getElementById('btnCheckout');

    function obtenerCarrito() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function guardarCarrito(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderizarCarrito();
    }

    function formatearPrecio(precio) {
        return `$${Math.round(precio).toLocaleString('es-CL')}`;
    }

    function renderizarCarrito() {
        if (!cartContainer) return;

        const cart = obtenerCarrito();
        cartContainer.innerHTML = '';

        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <p>Tu carrito está vacío.</p>
                    <a href="products.html" class="empty-cart-button">VER PRODUCTOS</a>
                </div>
            `;
            if (totalAmount) totalAmount.textContent = '$0';
            if (subtotalAmount) subtotalAmount.textContent = '$0';
            if (discountRow) discountRow.style.display = 'none';
            return;
        }

        let subtotal = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.precio * item.cantidad;
            subtotal += itemTotal;

            const itemCard = document.createElement('article');
            itemCard.classList.add('cart-item-card');

            itemCard.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="item-details">
                    <h3>${item.nombre}</h3>
                    <p class="item-price">${formatearPrecio(item.precio)}</p>
                </div>
                <div class="quantity-controls">
                    <button class="btn-qty btn-minus" data-index="${index}">-</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-qty btn-plus" data-index="${index}">+</button>
                </div>
                <div class="item-total">
                    ${formatearPrecio(itemTotal)}
                </div>
                <button class="btn-remove" data-index="${index}">
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
            `;

            cartContainer.appendChild(itemCard);
        });

        // VERIFICAR BENEFICIO DESCUENTO DUOCUC (20%)
        const sesion = typeof obtenerSesionActiva === "function" ? obtenerSesionActiva() : null;
        const tieneDescuentoDuoc = sesion && (
            sesion.descuentoDuoc || 
            (sesion.email && (sesion.email.toLowerCase().endsWith('@duoc.cl') || sesion.email.toLowerCase().endsWith('@duocuc.cl')))
        );

        let descuento = 0;
        if (tieneDescuentoDuoc) {
            descuento = subtotal * 0.20; // 20% de descuento[cite: 2]
            if (discountRow) discountRow.style.display = 'flex';
            if (discountAmount) discountAmount.textContent = `-${formatearPrecio(descuento)}`;
        } else {
            if (discountRow) discountRow.style.display = 'none';
        }

        const totalFinal = subtotal - descuento;

        if (subtotalAmount) subtotalAmount.textContent = formatearPrecio(subtotal);
        if (totalAmount) totalAmount.textContent = formatearPrecio(totalFinal);

        asignarEventos();
    }

    function asignarEventos() {
        document.querySelectorAll('.btn-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                const cart = obtenerCarrito();
                cart[index].cantidad++;
                guardarCarrito(cart);
            });
        });

        document.querySelectorAll('.btn-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                const cart = obtenerCarrito();
                if (cart[index].cantidad > 1) {
                    cart[index].cantidad--;
                } else {
                    cart.splice(index, 1);
                }
                guardarCarrito(cart);
            });
        });

        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                const cart = obtenerCarrito();
                cart.splice(index, 1);
                guardarCarrito(cart);
            });
        });
    }

    if (btnClearCart) {
        btnClearCart.addEventListener('click', () => {
            if (confirm('¿Seguro que deseas vaciar el carrito?')) {
                localStorage.removeItem('cart');
                renderizarCarrito();
            }
        });
    }

    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            const cart = obtenerCarrito();
            if (cart.length === 0) {
                alert('El carrito está vacío.');
                return;
            }
            alert('¡Gracias por tu compra en Level Up Gamer!');
            localStorage.removeItem('cart');
            renderizarCarrito();
        });
    }

    renderizarCarrito();
});