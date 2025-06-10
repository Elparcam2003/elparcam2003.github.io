// En un futuro podeer agregar trabajadores a la lista desde el menu
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
// Modificable desde el menu
let inventario = [
    { id: 1, nombre: "Resma de papel", precio: 10, stock: 5, stockMinimo: 2 },
    { id: 2, nombre: "Cartuchos de tinta", precio: 15, stock: 3, stockMinimo: 1 },
    { id: 3, nombre: "Bolígrafos", precio: 1, stock: 10, stockMinimo: 5 }
];

// Función para mostrar una sección especifica
function mostrarSeccion(id) {
    document.querySelectorAll(".seccion").forEach(seccion => seccion.style.display = "none");
    let seleccionada = document.getElementById(id);
    if (seleccionada) seleccionada.style.display = "block";
}

// Inicializacion al cargar la pagina
document.addEventListener("DOMContentLoaded", function() {
    mostrarSeccion("dolar");
    obtenerValorDolar();
    mostrarInventario();
    mostrarComisiones();
    mostrarResumenIngresos();
    mostrarHistorialVentas();
    cargarArticulos();
});

// funcion para registrar una venta de artículos o servicios
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
    verificarSesion();// Al cargar verificar si el usuario esta autenticado

    const formRegistro = document.getElementById("formRegistro");
    if (formRegistro) {
        formRegistro.addEventListener("submit", function(e) {
            e.preventDefault(); 
            agregarArticulo();
        });
    }

    const formEliminar = document.getElementById("formEliminar");
    if (formEliminar) {
        formEliminar.addEventListener("submit", function(e) {
            e.preventDefault(); 
            eliminarArticulo();
        });
    }
});

// Lista de usuarios permitidos(Futuro:Agregar un apartado de perfil para eliminar o agregar usuarios y claves)
const usuariosValidos = [
    { usuario: "admin", password: "1234" },
    { usuario: "pedro", password: "5678" },
    { usuario: "ana", password: "abcd" }
];

// Funcion para iniciar sesion
document.getElementById("formLogin").addEventListener("submit", function(event) {
    event.preventDefault();

    let usuario = document.getElementById("usuario").value.trim();
    let password = document.getElementById("password").value.trim();

    let usuarioEncontrado = usuariosValidos.find(u => u.usuario === usuario && u.password === password);

    if (usuarioEncontrado) {
        sessionStorage.setItem("usuarioActivo", usuario);
        mostrarPaginaPrincipal();
    } else {
        document.getElementById("mensajeError").style.display = "block";
    
    }
});

// Funcion para mostrar la pagina principal despues del login
function mostrarPaginaPrincipal() {
    document.getElementById("login").style.display = "none"; // Oculta el login
    document.getElementById("contenido").style.display = "block"; // muestra la pagina principal
    document.getElementById("hero").style.display = "block"; // Mostrar el encabezado
}

// funcion para verificar si hay sesion activa
function verificarSesion() {
    let usuarioActivo = sessionStorage.getItem("usuarioActivo");
    if (usuarioActivo) {
        mostrarPaginaPrincipal();
    } else {
        document.getElementById("login").style.display = "block"; // Mostrar login
        document.getElementById("contenido").style.display = "none"; // Ocultar contenido
    }
}

// Funcin para cerrar sesión
function cerrarSesion() {
    sessionStorage.removeItem("usuarioActivo"); // Eliminar sesión
    location.reload(); // Recargar la página para volver al login
}


// funcion para mostrar inventario
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
    cargarArticulos();
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

// Funcion para cargar artículos en el formulario de ventas
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

function mostrarFormularioRegistro() {
    document.querySelectorAll(".seccion").forEach(seccion => seccion.style.display = "none");
    let seccionRegistro = document.getElementById("registro-articulo");
    if (seccionRegistro) {
        seccionRegistro.style.display = "block";
    }
}

function mostrarFormularioEliminar() {
    document.querySelectorAll(".seccion").forEach(seccion => seccion.style.display = "none");
    let seccionEliminar = document.getElementById("eliminar-articulo-form");
    if (seccionEliminar) {
        seccionEliminar.style.display = "block";
    }
}

function agregarArticulo() {
    let nombre = document.getElementById("nombreArticulo").value.trim();
    let precio = parseFloat(document.getElementById("precioArticulo").value);
    let stock = parseInt(document.getElementById("stockArticulo").value);
    let stockMinimo = parseInt(document.getElementById("stockMinimoArticulo").value);

    if (!nombre || isNaN(precio) || isNaN(stock) || isNaN(stockMinimo)) {
        alert("Por favor, ingresa datos válidos.");
        return;
    }

    let nuevoArticulo = {
        id: inventario.length + 1,
        nombre: nombre,
        precio: precio,
        stock: stock,
        stockMinimo: stockMinimo
    };

    inventario.push(nuevoArticulo);
    mostrarInventario();

    alert(`Artículo "${nombre}" agregado correctamente.`);
    document.getElementById("formRegistro").reset();
}

function eliminarArticulo() {
    let nombre = document.getElementById("nombreEliminar").value.trim();

    let index = inventario.findIndex(item => item.nombre.toLowerCase() === nombre.toLowerCase());

    if (index === -1) {
        alert("Artículo no encontrado.");
        return;
    }

    inventario.splice(index, 1);
    mostrarInventario(); 

    alert(`Artículo "${nombre}" eliminado correctamente.`);
    document.getElementById("formEliminar").reset();
}


// Obtener valor del dolar(Api Externa)
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
