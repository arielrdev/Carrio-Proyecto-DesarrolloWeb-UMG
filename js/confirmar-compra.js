// Variables Globales
let articulosCarrito = [];
const MaxArticulos = 9;

const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const totalPagarElemento = document.getElementById('total-pagar');
const confirmarBtn = document.querySelector('.agregar-carrito');



cargarEventListeners();
// Eventos para la página de confirmación
function cargarEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
        // Cargar carrito desde localStorage
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML(); 
    });
    
    carrito.addEventListener('click', eliminarProducto);
    confirmarBtn.addEventListener('click', confirmarOrden);
}

/** Botones - RESTAR - SUMAR -  */
function agregarEventListenersCantidad() {
    const botonesRestar = document.querySelectorAll('.restar-cantidad');
    const botonesSumar = document.querySelectorAll('.sumar-cantidad');

    botonesRestar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            restarCantidad(id);
        });
    });

    botonesSumar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            sumarCantidad(id);
        });
    });

}

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
               <a href="#" class="borrar-producto button input btn-red" data-id=${id}>Eliminar</a>

                <a class="button input btn-black" href="tienda.html">Ver Carrito</a>
            </td>
        `;
        contenedorCarrito.appendChild(row);
    });

    actualizarTotalPagar();
    agregarEventListenersCantidad();

}

function limpiarHTML() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

function actualizarTotalPagar() {
    const totalPagar = articulosCarrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
    totalPagarElemento.innerHTML = `Total a Pagar: <span>Q ${totalPagar.toFixed(2)}</span>`;
}

function eliminarProducto(e) {
    if(e.target.classList.contains('borrar-producto')) {
    const productoId = e.target.getAttribute('data-id')
    
    /** Elimina del arreglo de articulosCarrito por el data-id */
    articulosCarrito = articulosCarrito.filter( producto => producto.id !== productoId)
    
    carritoHTML() /** Recorre el HTML del carrito - Imprimir */
    sincronizarLocalStorage();
    }
}


function confirmarOrden(e) {
    e.preventDefault();
    
    // Mostrar la notificación
    const toast = document.getElementById('toast');
    toast.classList.remove('hidden');
    toast.classList.add('show');
    

    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hidden');
        
        setTimeout(() => {
            vaciarCarrito(); 
            window.location.href = 'tienda.html';
        }, 500);
    }, 3000); // Tiempo en milisegundos
    
}


function restarCantidad(id) {
    
    const producto = articulosCarrito.find(producto => producto.id === id);

    if(producto.cantidad > 1) {
        producto.cantidad--;
    }else{
        articulosCarrito = articulosCarrito.filter(producto => producto.id !== id);
    }

    carritoHTML();
    sincronizarLocalStorage();
}

function sumarCantidad(id) {
    const producto = articulosCarrito.find(producto => producto.id === id);
    if(producto.cantidad < MaxArticulos) {
        producto.cantidad++
    }
    
    carritoHTML();
    sincronizarLocalStorage();
}


// Sincroniza el carrito con localStorage
function sincronizarLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

function vaciarCarrito() {
    /** Vaciar el arreglo de articulos */
    articulosCarrito = []
    
    /** Limpiar HTML */
    limpiarHTML()

    /** Actualizar la notificacion */
    sincronizarLocalStorage();
    actualizarTotalPagar();
}
