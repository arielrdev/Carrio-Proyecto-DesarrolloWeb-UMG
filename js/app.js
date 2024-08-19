// Variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
const notificacionCarrito = document.getElementById('notificacion-carrito');
const totalPagarElemento = document.getElementById('total-pagar');
const btnRestarCantidad = document.querySelectorAll('.restar-cantidad')
const btnSumarCantidad = document.querySelectorAll('.sumar-cantidad')

const MaxArticulos = 9;

let articulosCarrito = [];

cargarEventListeners();

function cargarEventListeners() {
    /** Cargar carrito desde LocalStorage */
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    })

    /** Cuando agregar un curso presionando "Agregar al Carrito" */
    listaCursos.addEventListener('click', agregarProducto)

    /** Eliminar articulo del carrito */
    carrito.addEventListener('click', eliminarProducto)

    /** Vaciar Carrito */
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito)
}

//Funciones
function agregarProducto(e) {
    e.preventDefault()

    /** Se ASEGURA que el usuario haya presionado el BTN AGREGAR AL CARRITO */
    if(e.target.classList.contains('agregar-carrito')) {
       const productoSelecionado = e.target.parentElement.parentElement    
       leerDatosProducto(productoSelecionado)        
    }
}

/** Eliminar elementos del carrito */
function eliminarProducto(e) {
    if(e.target.classList.contains('borrar-curso')) {
    const productoId = e.target.getAttribute('data-id')
    
    /** Elimina del arreglo de articulosCarrito por el data-id */
    articulosCarrito = articulosCarrito.filter( producto => producto.id !== productoId)
    
    carritoHTML() /** Recorre el HTML del carrito - Imprimir */
    sincronizarLocalStorage();
    }

}

//Lee el contenido del HTML al que le dimos clikc y extrae la informacion del articulo
function leerDatosProducto(producto) {
    //Crear un objeto con el contenido del curso actual
    const infoProducto = {
        imagen: producto.querySelector('img').src,
        titulo: producto.querySelector('h4').textContent,
        precio: parseFloat(producto.querySelector('.precio span').textContent.replace('Q', '')), // Convertir a número
        id: producto.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    /*Revisa si un elemento ya existe en el carrito .some recorre el objeto
    */
    const existe = articulosCarrito.some( producto => producto.id === infoProducto.id );
    if(existe) {
        /** Actualizar la Cantidad */
        const articulos = articulosCarrito.map( (producto) => {
            if(producto.id === infoProducto.id ) {
                /** Verificar si la cantidad acutal es menor al maximo permitido */
                if(producto.cantidad < MaxArticulos) {
                    producto.cantidad++;
                }
                return producto; // retorna el objeto actualizado
            }else{
                return producto; // retorna los objetos que no son duplicados
            }
        });

        articulosCarrito = [...articulos]
    }else {
        /** Agregar al carrito */
        articulosCarrito = [...articulosCarrito, infoProducto];
    }

    //Llamar funcion
    carritoHTML();
    sincronizarLocalStorage();
}

//Muestra el carrito de compras en el HTML
function carritoHTML() {
    //Antes de crear el HTML se debe limpiar el HTML
    limpiarHTML()

    articulosCarrito.forEach( (producto) => {
        const { imagen, titulo, precio, cantidad, id } = producto;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src=${imagen} width="100"> 
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>
                <button class="restar-cantidad btn btn-dark" data-id=${id}>-</button>
                ${cantidad}
                <button class="sumar-cantidad btn btn-dark" data-id=${id}>+</button>
            </td>
            <td>
                <a href="#" class="borrar-curso" data-id=${id}> X </a>
            </td>
        `;

        //Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row)
    });
    
    actualizarNotificacionCarrito();
    actualizarTotalPagar();
    agregarEventListenersCantidad();
}

/** Elimina los articulos del tbody */
function limpiarHTML() {
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}

/** Notificacion */
function actualizarNotificacionCarrito() {
    const totalArticulos = articulosCarrito.reduce((total, producto) => total + producto.cantidad, 0);
    
    if (totalArticulos > 0) {
        notificacionCarrito.classList.add('notificacion-carrito--visible');
        notificacionCarrito.setAttribute('data-cantidadnotificacion', totalArticulos);
    } else {
        notificacionCarrito.classList.remove('notificacion-carrito--visible');
        notificacionCarrito.setAttribute('data-cantidadnotificacion', 0);
    }
}

function vaciarCarrito() {
    /** Vaciar el arreglo de articulos */
    articulosCarrito = []
    
    /** Limpiar HTML */
    limpiarHTML()

    /** Actualizar la notificacion */
    actualizarNotificacionCarrito();
    sincronizarLocalStorage();
    actualizarTotalPagar();
}

function sincronizarLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

function actualizarTotalPagar() {
    const totalPagar = calcularTotalPagar();

    if(articulosCarrito.length) {
        totalPagarElemento.innerHTML = `Total a Pagar: <span>Q ${totalPagar.toFixed(2)}</span>`;
        totalPagarElemento.style.display = 'block';
    }else {
        totalPagarElemento.style.display = 'none';
    }
}


function calcularTotalPagar() {
    return articulosCarrito.reduce((total, curso) => total + (curso.precio * curso.cantidad), 0);
}


/** Arrastra y Soltar */

function allowDrop(event) {
    event.preventDefault(); // Permitir que el carrito acepte el elemento soltado.
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const product = document.getElementById(data);
    leerDatosProducto(product)
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.closest('.card').id); // Guardar el ID del producto que se está arrastrando.
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

    sincronizarLocalStorage()

}

function restarCantidad(id) {
    const producto = articulosCarrito.find(producto => producto.id === id);

    if(producto.cantidad > 1) {
        producto.cantidad--;
    }else{
        articulosCarrito = articulosCarrito.filter(producto => producto.id !== id);
    }

    carritoHTML();
}


function sumarCantidad(id) {
    const producto = articulosCarrito.find(producto => producto.id === id);
    if(producto.cantidad < MaxArticulos) {
        producto.cantidad++
    }
    
    carritoHTML()
}



