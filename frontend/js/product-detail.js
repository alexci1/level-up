document.addEventListener("DOMContentLoaded", () => {

    const selectedProduct = JSON.parse(localStorage.getItem("selected_product"));

    if (!selectedProduct) {
        window.location.href = "products.html";
        return;
    }

    const detailTitle = document.getElementById("detailTitle");
    const detailPrice = document.getElementById("detailPrice");
    const detailImage = document.getElementById("detailImage");
    const detailDescription = document.getElementById("detailDescription");

    if (detailTitle) detailTitle.textContent = selectedProduct.nombre;
    if (detailPrice) detailPrice.textContent = selectedProduct.precio;
    if (detailImage) {
        detailImage.setAttribute("src", selectedProduct.imagen);
        detailImage.setAttribute("alt", selectedProduct.nombre);
    }
    if (detailDescription) {
        detailDescription.textContent =
            `El ${selectedProduct.nombre} cuenta con tecnología de vanguardia orientada al alto rendimiento. Diseñado con materiales de máxima durabilidad y garantizado por Level Up Gamer para brindarte la mejor experiencia de juego.`;
    }

    let cantidad = 1;
    const quantityText = document.getElementById("detailQuantityText");
    const btnMinus = document.getElementById("btnMinusDetail");
    const btnPlus = document.getElementById("btnPlusDetail");

    if (btnPlus) {
        btnPlus.addEventListener("click", () => {
            if (cantidad < 10) { 
                cantidad++;
                if (quantityText) quantityText.textContent = cantidad;
            }
        });
    }

    if (btnMinus) {
        btnMinus.addEventListener("click", () => {
            if (cantidad > 1) { 
                cantidad--;
                if (quantityText) quantityText.textContent = cantidad;
            }
        });
    }

    const btnAdd = document.getElementById("btnAddToCartDetail");
    if (btnAdd) {
        btnAdd.addEventListener("click", () => {
            const sesion = typeof obtenerSesionActiva === "function" ? obtenerSesionActiva() : null;

            if (!sesion) {
                alert("Debes iniciar sesión para agregar productos al carrito.");
                window.location.href = "login.html";
                return;
            }

            const precioLimpio = Number(
                selectedProduct.precio.replace("$", "").replace(/\./g, "")
            );

            const productoParaCarrito = {
                id: selectedProduct.nombre,
                nombre: selectedProduct.nombre,
                precio: precioLimpio,
                imagen: selectedProduct.imagen,
                cantidad: cantidad
            };

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existe = cart.find(item => item.id === productoParaCarrito.id);

            if (existe) {
                existe.cantidad += cantidad;
            } else {
                cart.push(productoParaCarrito);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`¡${cantidad}x ${selectedProduct.nombre} agregado(s) al carrito!`);
        });
    }
});