document.addEventListener("DOMContentLoaded", () => {
    const blogCards = document.querySelectorAll(".blog-card");

    const blogContents = {
        "ps5-pro": `
            <p>La nueva iteración de consolas ha llegado para establecer un nuevo estándar gráfico. Con la integración de tecnologías avanzadas como el reescalado por inteligencia artificial (PSSR) y trazado de rayos acelerado por hardware, muchos jugadores se preguntan si la inversión está justificada.</p>
            <h2>Rendimiento y Tasa de Cuadros</h2>
            <p>Uno de los mayores atractivos es la posibilidad de jugar a 60 FPS estables sin sacrificar la resolución 4K. Títulos exigentes que antes obligaban a elegir entre el 'Modo Rendimiento' o 'Modo Calidad' ahora ejecutan ambos mundos sin despeinarse.</p>
            <h2>¿Para quién está pensada esta actualización?</h2>
            <p>Si posees una televisión o monitor 4K con tasa de refresco de 120Hz y busques la máxima fidelidad visual sin armar una PC Gamer de gama alta, esta actualización es ideal. Sin embargo, para usuarios de pantallas 1080p convencionales, la consola base sigue siendo más que suficiente.</p>
        `,
        "silla-gamer": `
            <p>Pasar largas sesiones frente a la pantalla puede pasar factura a tu columna si no cuentas con el soporte adecuado. Elegir una silla gamer va mucho más allá del diseño o las luces RGB.</p>
            <h2>Soporte Lumbar y Cervical</h2>
            <p>El aspecto más crucial es la ergonomía. Busca modelos con cojines regulables o sistemas de ajuste lumbar integrados en el respaldo para mantener la curvatura natural de la espalda.</p>
            <h2>Materiales: ¿Cuero Sintético o Tela Respirable?</h2>
            <p>El cuero sintético (PU) ofrece una estética elegante y fácil limpieza, ideal para ambientes climatizados. La tela microperforada o malla respirable es recomendada si vives en zonas calurosas, evitando la acumulación de sudor durante el verano.</p>
        `,
        "perifericos": `
            <p>En el terreno de los Esports y partidas clasificatorias, cada milisegundo cuenta. Tener los periféricos adecuados puede marcar la diferencia entre una victoria decisiva o una derrota frustrante.</p>
            <h2>Mouse: DPI vs Peso y Sensor</h2>
            <p>Aunque las marcas promocionan cifras como 26,000 DPI, en la práctica competitiva casi nadie juega por encima de 1,600 DPI. Lo verdaderamente importante es la precisión del sensor (sin aceleración) y el peso ultraligero (idealmente por debajo de los 60 gramos).</p>
            <h2>Polling Rate y Latencia de Entrada</h2>
            <p>Los teclados y ratones modernos ofrecen tasas de sondeo de 4,000 Hz a 8,000 Hz. Esto reduce la latencia de respuesta a una fracción de milisegundo, asegurando que tus comandos se registren al instante.</p>
        `
    };

    blogCards.forEach((card, index) => {
        const readMoreBtn = card.querySelector(".read-more");

        if (readMoreBtn) {
            readMoreBtn.addEventListener("click", () => {
                let id = card.getAttribute("data-id");
                if (!id) {
                    const keys = Object.keys(blogContents);
                    id = keys[index] || "ps5-pro";
                }

                const title = card.querySelector("h3") ? card.querySelector("h3").textContent : "Artículo Gamer";
                const category = card.querySelector(".blog-category") ? card.querySelector(".blog-category").textContent : "NOTICIAS";
                
                const rawDate = card.querySelector(".blog-date") ? card.querySelector(".blog-date").textContent : "";
                const cleanDate = rawDate.replace(/\s+/g, " ").trim();

                const image = card.querySelector("img") ? card.querySelector("img").getAttribute("src") : "";
                const fullContent = blogContents[id] || blogContents["ps5-pro"];

                const selectedBlog = {
                    id: id,
                    title: title,
                    category: category,
                    date: cleanDate,
                    image: image,
                    content: fullContent
                };

                localStorage.setItem("selected_blog", JSON.stringify(selectedBlog));
            });
        }
    });
});