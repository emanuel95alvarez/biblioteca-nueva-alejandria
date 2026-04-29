/** 
 * ARCHIVO: global.js
 * PARA QUÉ SIRVE: Este es el archivo principal que une todas las piezas.
 * QUÉ HACE: Controla el fondo de estrellas, el menú lateral y el cambio de modo noche/día.
 */

document.addEventListener('DOMContentLoaded', () => {
    // [ ACCIÓN: Al encender la página, configuramos todo lo compartido ]
    configurarTemaGlobal();
    configurarMenuLateralGlobal();
    configurarScrollHeader();
    actualizarContadorCarritoGlobal();
    inyectarFondoGalaxia();
    actualizarInterfazUsuarioGlobal();
});

/**
 * FUNCIÓN: inyectarFondoGalaxia
 * PARA QUÉ SIRVE: Crea el fondo de estrellas que ves en todas las páginas.
 * QUÉ HACE: Crea un contenedor y le mete 150 "estrellas" (puntos blancos) en posiciones aleatorias.
 */
function inyectarFondoGalaxia() {
    if (!document.getElementById('fondoEstrellas')) {
        const fondo = document.createElement('div');
        fondo.id = 'fondoEstrellas';
        fondo.className = 'fondo-estrellas';
        document.body.prepend(fondo);

        // [ ACCIÓN: Crear los orbes de luz desenfocados ]
        const orbe1 = document.createElement('div');
        orbe1.className = 'orbe orbe-1';
        document.body.prepend(orbe1);

        const orbe2 = document.createElement('div');
        orbe2.className = 'orbe orbe-2';
        document.body.prepend(orbe2);

        generarEstrellas(fondo);
    }
}

function generarEstrellas(contenedor) {
    const cantidad = 150;
    for (let i = 0; i < cantidad; i++) {
        const s = document.createElement('div');
        s.className = 'estrella';
        const size = Math.random() * 2.5 + 0.5;
        s.style.cssText = `
            width: ${size}px; height: ${size}px;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            --dur: ${2 + Math.random() * 5}s;
            --delay: -${Math.random() * 10}s;
            opacity: ${Math.random() * 0.7 + 0.1};
        `;
        contenedor.appendChild(s);
    }
}

/**
 * FUNCIÓN: configurarTemaGlobal
 * PARA QUÉ SIRVE: Permite cambiar entre modo Oscuro (Galaxia) y modo Claro.
 * QUÉ HACE: Guarda tu elección en la memoria local para que la web recuerde tu tema favorito.
 */
function configurarTemaGlobal() {
    const botonTema = document.getElementById('boton-tema');
    if (!botonTema) return;

    const cuerpo = document.body;
    const temaGuardado = localStorage.getItem('tema');

    if (temaGuardado === 'claro') {
        cuerpo.classList.add('modo-claro');
        botonTema.innerHTML = '<i class="fas fa-sun"></i>';
    }

    botonTema.addEventListener('click', () => {
        cuerpo.classList.toggle('modo-claro');
        const esClaro = cuerpo.classList.contains('modo-claro');
        botonTema.innerHTML = esClaro ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('tema', esClaro ? 'claro' : 'oscuro');
    });
}

/**
 * FUNCIÓN: configurarMenuLateralGlobal
 * PARA QUÉ SIRVE: Controla la apertura y cierre del menú que sale de un lado.
 * QUÉ HACE: Añade una clase CSS llamada "abierto" para mover el menú a la vista del usuario.
 */
function configurarMenuLateralGlobal() {
    const btnMenu = document.getElementById('abrir-menu');
    const btnCerrarMenu = document.getElementById('cerrar-menu');
    const menuLateral = document.getElementById('menu-lateral');
    const overlayMenu = document.getElementById('overlay-menu');

    if (!btnMenu || !menuLateral || !overlayMenu) return;

    const cerrarMenu = () => {
        menuLateral.classList.remove('abierto');
        overlayMenu.classList.remove('visible');
        document.body.style.overflow = ''; 
    };

    btnMenu.addEventListener('click', () => {
        menuLateral.classList.add('abierto');
        overlayMenu.classList.add('visible');
        document.body.style.overflow = 'hidden'; 
    });

    if (btnCerrarMenu) btnCerrarMenu.addEventListener('click', cerrarMenu);
    overlayMenu.addEventListener('click', cerrarMenu);

    const enlaces = menuLateral.querySelectorAll('.enlaces-menu a');
    enlaces.forEach(enlace => enlace.addEventListener('click', cerrarMenu));
}

/**
 * FUNCIÓN: configurarScrollHeader
 * PARA QUÉ SIRVE: Cambia el color del encabezado cuando bajas por la página.
 * QUÉ HACE: Detecta el movimiento del ratón y pone una sombra al menú superior.
 */
function configurarScrollHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * FUNCIÓN: actualizarContadorCarritoGlobal
 * PARA QUÉ SIRVE: Muestra cuántos libros has elegido en el circulito del carrito.
 */
function actualizarContadorCarritoGlobal() {
    const carrito = JSON.parse(localStorage.getItem('biblioteca-carrito')) || [];
    document.querySelectorAll('.contador-carrito').forEach(el => {
        el.innerText = carrito.length;
    });
}

/**
 * FUNCIÓN: actualizarInterfazUsuarioGlobal
 * PARA QUÉ SIRVE: Detecta si iniciaste sesión para mostrar tu perfil.
 * QUÉ HACE: Cambia el botón de "Login" por "Mi Perfil" y añade un botón de "Cerrar Sesión".
 */
function actualizarInterfazUsuarioGlobal() {
    const usuario = JSON.parse(localStorage.getItem('sesion-usuario'));
    const enlacesMenu = document.querySelector('.enlaces-menu');
    
    if (!enlacesMenu) return;

    if (usuario) {
        const enlaceLogin = Array.from(enlacesMenu.querySelectorAll('a')).find(a => a.href.includes('login.html'));
        
        if (enlaceLogin) {
            enlaceLogin.innerHTML = `<i class="fas fa-user-circle"></i> Mi Perfil`;
            enlaceLogin.href = window.location.pathname.includes('principal') || window.location.pathname.includes('vender') || window.location.pathname.includes('login') 
                ? (window.location.pathname.includes('principal') ? '../perfil/perfil.html' : '../perfil/perfil.html')
                : 'perfil/perfil.html';
                
            const btnLogout = document.createElement('a');
            btnLogout.href = '#';
            btnLogout.innerHTML = `<i class="fas fa-sign-out-alt"></i> Cerrar Sesión`;
            btnLogout.onclick = (e) => {
                e.preventDefault();
                cerrarSesionGlobal();
            };
            enlacesMenu.appendChild(btnLogout);
        }
    }
}

function cerrarSesionGlobal() {
    localStorage.removeItem('sesion-usuario');
    window.location.href = window.location.pathname.includes('principal') ? 'principal.html' : '../principal/principal.html';
}

window.actualizarContadorGlobal = actualizarContadorCarritoGlobal;
