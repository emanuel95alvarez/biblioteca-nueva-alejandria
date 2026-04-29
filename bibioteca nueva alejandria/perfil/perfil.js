/** 
 * ARCHIVO: perfil.js
 * PARA QUÉ SIRVE: Muestra el panel de control del usuario.
 * QUÉ HACE: Carga tus datos, cuenta tus libros y te deja borrarlos si quieres.
 */

document.addEventListener('DOMContentLoaded', () => {
    // [ ACCIÓN: Seguridad - Si no hay sesión, te manda al login ]
    const usuario = JSON.parse(localStorage.getItem('sesion-usuario'));

    if (!usuario) {
        window.location.href = '../login/login.html';
        return;
    }

    // [ ACCIÓN: Llenar la tarjeta de perfil con tus datos reales ]
    document.getElementById('userName').innerText = usuario.nombre;
    document.getElementById('userEmail').innerText = usuario.email;
    document.getElementById('userDate').innerText = `Miembro desde: ${usuario.miembroDesde || 'Abril 2026'}`;
    document.getElementById('userAvatar').innerText = usuario.nombre.charAt(0).toUpperCase();

    cargarMisLibros(usuario.id);
});

/**
 * FUNCIÓN: cargarMisLibros
 * PARA QUÉ SIRVE: Busca solo los libros que tú has publicado.
 * QUÉ HACE: Filtra la lista global de libros por tu "vendedorId" y los muestra en pantalla.
 */
function cargarMisLibros(usuarioId) {
    const librosGlobales = JSON.parse(localStorage.getItem('libros-usuario')) || [];
    const misLibros = librosGlobales.filter(l => l.vendedorId === usuarioId);
    const contenedor = document.getElementById('misLibrosContenedor');

    // [ ACCIÓN: Actualizar el contador de libros vendidos/publicados ]
    document.getElementById('statLibros').innerText = misLibros.length;

    if (misLibros.length === 0) {
        contenedor.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--texto-tenue);">
                    <p>Aún no has publicado ningún libro. ¡Anímate a vender!</p>
                </div>`;
        return;
    }

    // [ ACCIÓN: Dibujar cada uno de tus libros ]
    contenedor.innerHTML = misLibros.map(libro => `
                <div class="tarjeta-libro" style="margin: 0;">
                    ${libro.imagen
            ? `<img src="${libro.imagen}" class="imagen-libro">`
            : `<div style="width:100%; height:250px; background:${libro.color}; border-radius:15px; display:flex; align-items:center; justify-content:center;"><i class="fas fa-book" style="font-size:3rem;"></i></div>`
        }
                    <div class="info-libro">
                        <span class="titulo-libro">${libro.titulo}</span>
                        <span class="autor-libro">${libro.autor}</span>
                        <span class="precio">$${libro.precio.toLocaleString()}</span>
                        <button class="btn-eliminar-libro" onclick="eliminarMiLibro(${libro.id})">
                            <i class="fas fa-trash"></i> Eliminar Publicación
                        </button>
                    </div>
                </div>
            `).join('');
}

/**
 * FUNCIÓN: eliminarMiLibro
 * PARA QUÉ SIRVE: Borra una publicación tuya.
 * QUÉ HACE: Saca el libro de la lista y actualiza la página automáticamente.
 */
function eliminarMiLibro(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este libro?')) {
        let librosGlobales = JSON.parse(localStorage.getItem('libros-usuario')) || [];
        librosGlobales = librosGlobales.filter(l => l.id !== id);
        localStorage.setItem('libros-usuario', JSON.stringify(librosGlobales));

        // [ ACCIÓN: Recargar la lista para que el libro desaparezca visualmente ]
        const usuario = JSON.parse(localStorage.getItem('sesion-usuario'));
        cargarMisLibros(usuario.id);
    }
}

/**
 * FUNCIÓN: reiniciarTodaLaApp
 * PARA QUÉ SIRVE: Borra TODA la memoria del navegador.
 * QUÉ HACE: Limpia el localStorage y te manda al inicio, dejando la web como nueva.
 */
function reiniciarTodaLaApp() {
    if (confirm('como dice el mensaje de abajo esto eliminara todo lo guardado en el localStorage estas seguro?')) {
        localStorage.clear();
        alert('SE REINICIO ESTA VAINA.');
        window.location.href = '../principal/principal.html';
    }
}
