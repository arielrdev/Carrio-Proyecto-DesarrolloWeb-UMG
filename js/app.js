// Variables
const carrito = document.querySelector('#carrito')
const contenedorCarrito = document.querySelector('#lista-carrito tbody')
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito')
const listaCursos = document.querySelector('#lista-cursos')
const notificacionCarrito = document.getElementById('notificacion-carrito')
const totalPagarElemento = document.getElementById('total-pagar')

let articulosCarrito = [];

cargarEventListeners()

function cargarEventListeners() {
    /** Cuando agregar un curso presionando "Agregar al Carrito" */
    listaCursos.addEventListener('click', agregarCurso)

    /** Eliminar articulo del carrito */
    carrito.addEventListener('click', eliminarCurso)

    /** Vaciar Carrito */
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito)

    /** Cargar carrito desde LocalStorage */
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    })

}

//Funciones
function agregarCurso(e) {
    e.preventDefault()

    /** Se ASEGURA que el usuario haya presionado el BTN AGREGAR AL CARRITO */
    if(e.target.classList.contains('agregar-carrito')) {
       const cursoSelecionado = e.target.parentElement.parentElement    
       leerDatosCurso(cursoSelecionado)        
    }
}

/** Eliminar elementos del carrito */
function eliminarCurso(e) {
    if(e.target.classList.contains('borrar-curso')) {
    const cursoId = e.target.getAttribute('data-id')
    
    /** Elimina del arreglo de articulosCarrito por el data-id */
    articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId)
    
    carritoHTML() /** Recorre el HTML del carrito - Imprimir */
    sincronizarLocalStorage();
    }

}

//Lee el contenido del HTML al que le dimos clikc y extrae la informacion del articulo
function leerDatosCurso(curso) {
    //Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: parseFloat(curso.querySelector('.precio span').textContent.replace('$', '')), // Convertir a número
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    /*Revisa si un elemento ya existe en el carrito .some recorre el objeto
    */
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id );
    if(existe) {
        /** Actualizar la Cantidad */
        const articulos = articulosCarrito.map( (curso) => {
            if(curso.id === infoCurso.id ) {
                curso.cantidad++;
                return curso; // retorna el objeto actualizado
            }else{
                return curso; // retorna los objetos que no son duplicados
            }
        });

        articulosCarrito = [...articulos]
    }else {
        /** Agregar al carrito */
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    //Llamar funcion
    carritoHTML();
    sincronizarLocalStorage();
}

//Muestra el carrito de compras en el HTML
function carritoHTML() {
    //Antes de crear el HTML se debe limpiar el HTML
    limpiarHTML()

    articulosCarrito.forEach( (curso) => {
        const { imagen, titulo, precio, cantidad, id } = curso
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src=${imagen} width="100"> 
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id=${id}> X </a>
            </td>
        `;

        //Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row)
    });
    
    actualizarNotificacionCarrito();
    actualizarTotalPagar();
}

/** Elimina los articulos del tbody */
function limpiarHTML() {
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}

/** Notificacion */
function actualizarNotificacionCarrito() {
    const totalArticulos = articulosCarrito.reduce((total, curso) => total + curso.cantidad, 0);
    
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

