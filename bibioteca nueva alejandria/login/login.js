/** 
 * ARCHIVO: login.js
 * PARA QUÉ SIRVE: Maneja la entrada y el registro de nuevos usuarios.
 * QUÉ HACE: Guarda los datos de los usuarios en el navegador y permite entrar a la web.
 */

// [ ACCIÓN: Cambiar entre las pestañas de "Entrar" y "Registrarse" ]
function cambiarTab(tipo) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach((t, i) => t.classList.toggle('activo', (tipo === 'login' && i === 0) || (tipo === 'registro' && i === 1)));
    document.getElementById('formLogin').classList.toggle('visible', tipo === 'login');
    document.getElementById('formRegistro').classList.toggle('visible', tipo === 'registro');
    ocultarMensaje();
}

/**
 * FUNCIÓN: toggleContrasena
 * PARA QUÉ SIRVE: Muestra u oculta los puntitos de la contraseña.
 */
function toggleContrasena(id, btn) {
    const input = document.getElementById(id);
    const icono = btn.querySelector('i');
    const mostrar = input.type === 'password';
    input.type = mostrar ? 'text' : 'password';
    icono.className = mostrar ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
}

/**
 * FUNCIÓN: mostrarMensaje
 * PARA QUÉ SIRVE: Pone un aviso rojo (error) o verde (éxito) en pantalla.
 */
function mostrarMensaje(texto, tipo) {
    const el = document.getElementById('mensajeEstado');
    el.textContent = texto;
    el.className = 'mensaje ' + tipo;
    el.style.display = 'flex';
}

function ocultarMensaje() {
    const el = document.getElementById('mensajeEstado');
    el.style.display = 'none';
}

/**
 * FUNCIÓN: iniciarSesion
 * PARA QUÉ SIRVE: Revisa si el correo y la clave son correctos.
 * QUÉ HACE: Busca en la lista de usuarios guardados y, si existen, te manda al Inicio.
 */
function iniciarSesion() {
    const email = document.getElementById('emailLogin').value.trim();
    const pass = document.getElementById('passwordLogin').value;

    if (!email || !pass) {
        mostrarMensaje(' Por favor completa todos los campos.', 'error');
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios-biblioteca')) || [];
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.pass === pass);

    if (usuarioEncontrado) {
        // [ ACCIÓN: Guardar quién entró para recordarlo en otras páginas ]
        localStorage.setItem('sesion-usuario', JSON.stringify(usuarioEncontrado));
        mostrarMensaje('✓ Bienvenido, ' + usuarioEncontrado.nombre + '. Redirigiendo...', 'exito');
        setTimeout(() => { window.location.href = '../principal/principal.html'; }, 1500);
    } else {
        mostrarMensaje(' Correo o contraseña incorrectos.', 'error');
    }
}

/**
 * FUNCIÓN: registrar
 * PARA QUÉ SIRVE: Crea una cuenta nueva.
 * QUÉ HACE: Guarda los datos en una lista "secreta" del navegador llamada localStorage.
 */
function registrar() {
    const nombre = document.getElementById('nombreReg').value.trim();
    const email = document.getElementById('emailReg').value.trim();
    const pass = document.getElementById('passwordReg').value;

    if (!nombre || !email || !pass) {
        mostrarMensaje(' Por favor completa todos los campos.', 'error');
        return;
    }

    // [ ACCIÓN: No dejar crear dos cuentas con el mismo email ]
    const usuarios = JSON.parse(localStorage.getItem('usuarios-biblioteca')) || [];
    if (usuarios.some(u => u.email === email)) {
        mostrarMensaje('❌ Este correo ya está registrado.', 'error');
        return;
    }

    const nuevoUsuario = {
        id: Date.now(),
        nombre: nombre,
        email: email,
        pass: pass,
        librosPublicados: [],
        ventas: 0,
        miembroDesde: new Date().toLocaleDateString()
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios-biblioteca', JSON.stringify(usuarios));

    mostrarMensaje('✓ ¡Cuenta creada! Ya puedes iniciar sesión.', 'exito');

    setTimeout(() => {
        document.getElementById('nombreReg').value = '';
        document.getElementById('emailReg').value = '';
        document.getElementById('passwordReg').value = '';
        cambiarTab('login');
    }, 2000);
}

// [ ACCIÓN: Permite entrar al login con la tecla Enter ]
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const formLogin = document.getElementById('formLogin');
        if (formLogin && formLogin.classList.contains('visible')) {
            iniciarSesion();
        } else {
            registrar();
        }
    }
});