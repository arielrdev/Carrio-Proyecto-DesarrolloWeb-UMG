// Variables Globales
let articulosCarrito = [];
const MaxArticulos = 9;

const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const totalPagarElemento = document.getElementById('total-pagar');


document.addEventListener('DOMContentLoaded', () => {
    // Cargar carrito desde localStorage
    articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carritoHTML(); 

    cargarEventListenersConfirmar();
});

/**
 * Funciones comunes para ambas páginas
 */
function carritoHTML() {
    limpiarHTML();

    articulosCarrito.forEach( producto => {
        const { imagen, titulo, precio, cantidad, id } = producto;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${imagen}" width="100"></td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>
                <button class="restar-cantidad btn btn-dark" data-id=${id}>-</button>
                ${cantidad}
                <button class="sumar-cantidad btn btn-dark" data-id=${id}>+</button>
            </td>
            <td>
               <a class="button input btn-red" href="#">Eliminar</a>

                <a class="button input btn-black" href="tienda.html">Ver Carrito</a>
            </td>
        `;
        contenedorCarrito.appendChild(row);
    });

    actualizarTotalPagar();
}

function limpiarHTML() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

function actualizarTotalPagar() {
    const totalPagar = articulosCarrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
    totalPagarElemento.textContent = `Total a pagar: Q${totalPagar.toFixed(2)}`;
}


// Eventos para la página de confirmación
function cargarEventListenersConfirmar() {
    const confirmarBtn = document.querySelector('.agregar-carrito');
    
    confirmarBtn.addEventListener('click', confirmarOrden);
}

function confirmarOrden(e) {
    e.preventDefault();
    alert('Orden confirmada. ¡Gracias por su compra!');
    vaciarCarrito(); // TODO: implementar funcion
}


// Sincroniza el carrito con localStorage
function sincronizarLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}
