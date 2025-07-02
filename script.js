// En un futuro podeer agregar trabajadores a la lista desde el menu Apartado
let vendedores = [
    { nombre: "Pedro", totalVentas: 0, comision: 0 },
    { nombre: "Ana", totalVentas: 0, comision: 0 },
    { nombre: "Luis", totalVentas: 0, comision: 0 }
];
let ventas = [];
// Modificable desde el menu
let inventario = [
    { id: 1, nombre: "Resma de papel", precio: 10, stock: 5, stockMinimo: 2 },
    { id: 2, nombre: "Cartuchos de tinta", precio: 15, stock: 3, stockMinimo: 1 },
    { id: 3, nombre: "Bolígrafos", precio: 1, stock: 10, stockMinimo: 5 }
];

//   Para mostrar una seccion especifica
function mostrarSeccion(id) {
  document.querySelectorAll(".seccion").forEach(seccion => seccion.style.display = "none");
  const seleccionada = document.getElementById(id);
  if (seleccionada) seleccionada.style.display = "block";

  if (id === "historial") {
    mostrarHistorialVentas();
  }
}
/**
Toast.
  @param {string} msg
  @param {'success'|'error'|'info'} type
 */
function showToast(msg, type = 'info') {
  const container = document.getElementById('toasts');
  const div = document.createElement('div');
  div.className = `toast toast--${type}`;
  div.textContent = msg;
  container.appendChild(div);
  // Se elimina solo tras la animación completa (3s aprox)
  setTimeout(() => container.removeChild(div), 3400);
}


// Inicializacion al cargar la pagina
document.addEventListener("DOMContentLoaded", function() {
    mostrarSeccion("dolar");
    obtenerValorDolar();
    mostrarInventario();
    mostrarComisiones();
    mostrarReporteIngresos();
    mostrarHistorialVentas();
    cargarArticulos();
});

//para registrar una venta de articulos o servicios
document.getElementById("formVenta").addEventListener("submit", function(event) {
    event.preventDefault();

    let cliente = document.getElementById("clienteNombre").value.trim();
    let vendedor = document.getElementById("vendedorNombre").value;
    let articulo = document.getElementById("articuloSeleccionado").value;
    let cantidad = parseInt(document.getElementById("cantidadVendida").value);

    if (cliente === "" || cantidad <= 0) {
        showToast("Por favor, ingresa datos válidos.");
        return;
    }

    let articuloObj = inventario.find(item => item.nombre.toLowerCase() === articulo.toLowerCase());
    let esServicio = ["Fotocopias", "Impresiones", "Actualización RIF"].includes(articulo);

    if (!esServicio && (!articuloObj || cantidad > articuloObj.stock)) {
        showToast("Stock insuficiente o artículo no disponible.");
        return;
    }

    let totalVenta = cantidad * (articuloObj ? articuloObj.precio : 5); 

    if (!esServicio) articuloObj.stock -= cantidad;

    let vendedorObj = vendedores.find(v => v.nombre === vendedor);
    if (vendedorObj) {
        vendedorObj.totalVentas += totalVenta;
        vendedorObj.comision = vendedorObj.totalVentas * 0.05;
    }

ventas.push({ fecha: Date.now(), cliente, vendedor, articulo, cantidad, total: totalVenta });

    mostrarInventario();
    mostrarComisiones();
    mostrarHistorialVentas();

    showToast(`Venta registrada exitosamente por ${vendedor} para el cliente ${cliente}.`);
    document.getElementById("formVenta").reset();
});

// Para mostrar historial de ventas (eliminando codigo duplicado)
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
  const lista = document.getElementById("listaHistorialVentas");
  if (!lista) return;

  lista.innerHTML = ""; // Limpia lista previa

   if (ventas.length === 0) {
    const mensaje = document.createElement("li");
    mensaje.textContent = "No hay ventas registradas.";
    mensaje.style.fontStyle = "italic";
    mensaje.style.color = "#666";
    lista.appendChild(mensaje);
    return;
  }

  ventas.forEach(venta => {
    const item = document.createElement("li");
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
    document.getElementById("buscarHistorial")
        .addEventListener("input", filterHistorial);

// para ordenar encabezado de historial
document.querySelectorAll("#tablaHistorialVentas th")
  .forEach(th => {
    th.addEventListener("click", () => {
      sortHistorialBy(th.dataset.key);
    });
});
});

// Lista de usuarios permitidos(futro:Agregar un apartado de perfil para eliminar o agregar usuarios y claves)
const usuariosValidos = [
  { usuario: "admin", password: "1234", role: "admin" },
  { usuario: "pedro", password: "5678", role: "vendedor" },
  { usuario: "ana",  password: "abcd", role: "vendedor" }
];


// Funcion para iniciar sesion
document.getElementById("formLogin").addEventListener("submit", function(e) {
  e.preventDefault();
  let u = document.getElementById("usuario").value.trim();
  let p = document.getElementById("password").value.trim();
  let found = usuariosValidos.find(x => x.usuario === u && x.password === p);
  if (found) {
    sessionStorage.setItem("usuarioActivo", u);
    sessionStorage.setItem("rolActivo", found.role);    // guardamos el rol
    mostrarPaginaPrincipal();
  } else {
    document.getElementById("mensajeError").style.display = "block";
  }
});

//para verificar si hay sesion activa
function verificarSesion() {
    let usuarioActivo = sessionStorage.getItem("usuarioActivo");
    if (usuarioActivo) {
        mostrarPaginaPrincipal();
    } else {
        document.getElementById("login").style.display = "block"; // Mostrar login
        document.getElementById("contenido").style.display = "none"; // Ocultar contenido
    }
}

function applyRolePermissions() {
  const role = sessionStorage.getItem("rolActivo");
  if (role === "vendedor") {
    // oculta opciones de admin
    ["btnInventario","btnComisiones","btnIngresos"].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.style.display = "none";
    });
  }
}

//  mostrar la pagina principal despues del login
function mostrarPaginaPrincipal() {
  document.getElementById("login").style.display = "none";
  document.getElementById("hero").style.display  = "block";
  document.getElementById("contenido").style.display = "block";

  applyRolePermissions();  // aplicamos visibilidad de botones
}

function mostrarSeccion(id) {
  const role = sessionStorage.getItem("rolActivo");
  // bloqueos de sección para "vendedor"
  if (role === "vendedor" && ["inventario","comisiones","ingresos"].includes(id)) {
    showToast("No tienes permisos para acceder a esta sección","error");
    return;
  }

  document.querySelectorAll(".seccion").forEach(s => s.style.display = "none");
  const s = document.getElementById(id);
  if (s) s.style.display = "block";

  if (id === "historial") {
    document.getElementById("buscarHistorial").value = "";
    renderHistorial(ventas);
  }
  if (id === 'ingresos') mostrarReporteIngresos();
}

// Funcin para cerrar sesion
function cerrarSesion() {
    sessionStorage.removeItem("usuarioActivo"); // Eliminar sesion
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

function mostrarReporteIngresos() {
  const tbody = document.querySelector('#tablaIngresos tbody');
  if (!tbody) {
    console.error('✖ No encontré #tablaIngresos tbody en el DOM');
    return;
  }

  // Calculos
  const total = ventas.reduce((acc, v) => acc + v.total, 0);
  const count = ventas.length;
  const avg   = count ? (total / count).toFixed(2) : 0;
  const montos = ventas.map(v => v.total);
  const maxV = montos.length ? Math.max(...montos) : 0;
  const minV = montos.length ? Math.min(...montos) : 0;

  // Filas
  const rows = [
    ['Total Ventas',        `${total.toFixed(2)} Bs`],
    ['Número de Ventas',    count],
    ['Promedio por Venta',  `${avg} Bs`],
    ['Venta Máxima',        `${maxV.toFixed(2)} Bs`],
    ['Venta Mínima',        `${minV.toFixed(2)} Bs`]
  ];

  // Poblamos la tabla
  tbody.innerHTML = '';
  rows.forEach(([label, value]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${label}</td><td>${value}</td>`;
    tbody.appendChild(tr);
  });
}

// Funcion para cargar articulos en el formulario de ventas
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

function cargarArticulosEliminar() {
  const sel = document.getElementById("selectEliminarArticulo");
  sel.innerHTML = "";              // limpia opciones anteriores
  inventario.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.nombre;
    opt.textContent = item.nombre;
    sel.appendChild(opt);
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
  cargarArticulosEliminar();                   //  carga opciones
  document.querySelectorAll(".seccion")
          .forEach(s => s.style.display = "none");
  document.getElementById("eliminar-articulo-form")
          .style.display = "block";
}

// Manejo del submit para eliminar
document.getElementById("formEliminar")
        .addEventListener("submit", function(e) {
  e.preventDefault(); // prevenimos reload
  const sel = document.getElementById("selectEliminarArticulo");
  const nombre = sel.value;
  if (!nombre) {
    showToast("Selecciona un artículo para eliminar.", "error");
    return;
  }
  const idx = inventario.findIndex(i => i.nombre === nombre);
  if (idx < 0) {
    showToast("Artículo no encontrado.", "error");
    return;
  }
  inventario.splice(idx, 1);
  mostrarInventario();
  showToast(`Artículo "${nombre}" eliminado correctamente.`, "success");
  mostrarSeccion("inventario");
});

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

    showToast(`Artículo "${nombre}" agregado correctamente.`);
    document.getElementById("formRegistro").reset();
}

function eliminarArticulo() {
  const nombre = document.getElementById("selectEliminarArticulo").value;
  const idx = inventario.findIndex(item => item.nombre === nombre);
  if (idx < 0) {
    showToast("Artículo no encontrado.", "error");
    return;
  }
  inventario.splice(idx, 1);
  mostrarInventario();
  showToast(`Artículo "${nombre}" eliminado correctamente.`, "success");
  // volver a inventario o esconder el form
  mostrarSeccion("inventario");
}

// valor del dolar(Api Externa)
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

let currentSort = { key: null, asc: true };

/**
 * Renderiza filas en la tabla historial segun el array dado.
 */
function renderHistorial(data) {
  const tbody = document.querySelector("#tablaHistorialVentas tbody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6" style="font-style:italic;color:#666;">
      No hay registros que coincidan.</td>`;
    return tbody.appendChild(tr);
  }

  data.forEach(v => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(v.fecha).toLocaleString()}</td>
      <td>${v.cliente}</td>
      <td>${v.articulo}</td>
      <td>${v.vendedor}</td>
      <td>${v.cantidad}</td>
      <td>${v.total.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * filtra el array de ventas según el texto del buscador.
 */
function filterHistorial() {
  const term = document.getElementById("buscarHistorial")
                     .value.trim().toLowerCase();
  const filtered = ventas.filter(v =>
    v.cliente.toLowerCase().includes(term) ||
    v.articulo.toLowerCase().includes(term) ||
    v.vendedor.toLowerCase().includes(term)
  );
  renderHistorial(filtered);
}

/**
 * ordena tu array de ventas por la clave dada.
 */
function sortHistorialBy(key) {
  // Toggle asc/desc
  if (currentSort.key === key) {
    currentSort.asc = !currentSort.asc;
  } else {
    currentSort.key = key;
    currentSort.asc = true;
  }

  ventas.sort((a, b) => {
    let va = a[key], vb = b[key];
    // Fecha como nmero para comparar
    if (key === "fecha") {
      va = new Date(va); vb = new Date(vb);
    }
    if (va < vb) return currentSort.asc ? -1 : 1;
    if (va > vb) return currentSort.asc ? 1 : -1;
    return 0;
  });

  // Actualizar estilos de encabezados
  document.querySelectorAll("#tablaHistorialVentas th")
    .forEach(th => {
      th.classList.remove("sort-asc","sort-desc");
      if (th.dataset.key === key)
        th.classList.add(currentSort.asc ? "sort-asc":"sort-desc");
    });

  renderHistorial(ventas);
}
