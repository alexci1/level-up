document.addEventListener("DOMContentLoaded", () => {
    const selectedProduct = JSON.parse(localStorage.getItem("selected_product"));

    if (!selectedProduct) {
        window.location.href = "products.html";
        return;
    }

    const allProducts = JSON.parse(localStorage.getItem("levelup_productos")) || [];
    const productoEnInventario = allProducts.find(p => p.name.toUpperCase().trim() === selectedProduct.nombre.toUpperCase().trim());

    let stockDisponible = productoEnInventario ? productoEnInventario.stock : 10;

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
    const detailStock = document.getElementById("detailStock");

    if (detailTitle) detailTitle.textContent = selectedProduct.nombre;
    if (detailPrice) detailPrice.textContent = selectedProduct.precio;

    if (detailStock) {
        if (stockDisponible > 0) {
            detailStock.textContent = `Stock disponible: ${stockDisponible} unidades`;
            detailStock.style.color = "#00ff88";
        } else {
            detailStock.textContent = `¡Producto agotado!`;
            detailStock.style.color = "#ff4d4d";
        }
    }

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
            if (cantidad < stockDisponible) {
                cantidad++;
                if (quantityText) quantityText.textContent = cantidad;
            } else {
                alert(`No puedes agregar más de ${stockDisponible} unidades (Stock máximo alcanzado).`);
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
            if (stockDisponible <= 0) {
                alert("Lo sentimos, este producto está agotado.");
                return;
            }

            const sesion = typeof obtenerSesionActiva === "function" ? obtenerSesionActiva() : null;

            if (!sesion) {
                alert("Debes iniciar sesión para agregar productos al carrito.");
                window.location.href = "login.html";
                return;
            }

            // 1. Limpieza estricta del precio a valor numérico entero
            let precioLimpio = 0;
            if (typeof selectedProduct.precio === "number") {
                precioLimpio = selectedProduct.precio;
            } else if (typeof selectedProduct.precio === "string") {
                precioLimpio = Number(selectedProduct.precio.replace(/[^0-9]/g, "")) || 0;
            }

            // 2. Generación de un ID único compatible
            const idProducto = selectedProduct.id || selectedProduct.codigo || selectedProduct.nombre;

            const productoParaCarrito = {
                id: idProducto,
                codigo: idProducto,
                nombre: selectedProduct.nombre,
                precio: precioLimpio,
                imagen: selectedProduct.imagen,
                cantidad: cantidad
            };

            const emailUsuario = (sesion.correo || sesion.email || sesion.usuario || sesion.nombre || "").toString().trim().toLowerCase();
            const llaveUserCart = `cart_${emailUsuario}`;
            const cartKeyToUse = emailUsuario ? llaveUserCart : "cart";

            let cart = JSON.parse(localStorage.getItem(llaveUserCart)) || JSON.parse(localStorage.getItem("cart")) || [];
            const existe = cart.find(item => item.id === productoParaCarrito.id);

            // Determinar qué clave de localStorage está en uso actualmente
            let cartKeyToUse = "cart";
            if (localStorage.getItem(userCartKey)) {
                cartKeyToUse = userCartKey;
            } else if (!localStorage.getItem("cart") && userEmail) {
                cartKeyToUse = userCartKey;
            }

            let cart = JSON.parse(localStorage.getItem(cartKeyToUse)) || [];

            // 4. Buscar si ya existe el ítem en la lista
            const existeIndex = cart.findIndex(item => item.id === idProducto || item.nombre === selectedProduct.nombre);

            if (existeIndex !== -1) {
                cart[existeIndex].cantidad += cantidad;
            } else {
                cart.push(productoParaCarrito);
            }

            localStorage.setItem(llaveUserCart, JSON.stringify(cart));
            if (cartKeyToUse !== llaveUserCart) {
                localStorage.setItem(cartKeyToUse, JSON.stringify(cart));
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
        let reviews = JSON.parse(localStorage.getItem(reviewsKey)) || [];
        const listaUsuarios = JSON.parse(localStorage.getItem("levelup_usuarios")) || [];

        let huboCambios = false;
        reviews = reviews.map(r => {
            const usuarioEncontrado = listaUsuarios.find(u => u.nombre.toLowerCase() === r.usuario.toLowerCase());
            if (usuarioEncontrado && usuarioEncontrado.avatar && usuarioEncontrado.avatar !== r.avatar) {
                huboCambios = true;
                return { ...r, avatar: usuarioEncontrado.avatar };
            }
            return r;
        });

        if (huboCambios) {
            localStorage.setItem(reviewsKey, JSON.stringify(reviews));
        }

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
                        <img src="${r.avatar || '../img/icons/Mouse.avif'}" alt="Avatar" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; background: #0b0b0f; border: 1px solid #00E5FF;">
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

    function initDefaultReviews() {
        let reviews = JSON.parse(localStorage.getItem(reviewsKey)) || [];

        if (reviews.length === 0) {
            const nombreProd = selectedProduct.nombre.toUpperCase();

            const avatarMatias = "../img/icons/Monkey.avif";
            const avatarAlex = "../img/icons/Panda.avif";
            const avatarAndres = "../img/icons/Blue-Face-Man.avif";

            if (nombreProd.includes("CATAN")) {
                reviews = [
                    { usuario: "Matías", avatar: avatarMatias, rating: 5, comentario: "¡El clásico de clásicos! Las partidas con los amigos duran horas de pura estrategia y negociaciones fallidas de trigo. 10/10.", fecha: "08/09/2026" },
                    { usuario: "Alex", avatar: avatarAlex, rating: 4, comentario: "Muy buen juego de mesa, los materiales son resistentes. Lo único malo es que siempre me roban el ladrillo.", fecha: "09/09/2026" },
                    { usuario: "Andrés", avatar: avatarAndres, rating: 5, comentario: "Excelente para juntarse un fin de semana. Las reglas son fáciles de aprender y las partidas son súper reñidas.", fecha: "10/09/2026" }
                ];
            } else if (nombreProd.includes("PLAYSTATION") || nombreProd.includes("PS5")) {
                reviews = [
                    { usuario: "Matías", avatar: avatarMatias, rating: 5, comentario: "Simplemente una bestia. Los tiempos de carga no existen y el mando DualSense te cambia la experiencia por completo.", fecha: "05/09/2026" },
                    { usuario: "Alex", avatar: avatarAlex, rating: 5, comentario: "La mejor inversión del año. Los gráficos en 4K son una locura total, vale cada peso.", fecha: "07/09/2026" },
                    { usuario: "Andrés", avatar: avatarAndres, rating: 4, comentario: "Es grandota y hay que hacer espacio en el mueble, pero en rendimiento se lleva aplausos de pie.", fecha: "11/09/2026" }
                ];
            } else if (nombreProd.includes("SILLA")) {
                reviews = [
                    { usuario: "Matías", avatar: avatarMatias, rating: 5, comentario: "Mi espalda te lo agradece. Me puedo echar 8 horas jugando y cero dolores lumbares. Muy firme.", fecha: "02/09/2026" },
                    { usuario: "Alex", avatar: avatarAlex, rating: 3, comentario: "Es cómoda, aunque el armado me dio un poco de dolor de cabeza al principio. Una vez lista, todo bien.", fecha: "06/09/2026" },
                    { usuario: "Andrés", avatar: avatarAndres, rating: 5, comentario: "Los materiales se sienten de alta gama y el cojín cervical queda a la altura justa. Muy buen diseño.", fecha: "09/09/2026" }
                ];
            } else {
                reviews = [
                    { usuario: "Matías", avatar: avatarMatias, rating: 5, comentario: "¡Excelente producto! Cumple con todo lo prometido y llegó super rápido.", fecha: "10/09/2026" },
                    { usuario: "Alex", avatar: avatarAlex, rating: 4, comentario: "Buen rendimiento, aunque el envío demoró un día más de lo esperado. El producto impecable eso sí.", fecha: "11/09/2026" },
                    { usuario: "Andrés", avatar: avatarAndres, rating: 5, comentario: "Una maravilla, la relación precio-calidad es insuperable. Level Up se lució.", fecha: "12/09/2026" }
                ];
            }

            localStorage.setItem(reviewsKey, JSON.stringify(reviews));
        }
    }

    initDefaultReviews();
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
                avatar: sesion.avatar || "../img/icons/Mouse.avif", // Toma el avatar seleccionado en su sesión
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