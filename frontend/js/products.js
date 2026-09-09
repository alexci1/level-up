const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const noResults = document.getElementById("noResults");

const products = document.querySelectorAll(".product-card");

function filterProducts() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    let visibleProducts = 0;

    products.forEach(product => {
        const productName = product
            .querySelector("h3")
            .textContent
            .toLowerCase();

        const productCategory = product.dataset.category;

        const matchesName = productName.includes(searchText);

        const matchesCategory =
            selectedCategory === "todos" ||
            productCategory === selectedCategory;

        if (matchesName && matchesCategory) {
            product.style.display = "flex";
            visibleProducts++;

        } else {
            product.style.display = "none";
        }

    });

    if (visibleProducts === 0) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }

}

searchInput.addEventListener("input", filterProducts);

categoryFilter.addEventListener("change", filterProducts)

const addButtons = document.querySelectorAll(".product-card button");

addButtons.forEach(button => {
    button.addEventListener("click", () => {
        const sesion = obtenerSesionActiva();

        if (!sesion) {
            alert("Debes iniciar sesión para agregar productos al carrito.");
            window.location.href = "login.html";
            return;
        }

        const productCard = button.closest(".product-card");
        const productName = productCard.querySelector("h3").textContent;
        const productPrice = productCard.querySelector("p").textContent;
        const productImage = productCard.querySelector("img").getAttribute("src");

        const price = Number(
            productPrice.replace("$", "").replace(/\./g, "")
        );

        const product = {
            id: productName,
            nombre: productName,
            precio: price,
            imagen: productImage,
            cantidad: 1
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingProduct = cart.find(
            item => item.id === product.id
        );

        if (existingProduct) {
            existingProduct.cantidad++;
        } else {
            cart.push(product);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`¡${productName} agregado al carrito!`);
    });
})

document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", (e) => {
        if (e.target.tagName === 'BUTTON') return;

        const nombre = card.querySelector("h3").textContent;
        const precio = card.querySelector("p").textContent;
        const imagen = card.querySelector("img").getAttribute("src");
        const categoria = card.dataset.category;

        const productoSeleccionado = { nombre, precio, imagen, categoria };

        localStorage.setItem("selected_product", JSON.stringify(productoSeleccionado));

        window.location.href = "product-detail.html";
    });
});;



