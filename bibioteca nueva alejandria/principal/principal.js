const librosHardcoded = [
    { id: 1, titulo: 'The Last Echo', autor: 'Evelyn Vance', precio: 95000, genero: 'Misterio', imagen: '../imagenes/book_cover_mystery_1776303068372.png' },
    { id: 2, titulo: 'Stellar Gate', autor: 'Marcus Thorne', precio: 82000, genero: 'Ciencia', imagen: '../imagenes/stellar gate.jpg' },
    { id: 3, titulo: 'La casa búho', autor: 'Dana Terrace', precio: 65000, genero: 'Ficción', imagen: '../imagenes/la casa buho.jfif' },
    { id: 5, titulo: 'Crónicas de un Sueño', autor: 'Elena Rossi', precio: 45000, genero: 'Historia', color: 'linear-gradient(45deg, #3b0764, #1e1b4b)' },
    { id: 6, titulo: 'El Laberinto de Cristal', autor: 'Julian Black', precio: 58000, genero: 'Misterio', color: 'linear-gradient(45deg, #4c1d95, #1e1e2d)' },
    { id: 7, titulo: 'Luces en el Vacío', autor: 'Nova C. Grey', precio: 92000, genero: 'Ciencia', color: 'linear-gradient(45deg, #1e1b4b, #5b21b6)' },
    { id: 8, titulo: 'El Secreto del Alquimista', autor: 'Victor M. Stone', precio: 110000, genero: 'Filosofía', color: 'linear-gradient(45deg, #2e1065, #1e1e2d)' },
    { id: 10, titulo: 'La Ciudad de las Nubes', autor: 'Leo D. Sky', precio: 67000, genero: 'Ficción', color: 'linear-gradient(45deg, #5b21b6, #1e1b4b)' },
    { id: 11, titulo: 'El Códice Perdido', autor: 'Raquel B. Hunt', precio: 125000, genero: 'Historia', color: 'linear-gradient(45deg, #3b0764, #2d1b4d)' },
    { id: 12, titulo: 'Reliquias del Futuro', autor: 'Toby A. Wells', precio: 88000, genero: 'Ciencia', color: 'linear-gradient(45deg, #1e1e2d, #3b0764)' },
    { id: 13, titulo: 'Corazón de Hierro', autor: 'Alex R. Steel', precio: 74000, genero: 'Ciencia', color: 'linear-gradient(45deg, #2d1b4d, #1e1b4b)' },
    { id: 14, titulo: 'Las Voces del Mar', autor: 'Marina Blue', precio: 49000, genero: 'Poesía', color: 'linear-gradient(45deg, #4c1d95, #2e1065)' },
    { id: 15, titulo: 'El Reino Fragmentado', autor: 'Kaelen Thorne', precio: 115000, genero: 'Ficción', color: 'linear-gradient(45deg, #1e1b4b, #1e1e2d)' },
    { id: 16, titulo: 'Almas de Neón', autor: 'Zara V. Light', precio: 89000, genero: 'Ciencia', color: 'linear-gradient(45deg, #5b21b6, #2d1b4d)' }
];

// Unificar libros base con los publicados por el usuario
const librosUsuario = JSON.parse(localStorage.getItem('libros-usuario')) || [];
const libros = [...librosUsuario, ...librosHardcoded];

// Variables globales para el estado de la aplicación
let listaCarrito = JSON.parse(localStorage.getItem('biblioteca-carrito')) || [];
let filtroBusqueda = '';
let filtroCategoria = 'Todas';

/**
 * --- INICIALIZACIÓN ---
 */
document.addEventListener('DOMContentLoaded', () => {
    mostrarLibros();
    // configurarTema(); // Ahora en global.js
    configurarEventos();
    actualizarInterfaz();
    configurarCheckout(); // Añadimos esto
    // initScrollEffect(); // Ahora en global.js
});


/**
 * Configura los escuchadores de eventos.
 */
function configurarEventos() {
    // Buscador
    const inputBusqueda = document.querySelector('.contenedor-busqueda input');
    inputBusqueda.addEventListener('input', (e) => {
        filtroBusqueda = e.target.value.toLowerCase();
        filtrarYMostrarLibros();
    });

    // Modal Carrito
    const btnAbrir = document.getElementById('abrir-carrito');
    const btnCerrar = document.getElementById('cerrar-carrito');
    const modal = document.getElementById('modal-carrito');

    btnAbrir.addEventListener('click', () => modal.classList.add('activo'));
    btnCerrar.addEventListener('click', () => modal.classList.remove('activo'));

    // Categorías
    const enlacesCategorias = document.querySelectorAll('.contenido-desplegable a');
    enlacesCategorias.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            filtroCategoria = e.target.innerText;
            filtrarYMostrarLibros();
        });
    });




    // DELEGACIÓN DE EVENTOS para botones de libros
    document.getElementById('contenedor-libros').addEventListener('click', (e) => {
        const btnComprar = e.target.closest('.btn-comprar');
        const btnCancelar = e.target.closest('.btn-cancelar');

        if (btnComprar && !btnComprar.disabled) {
            const id = parseInt(btnComprar.dataset.id);
            añadirACarrito(id);
        }

        if (btnCancelar) {
            const id = parseInt(btnCancelar.dataset.id);
            quitarDeCarrito(id);
        }
    });

    // DELEGACIÓN DE EVENTOS para quitar items del modal
    document.getElementById('lista-carrito').addEventListener('click', (e) => {
        const btnQuitar = e.target.closest('.quitar-item-carrito');
        if (btnQuitar) {
            const id = parseInt(btnQuitar.dataset.id);
            quitarDeCarrito(id);
        }
    });
}

/**
 * Filtra los libros.
 */
function filtrarYMostrarLibros() {
    const librosFiltrados = libros.filter(libro => {
        const coincideNombre = libro.titulo.toLowerCase().includes(filtroBusqueda) ||
            libro.autor.toLowerCase().includes(filtroBusqueda);
        const coincideCategoria = filtroCategoria === 'Todas' || libro.genero === filtroCategoria;
        return coincideNombre && coincideCategoria;
    });
    mostrarLibros(librosFiltrados);
}

/**
 * Pinta los libros.
 */
function mostrarLibros(listaAMostrar = libros) {
    const contenedor = document.getElementById('contenedor-libros');
    if (!contenedor) return;

    if (listaAMostrar.length === 0) {
        contenedor.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--texto-tenue);">
            <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
            <p>No encontramos libros que coincidan con tu búsqueda.</p>
        </div>`;
        return;
    }

    contenedor.innerHTML = listaAMostrar.map(libro => {
        const estaEnCarrito = listaCarrito.includes(libro.id);

        return `
            <div class="tarjeta-libro ${estaEnCarrito ? 'comprada' : ''}" id="libro-${libro.id}">
                ${libro.imagen
                ? `<img src="${libro.imagen}" alt="${libro.titulo}" class="imagen-libro" loading="lazy">`
                : `<div style="width:100%; height:320px; background: ${libro.color}; display:flex; align-items:center; justify-content:center;">
                          <i class="fas fa-book" style="font-size: 4rem; color: var(--color-primario);"></i>
                       </div>`
            }
                <div class="info-libro">
                    <span class="titulo-libro">${libro.titulo}</span>
                    <span class="autor-libro">${libro.autor}</span>
                    <div class="fila-precio-libro">
                        <span class="precio">${formatearMoneda(libro.precio)}</span>
                        <button class="btn-cancelar" data-id="${libro.id}">
                            Cancelar compra
                        </button>
                        <button class="btn-comprar ${estaEnCarrito ? 'comprado' : ''}" data-id="${libro.id}" ${estaEnCarrito ? 'disabled' : ''}>
                            <i class="fas ${estaEnCarrito ? 'fa-check' : 'fa-plus'}"></i> 
                            ${estaEnCarrito ? 'Añadido' : 'Añadir al carrito'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Añade al carrito.
 */
function añadirACarrito(id) {
    // Protección: Verificar si el usuario está logueado
    const usuarioLogueado = JSON.parse(localStorage.getItem('sesion-usuario'));
    if (!usuarioLogueado) {
        alert('si no se inicia sesion algunas funciones no estaran disponibles .');
        window.location.href = '../login/login.html';
        return;
    }

    if (listaCarrito.includes(id)) return;

    listaCarrito.push(id);
    guardarCarrito();
    actualizarInterfaz();
    mostrarLibros();

    // Animación de micro-interacción en el carrito
    const cartIcon = document.querySelector('.contador-carrito');
    cartIcon.style.animation = 'none';
    cartIcon.offsetHeight; // trigger reflow
    cartIcon.style.animation = 'bounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
}

/**
 * Elimina del carrito.
 */
function quitarDeCarrito(id) {
    listaCarrito = listaCarrito.filter(libroId => libroId !== id);
    guardarCarrito();
    actualizarInterfaz();
    mostrarLibros();
}

function guardarCarrito() {
    localStorage.setItem('biblioteca-carrito', JSON.stringify(listaCarrito));
    if (window.actualizarContadorGlobal) window.actualizarContadorGlobal();
}


/**
 * Actualiza la interfaz.
 */
function actualizarInterfaz() {
    const total = listaCarrito.reduce((acc, libroId) => {
        const libro = libros.find(l => l.id === libroId);
        return acc + (libro ? libro.precio : 0);
    }, 0);

    const contador = document.querySelector('.contador-carrito');
    if (contador) contador.innerText = listaCarrito.length;

    const precioTotal = document.getElementById('precio-total');
    if (precioTotal) precioTotal.innerText = formatearMoneda(total);

    const totalModal = document.getElementById('total-modal');
    if (totalModal) totalModal.innerText = formatearMoneda(total);

    // Control del botón de compra y sección de pagos
    const btnCheckout = document.getElementById('btn-comprar-ahora');
    const seccionPagos = document.getElementById('seccion-pagos');

    if (btnCheckout) {
        if (listaCarrito.length === 0) {
            btnCheckout.disabled = true;
            btnCheckout.style.opacity = '0.5';
            btnCheckout.style.cursor = 'not-allowed';
            if (seccionPagos) seccionPagos.style.display = 'none';
            btnCheckout.style.display = 'block'; // Volver a mostrar si estaba oculto
        } else {
            btnCheckout.disabled = false;
            btnCheckout.style.opacity = '1';
            btnCheckout.style.cursor = 'pointer';
        }
    }

    dibujarDetalleCarrito();
}

/**
 * Muestra las opciones de pago
 */
function configurarCheckout() {
    const btnCheckout = document.getElementById('btn-comprar-ahora');
    const seccionPagos = document.getElementById('seccion-pagos');

    if (btnCheckout && seccionPagos) {
        btnCheckout.addEventListener('click', () => {
            seccionPagos.style.display = 'block';
            btnCheckout.style.display = 'none'; // Ocultamos para que elijan el método
        });
    }
}

/**
 * Simula la redirección al pago oficial
 */
function simularPago(metodo) {
    if (metodo === 'bancolombia') {
        alert('💳 Redirigiendo a la plataforma oficial de Bancolombia...');
        window.open('https://www.bancolombia.com/personas', '_blank');
    } else if (metodo === 'paypal') {
        alert('🔵 Redirigiendo a PayPal Checkout...');
        window.open('https://www.paypal.com/checkoutnow', '_blank');
    }
}

/**
 * Detalle del carrito.
 */
function dibujarDetalleCarrito() {
    const contenedorLista = document.getElementById('lista-carrito');
    if (listaCarrito.length === 0) {
        contenedorLista.innerHTML = `
            <div class="carrito-vacio">
                <i class="fas fa-shopping-basket" style="font-size: 2rem; display: block; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p>Tu carrito está esperando ser llenado con grandes historias.</p>
            </div>`;
        return;
    }

    contenedorLista.innerHTML = listaCarrito.map(libroId => {
        const libro = libros.find(l => l.id === libroId);
        if (!libro) return '';
        return `
            <div class="item-carrito">
                <button class="quitar-item-carrito" data-id="${libroId}" title="Eliminar del carrito">
                    <i class="fas fa-times"></i>
                </button>
                <div class="info-item-carrito">
                    <span class="titulo-item-carrito">${libro.titulo}</span>
                    <span class="precio-item-carrito">${formatearMoneda(libro.precio)}</span>
                </div>
                ${libro.imagen
                ? `<img src="${libro.imagen}" class="imagen-item-carrito" loading="lazy">`
                : `<div class="imagen-item-carrito" style="background:${libro.color}"></div>`
            }
            </div>
        `;
    }).join('');
}

/**
 * Formatear moneda.
 */
function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(valor);
}

