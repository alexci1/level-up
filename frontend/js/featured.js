const container = document.querySelector(".featured-window");
const productContainer = document.getElementById("featuredProducts");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const desplazamiento = 300

const productosOriginales = Array.from(
    productContainer.children
);

const copiaAnterior = productosOriginales.map(producto =>
    producto.cloneNode(true)
);

const copiaPosterior = productosOriginales.map(producto =>
    producto.cloneNode(true)
);

copiaAnterior.reverse().forEach(producto => {
    productContainer.prepend(producto);
});

copiaPosterior.forEach(producto => {
    productContainer.appendChild(producto);
});


window.addEventListener("load", () => {
    const producto = productosOriginales[0];
    const anchoProducto = producto.offsetWidth;
    const gap = 25;
    const anchoGrupo = (anchoProducto + gap) * productosOriginales.length;

    container.scrollLeft = anchoGrupo;
});

nextBtn.addEventListener("click", () => {
    container.scrollBy({
        left: desplazamiento,
        behavior: "smooth"
    });
});

prevBtn.addEventListener("click", () => {
    container.scrollBy({
        left: -desplazamiento,
        behavior: "smooth"
    });
});

container.addEventListener("scroll", () => {
    const producto = productosOriginales[0];
    const anchoProducto = producto.offsetWidth;
    const gap = 25;
    const anchoGrupo = (anchoProducto + gap) * productosOriginales.length;

    if (container.scrollLeft >= anchoGrupo * 2) {
        container.scrollLeft -= anchoGrupo;
    }

    if (container.scrollLeft <= 0) {
        container.scrollLeft += anchoGrupo;
    }
});

productContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    
    if (!card) return;
    if (e.target.tagName.toLowerCase() === "button") {
        return;
    }

    const title = card.querySelector("h3").textContent;
    const price = card.querySelector("p").textContent;
    const imgPath = card.querySelector("img").getAttribute("src");

    const selectedProduct = {
        nombre: title,
        precio: price,
        imagen: imgPath
    };

    localStorage.setItem("selected_product", JSON.stringify(selectedProduct));
    window.location.href = "product-detail.html";
});