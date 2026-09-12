document.addEventListener('DOMContentLoaded', () => {

    const cartContainer = document.getElementById('cartContainer');
    const totalAmount = document.getElementById('totalAmount');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const netAmount = document.getElementById('netAmount');
    const ivaAmount = document.getElementById('ivaAmount');
    const discountAmount = document.getElementById('discountAmount');
    const discountRow = document.getElementById('discountRow');

    const btnClearCart = document.getElementById('btnClearCart');
    const btnCheckout = document.getElementById('btnCheckout');

    const paymentModal = document.getElementById('paymentModal');
    const closePaymentModal = document.getElementById('closePaymentModal');
    const paymentForm = document.getElementById('paymentForm');
    const modalPayTotal = document.getElementById('modalPayTotal');
    const methodBtns = document.querySelectorAll('.method-btn');
    const cardSection = document.getElementById('cardSection');
    const webpaySection = document.getElementById('webpaySection');
    const paymentLoading = document.getElementById('paymentLoading');

    let currentPayTotal = 0;

    function obtenerLlaveCarrito() {
        const sesion = typeof obtenerSesionActiva === "function" ? obtenerSesionActiva() : null;
        if (sesion && sesion.email) {
            return `cart_${sesion.email.toLowerCase().trim()}`;
        }
        return 'cart_invitado';
    }

    function obtenerCarrito() {
        const llave = obtenerLlaveCarrito();
        return JSON.parse(localStorage.getItem(llave)) || [];
    }

    function guardarCarrito(cart) {
        const llave = obtenerLlaveCarrito();
        localStorage.setItem(llave, JSON.stringify(cart));
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
            if (netAmount) netAmount.textContent = '$0';
            if (ivaAmount) ivaAmount.textContent = '$0';
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
                </div>
                <div class="item-price">${formatearPrecio(item.precio)}</div>
                <div class="quantity-controls">
                    <button class="btn-qty btn-minus" data-index="${index}">-</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-qty btn-plus" data-index="${index}">+</button>
                </div>
                <div class="item-total">${formatearPrecio(itemTotal)}</div>
                <button class="btn-remove" data-index="${index}">
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
            `;

            cartContainer.appendChild(itemCard);
        });

        const sesion = typeof obtenerSesionActiva === "function" ? obtenerSesionActiva() : null;
        const tieneDescuentoDuoc = sesion && (
            sesion.descuentoDuoc ||
            (sesion.email && (
                sesion.email.toLowerCase().endsWith('@duoc.cl') ||
                sesion.email.toLowerCase().endsWith('@duocuc.cl')
            ))
        );

        let descuento = tieneDescuentoDuoc ? (subtotal * 0.20) : 0;

        if (discountRow) {
            discountRow.style.display = tieneDescuentoDuoc ? 'flex' : 'none';
            if (discountAmount) discountAmount.textContent = `-${formatearPrecio(descuento)}`;
        }

        currentPayTotal = Math.round(subtotal - descuento);
        const neto = currentPayTotal / 1.19;
        const iva = currentPayTotal - neto;

        if (subtotalAmount) subtotalAmount.textContent = formatearPrecio(subtotal);
        if (netAmount) netAmount.textContent = formatearPrecio(neto);
        if (ivaAmount) ivaAmount.textContent = formatearPrecio(iva);
        if (totalAmount) totalAmount.textContent = formatearPrecio(currentPayTotal);

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
                localStorage.removeItem(obtenerLlaveCarrito());
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

            const sesion = typeof obtenerSesionActiva === "function" ? obtenerSesionActiva() : null;
            if (!sesion) {
                alert('Debes iniciar sesión para realizar la compra.');
                window.location.href = 'login.html';
                return;
            }

            if (modalPayTotal) modalPayTotal.textContent = formatearPrecio(currentPayTotal);
            paymentModal.style.display = 'flex';
        });
    }

    if (closePaymentModal) {
        closePaymentModal.addEventListener('click', () => {
            paymentModal.style.display = 'none';
        });
    }

    methodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            methodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const method = btn.getAttribute('data-method');
            if (method === 'card') {
                cardSection.style.display = 'block';
                webpaySection.style.display = 'none';
            } else {
                cardSection.style.display = 'none';
                webpaySection.style.display = 'block';
            }
        });
    });

    const inputCardNumber = document.getElementById('cardNumber');
    if (inputCardNumber) {
        inputCardNumber.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            val = val.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = val;
        });
    }

    const inputExp = document.getElementById('cardExp');
    if (inputExp) {
        inputExp.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length >= 2) {
                val = val.substring(0, 2) + '/' + val.substring(2, 4);
            }
            e.target.value = val;
        });
    }

    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            paymentForm.style.display = 'none';
            paymentLoading.style.display = 'block';

            setTimeout(() => {
                const sesion = obtenerSesionActiva();
                const cart = obtenerCarrito();
                const emailUsuario = sesion.email.toLowerCase().trim();
                const userOrdersKey = `levelup_user_orders_v2_${emailUsuario}`;

                let userOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];

                const nuevaOrden = {
                    id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                    fecha: new Date().toLocaleDateString("es-CL"),
                    estado: "En Camino",
                    total: currentPayTotal,
                    productos: cart.map(item => ({
                        nombre: item.nombre,
                        cantidad: item.cantidad,
                        precio: item.precio,
                        imagen: item.imagen
                    }))
                };

                userOrders.unshift(nuevaOrden);
                localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));
                
                localStorage.removeItem(obtenerLlaveCarrito());

                paymentLoading.style.display = 'none';
                paymentModal.style.display = 'none';
                paymentForm.style.display = 'flex';

                alert(`¡Pago Aprobado! Gracias por tu compra, ${sesion.nombre}. Orden N° ${nuevaOrden.id}`);
                window.location.href = 'profile.html';
            }, 2000);
        });
    }

    renderizarCarrito();
});