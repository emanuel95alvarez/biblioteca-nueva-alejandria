/** 
 * ARCHIVO: vender.js
 * PARA QUÉ SIRVE: Maneja el formulario de "Vender Libro".
 * QUÉ HACE: Permite subir fotos, llenar los datos del libro y guardarlos para que aparezcan en el inicio.
 */

document.addEventListener('DOMContentLoaded', () => {
    // [ ACCIÓN: Seguridad - Si no estás logueado, no puedes entrar a vender ]
    const usuarioLogueado = JSON.parse(localStorage.getItem('sesion-usuario'));
    if (!usuarioLogueado) {
        alert('debes iniciar sesion para poder vender libros.');
        window.location.href = '../login/login.html';
        return;
    }

    configurarSubidaImagen();
    configurarFormulario();
});

/**
 * FUNCIÓN: configurarSubidaImagen
 * PARA QUÉ SIRVE: Muestra una vista previa de la foto del libro que eliges.
 * QUÉ HACE: Lee el archivo de tu computadora y lo pone dentro del recuadro de la página.
 */
function configurarSubidaImagen() {
    const inputFoto = document.getElementById('input-foto');
    const vistaPrevia = document.getElementById('vista-previa');

    inputFoto.addEventListener('change', (e) => {
        const archivo = e.target.files[0];
        if (archivo) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // [ ACCIÓN: Meter la imagen en el círculo/recuadro ]
                vistaPrevia.innerHTML = `<img src="${event.target.result}" alt="Vista previa">`;
            };
            reader.readAsDataURL(archivo);
        }
    });
}

/**
 * FUNCIÓN: configurarFormulario
 * PARA QUÉ SIRVE: Captura todos los datos del libro cuando le das al botón de publicar.
 * QUÉ HACE: Crea un objeto con el título, autor, precio e imagen, y lo guarda en la memoria.
 */
function configurarFormulario() {
    const formulario = document.getElementById('formulario-vender');
    const notificacion = document.getElementById('notificacion');
    const usuarioLogueado = JSON.parse(localStorage.getItem('sesion-usuario'));

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        // [ ACCIÓN: Recoger los valores escritos por el usuario ]
        const titulo = document.getElementById('titulo').value;
        const autor = document.getElementById('autor').value;
        const precio = document.getElementById('precio').value;
        const categoria = document.getElementById('categoria').value;
        const resena = document.getElementById('resena').value;

        // [ ACCIÓN: Obtener la imagen que se previsualizó ]
        const imgPreview = document.querySelector('#vista-previa img');
        const imagenData = imgPreview ? imgPreview.src : null;

        const nuevoLibro = {
            id: Date.now(), // Usamos la hora actual como ID único
            titulo,
            autor,
            precio: parseInt(precio),
            genero: categoria,
            resena,
            imagen: imagenData,
            vendedorId: usuarioLogueado.id, // Recordamos quién es el dueño del libro
            color: 'linear-gradient(45deg, var(--color-primario), var(--color-acento))'
        };

        // [ ACCIÓN: Guardar el nuevo libro en la lista global ]
        const librosPublicados = JSON.parse(localStorage.getItem('libros-usuario')) || [];
        librosPublicados.unshift(nuevoLibro);
        localStorage.setItem('libros-usuario', JSON.stringify(librosPublicados));

        // [ ACCIÓN: Mostrar aviso de éxito ]
        notificacion.classList.add('visible');

        // [ ACCIÓN: Limpiar todo para poder subir otro ]
        setTimeout(() => {
            notificacion.classList.remove('visible');
            formulario.reset();
            document.getElementById('vista-previa').innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <span>Sube la portada</span>
            `;
        }, 3000);
    });
}
