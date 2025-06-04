// Variables globales
let vendedores = [
    { nombre: "Pedro", totalVentas: 0, comision: 0 },
    { nombre: "Ana", totalVentas: 0, comision: 0 },
    { nombre: "Luis", totalVentas: 0, comision: 0 }
];

let ingresosPorServicio = {
    copias: 0,
    impresiones: 0,
    rif: 0
};

let ventas = [];

let inventario = [
    { id: 1, nombre: "Resma de papel", precio: 10, stock: 5, stockMinimo: 2 },
    { id: 2, nombre: "Cartuchos de tinta", precio: 15, stock: 3, stockMinimo: 1 },
    { id: 3, nombre: "Bolígrafos", precio: 1, stock: 10, stockMinimo: 5 }
];

// Función para mostrar una sección específica
function mostrarSeccion(id) {
    document.querySelectorAll(".seccion").forEach(seccion => seccion.style.display = "none");
    let seleccionada = document.getElementById(id);
    if (seleccionada) seleccionada.style.display = "block";
}

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    mostrarSeccion("dolar");
    obtenerValorDolar();
    mostrarInventario();
    mostrarComisiones();
    mostrarResumenIngresos();
    mostrarHistorialVentas();
    cargarArticulos();
});

// Función para registrar una venta de artículos o servicios
document.getElementById("formVenta").addEventListener("submit", function(event) {
    event.preventDefault();

    let cliente = document.getElementById("clienteNombre").value.trim();
    let vendedor = document.getElementById("vendedorNombre").value;
    let articulo = document.getElementById("articuloSeleccionado").value;
    let cantidad = parseInt(document.getElementById("cantidadVendida").value);

    if (cliente === "" || cantidad <= 0) {
        alert("Por favor, ingresa datos válidos.");
        return;
    }

    let articuloObj = inventario.find(item => item.nombre.toLowerCase() === articulo.toLowerCase());
    let esServicio = ["Fotocopias", "Impresiones", "Actualización RIF"].includes(articulo);

    if (!esServicio && (!articuloObj || cantidad > articuloObj.stock)) {
        alert("Stock insuficiente o artículo no disponible.");
        return;
    }

    let totalVenta = cantidad * (articuloObj ? articuloObj.precio : 5); 

    if (!esServicio) articuloObj.stock -= cantidad;

    let vendedorObj = vendedores.find(v => v.nombre === vendedor);
    if (vendedorObj) {
        vendedorObj.totalVentas += totalVenta;
        vendedorObj.comision = vendedorObj.totalVentas * 0.05;
    }

    ventas.push({ cliente, vendedor, articulo, cantidad, total: totalVenta });

    mostrarInventario();
    mostrarComisiones();
    mostrarHistorialVentas();

    alert(`Venta registrada exitosamente por ${vendedor} para el cliente ${cliente}.`);
    document.getElementById("formVenta").reset();
});

// Función para mostrar historial de ventas (eliminando código duplicado)
function mostrarComisiones() {
    let resumen = document.getElementById("comisiones");
    resumen.innerHTML = "<h2>Comisiones de Vendedores</h2>";

    let lista = document.createElement("ul");
    vendedores.forEach(vendedor => {
        let item = document.createElement("li");
        item.textContent = `${vendedor.nombre}: Ventas = ${vendedor.totalVentas} Bs | Comisión = ${vendedor.comision} Bs`;
        lista.appendChild(item);
    });

    resumen.appendChild(lista);
}

function mostrarHistorialVentas() {
    let lista = document.getElementById("historialVentas");
    lista.innerHTML = "<h2></h2>";

    ventas.forEach(venta => {
        let item = document.createElement("li");
        item.textContent = `Cliente: ${venta.cliente}, ${venta.articulo} vendido por ${venta.vendedor} - ${venta.cantidad} unidades = ${venta.total} Bs`;
        lista.appendChild(item);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    verificarSesion(); // Al cargar, verificar si el usuario está autenticado
});

// Lista de usuarios permitidos
const usuariosValidos = [
    { usuario: "admin", password: "1234" },
    { usuario: "pedro", password: "5678" },
    { usuario: "ana", password: "abcd" }
];

// Función para iniciar sesión
document.getElementById("formLogin").addEventListener("submit", function(event) {
    event.preventDefault();

    let usuario = document.getElementById("usuario").value.trim();
    let password = document.getElementById("password").value.trim();

    let usuarioEncontrado = usuariosValidos.find(u => u.usuario === usuario && u.password === password);

    if (usuarioEncontrado) {
        sessionStorage.setItem("usuarioActivo", usuario); // Guardar sesión temporalmente
        mostrarPaginaPrincipal(); // Redirigir a la página principal
    } else {
        document.getElementById("mensajeError").style.display = "block";
    
    }
});

// Función para mostrar la página principal después del login
function mostrarPaginaPrincipal() {
    document.getElementById("login").style.display = "none"; // Oculta el login
    document.getElementById("contenido").style.display = "block"; // Muestra la página principal
    document.getElementById("hero").style.display = "block"; // Mostrar el encabezado
}

// Función para verificar si hay sesión activa
function verificarSesion() {
    let usuarioActivo = sessionStorage.getItem("usuarioActivo");
    if (usuarioActivo) {
        mostrarPaginaPrincipal();
    } else {
        document.getElementById("login").style.display = "block"; // Mostrar login
        document.getElementById("contenido").style.display = "none"; // Ocultar contenido
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    sessionStorage.removeItem("usuarioActivo"); // Eliminar sesión
    location.reload(); // Recargar la página para volver al login
}


// Función para mostrar inventario corregido
function mostrarInventario() {
    let lista = document.getElementById("listaInventario");
    lista.innerHTML = "<h2>Inventario</h2>";

    inventario.forEach(item => {
        let li = document.createElement("li");
        li.textContent = `${item.nombre} - Precio: ${item.precio} Bs - Stock: ${item.stock}`;
        lista.appendChild(li);

        if (item.stock <= item.stockMinimo) {
            li.style.color = "red";
            li.textContent += " ⚠️ ¡Stock bajo!";
        }
    });
}

function mostrarFormularioVenta() {
    document.querySelectorAll(".seccion").forEach(seccion => seccion.style.display = "none"); 
    let formularioVenta = document.getElementById("ventas");
    if (formularioVenta) {
        formularioVenta.style.display = "block"; 
    }
    cargarArticulos(); // Asegura que los artículos del inventario estén disponibles
}

function mostrarResumenIngresos() {
    let resumen = document.getElementById("ingresos");
    resumen.innerHTML = "<h2>Ingresos por Servicios</h2>";

    let lista = document.createElement("ul");
    Object.entries(ingresosPorServicio).forEach(([servicio, ingreso]) => {
        let item = document.createElement("li");
        item.textContent = `${servicio}: ${ingreso} Bs`;
        lista.appendChild(item);
    });

    resumen.appendChild(lista);
}

// Función para cargar artículos en el formulario de ventas
function cargarArticulos() {
    let select = document.getElementById("articuloSeleccionado");
    select.innerHTML = ""; 

    inventario.forEach(item => {
        let option = document.createElement("option");
        option.value = item.nombre;
        option.textContent = `${item.nombre} (Stock: ${item.stock})`;
        select.appendChild(option);
    });

    let servicios = ["Fotocopias", "Impresiones", "Actualización RIF"];
    servicios.forEach(servicio => {
        let option = document.createElement("option");
        option.value = servicio;
        option.textContent = servicio;
        select.appendChild(option);
    });
}

// Obtener valor del dólar desde una API externa
async function obtenerValorDolar() {
    try {
        const respuesta = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const datos = await respuesta.json();
        let tasaCambio = datos.rates["VES"]; 

        document.getElementById("valorDolar").textContent = `1 USD = ${tasaCambio} Bs`;
    } catch (error) {
        document.getElementById("valorDolar").textContent = "Error al obtener el valor del dólar";
        console.error("Error al obtener los datos de la API", error);
    }
}