document.addEventListener("DOMContentLoaded", () => {
    const selectedProduct = JSON.parse(localStorage.getItem("selected_product"));

    if (!selectedProduct) {
        window.location.href = "products.html";
        return;
    }

    const descripcionesProductos = {
        "SILLA GAMER COUGAR": "Diseñada ergonómicamente para largas jornadas de juego. Cuenta con estructura de acero de alta resistencia, inclinación reclinable hasta 180°, bordado de alta precisión y almohadillas lumbar y cervical ajustables para máxima comodidad.",
        
        "NOTEBOOK ASUS TUF A15": "Procesador de alto rendimiento combinado con gráficos dedicados de última generación. Pantalla de alta tasa de refresco, refrigeración mejorada con tecnología de auto-limpieza y certificación militar de durabilidad para resistir cualquier partida intensa.",
        
        "PLAYSTATION 5": "Disfruta de tiempos de carga ultrarrápidos con su SSD de alta velocidad, inmersión profunda con retroalimentación háptica, gatillos adaptativos y audio 3D. Descubre una generación de increíbles juegos de PlayStation con gráficos impresionantes.",
        
        "MOUSE GAMER LOGITECH": "Sensor óptico de alta precisión con aceleración cero. Diseño ergonómico ultraligero, botones con switches mecánicos de respuesta inmediata y programación de macros mediante software para dominar en cualquier título competitivo.",
        
        "CATAN": "El galardonado juego de mesa de estrategia donde la negociación, el comercio y la astucia son clave. Construye pueblos, carreteras y ciudades en una isla en constante cambio. Ideal para tardes de juego con amigos y familia.",
        
        "SONY PULSE ELITE": "Auriculares inalámbricos de gama alta optimizados para audio 3D. Equipados con controladores magnéticos planares, micrófono retráctil con cancelación de ruido mejorada por IA y batería de larga duración con carga rápida.",
        
        "LOGITECH G440": "Superficie de fricción ultrasuave diseñada para ratones de alto DPI. Su estructura de polímero rígido proporciona la resistencia óptima para movimientos rápidos y precisos en juegos de estrategia e esports.",
        
        "POLERA GAMER ZONE": "Confeccionada 100% en algodón peinado de alta calidad. Diseño exclusivo con estampado en serigrafía de alta durabilidad resistente a lavados. Corte cómodo e ideal para lucir tu pasión gamer en cualquier lugar."
    };

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
        const nombreUpper = selectedProduct.nombre ? selectedProduct.nombre.toUpperCase().trim() : "";
        
        let descEncontrada = "";
        for (const [key, desc] of Object.entries(descripcionesProductos)) {
            if (nombreUpper.includes(key) || key.includes(nombreUpper)) {
                descEncontrada = desc;
                break;
            }
        }

        detailDescription.textContent = descEncontrada || 
            `El ${selectedProduct.nombre} está equipado con especificaciones de vanguardia diseñadas para ofrecer un rendimiento superior. Garantizado por Level Up Gamer con respaldo de calidad.`;
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

    const reviewsKey = `levelup_reviews_${selectedProduct.nombre}`;
    let selectedRating = 5;
    const stars = document.querySelectorAll(".stars-input ion-icon");

    function renderStarsSelector(val) {
        stars.forEach(star => {
            const starValue = Number(star.getAttribute("data-value"));
            if (starValue <= val) {
                star.setAttribute("name", "star");
            } else {
                star.setAttribute("name", "star-outline");
            }
        });
    }
    renderStarsSelector(selectedRating);

    stars.forEach(star => {
        star.addEventListener("click", () => {
            selectedRating = Number(star.getAttribute("data-value"));
            renderStarsSelector(selectedRating);
        });
    });

    function actualizarCalificacionPromedio(reviews) {
        const detailStars = document.getElementById("detailStars");
        const detailRatingText = document.getElementById("detailRatingText");

        if (!detailStars || !detailRatingText) return;

        if (reviews.length === 0) {
            detailStars.innerHTML = "☆☆☆☆☆";
            detailRatingText.textContent = "(Sin valoraciones aún)";
            return;
        }

        const sumaTotal = reviews.reduce((acc, r) => acc + Number(r.rating), 0);
        const promedio = (sumaTotal / reviews.length).toFixed(1);
        const promedioEntero = Math.round(promedio);

        const estrellasLlena = "★".repeat(promedioEntero);
        const estrellasVacias = "☆".repeat(5 - promedioEntero);

        detailStars.innerHTML = estrellasLlena + estrellasVacias;
        detailRatingText.textContent = `${promedio} / 5 (${reviews.length} ${reviews.length === 1 ? 'reseña' : 'reseñas'})`;
    }

    function cargarResenas() {
        const reviewsContainer = document.getElementById("reviewsContainer");
        const reviews = JSON.parse(localStorage.getItem(reviewsKey)) || [];

        actualizarCalificacionPromedio(reviews);

        if (!reviewsContainer) return;

        if (reviews.length === 0) {
            reviewsContainer.innerHTML = `<p style="color:#b8b8c2;">Sé el primero en calificar este producto.</p>`;
            return;
        }

        reviewsContainer.innerHTML = reviews.map(r => `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-user">
                        <img src="${r.avatar || '../img/icons/Mouse.avif'}" alt="Avatar">
                        <span>${r.usuario}</span>
                    </div>
                    <div class="review-stars">
                        ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
                    </div>
                </div>
                <p class="review-text">${r.comentario}</p>
                <span class="review-date">${r.fecha}</span>
            </div>
        `).join('');
    }

    cargarResenas();

    const reviewForm = document.getElementById("reviewForm");
    if (reviewForm) {
        reviewForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const sesion = typeof obtenerSesionActiva === "function" ? obtenerSesionActiva() : null;

            if (!sesion) {
                alert("Debes iniciar sesión para publicar una reseña.");
                window.location.href = "login.html";
                return;
            }

            const comentario = document.getElementById("reviewComment").value.trim();
            if (!comentario) return;

            const nuevaResena = {
                usuario: sesion.nombre,
                avatar: sesion.avatar || "../img/icons/Mouse.avif",
                rating: selectedRating,
                comentario: comentario,
                fecha: new Date().toLocaleDateString("es-CL")
            };

            const reviews = JSON.parse(localStorage.getItem(reviewsKey)) || [];
            reviews.unshift(nuevaResena);
            localStorage.setItem(reviewsKey, JSON.stringify(reviews));

            document.getElementById("reviewComment").value = "";
            alert("¡Reseña publicada con éxito!");
            cargarResenas();
        });
    }
});