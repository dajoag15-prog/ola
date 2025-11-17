// ===============================================
//   AÑADIR AL CARRITO DESDE LA TIENDA
// ===============================================
function agregarAlCarrito(codigo, nombre, precio, idCantidad, imagen) {

    let cantidad = parseInt(document.getElementById(idCantidad).value);

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Buscar si ya existe el producto
    let existe = carrito.find(item => item.codigo === codigo);

    if (existe) {
        existe.cantidad += cantidad;   // Sumar cantidad
    } else {
        carrito.push({
            codigo: codigo,
            nombre: nombre,
            precio: precio,
            cantidad: cantidad,
            imagen: imagen
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert("Producto agregado al carrito");
}


// ===============================================
//   CARGAR CARRITO AL ENTRAR
// ===============================================
document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
});


// ===============================================
//   OBTENER CARRITO
// ===============================================
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}


// ===============================================
//   GUARDAR CARRITO
// ===============================================
function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


// ===============================================
//   ELIMINAR ITEM
// ===============================================
function eliminarItem(codigo) {

    let carrito = obtenerCarrito();

    carrito = carrito.filter(item => item.codigo !== codigo);

    guardarCarrito(carrito);
    mostrarCarrito();
}




// ===============================================
//   MOSTRAR CARRITO EN pantalla
// ===============================================
function mostrarCarrito() {
    const contenedor = document.getElementById("lista-carrito");
    const totalTexto = document.getElementById("total");
    const totalTexto2 = document.getElementById("total2")
    const carrito = obtenerCarrito();

    contenedor.innerHTML = "";

    let total = 0;

    carrito.forEach(item => {
        total += item.precio * item.cantidad;

        const div = document.createElement("div");
        div.classList.add("item-carrito");

        div.innerHTML = `
            <img src="${item.imagen}" class="img-carrito">

            <div class="info">
                <p><strong>${item.nombre}</strong></p>
                <p>Código: ${item.codigo}</p>
                <p>Precio: $${item.precio}</p>
                <p>Cantidad: ${item.cantidad}</p>
                <p>Subtotal: $${item.precio * item.cantidad}</p>
            </div>

            <button class="btn-eliminar" onclick="eliminarItem('${item.codigo}')">
                Eliminar
            </button>
        `;

        contenedor.appendChild(div);
    });

    totalTexto.textContent = "Total: $" + total;
    totalTexto2.textContent = "Total: $" + total;
}


/** MOSTRAR MENSAJE DE AGREGAR CARRITO */
function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    toast.textContent = mensaje;
    toast.classList.add("show");
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500); // duración 2.5 segundos
}

function agregarAlCarrito(codigo, nombre, precio, idCantidad, imagen) {
    let cantidad = parseInt(document.getElementById(idCantidad).value);
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    let existe = carrito.find(item => item.codigo === codigo);
    if (existe) {
        existe.cantidad += cantidad;
    } else {
        carrito.push({
            codigo: codigo,
            nombre: nombre,
            precio: precio,
            cantidad: cantidad,
            imagen: imagen
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    mostrarToast("Producto agregado al carrito");
}

/** GENERAR PEDIDO */
function generarNumeroPedido() {
    const now = new Date();

    const year = now.getFullYear();                       // 2025
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 11
    const day = String(now.getDate()).padStart(2, '0');         // 14

    // Clave única por día
    const clave = `pedido_${year}_${month}_${day}`;

    // Obtener el último número del día
    let ultimoNumero = localStorage.getItem(clave);

    if (!ultimoNumero) {
        ultimoNumero = 0;
    }

    ultimoNumero = parseInt(ultimoNumero);

    // Incrementar
    const nuevoNumero = ultimoNumero + 1;

    // Guardar
    localStorage.setItem(clave, nuevoNumero);

    // Formatear a 4 dígitos → 0001
    const numeroFormateado = nuevoNumero.toString().padStart(4, "0");

    // Crear formato final
    return `PED-${year}-${month}-${day}-${numeroFormateado}`;
}




function enviarOrdenAlAdmin() {
    const numeroAdmin = "524111346204"; // CAMBIAR

    const numeroPedido = generarNumeroPedido();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const ciudad = document.getElementById("ciudad").value;
    const colonia = document.getElementById("colonia").value;
    const calle = document.getElementById("calle")?.value || "No especificado";
    const telefono = document.getElementById("telefono").value;

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    let textoCarrito = "";
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        textoCarrito += `
━━━━━━━━━━━━━━━━━━━━
📦 *Producto:* ${item.nombre}
🧾 *Código:* ${item.codigo}
💲 *Precio:* $${item.precio}
🔢 *Cantidad:* ${item.cantidad}
💰 *Subtotal:* $${subtotal}
━━━━━━━━━━━━━━━━━━━━
`;
    });

    const mensaje = `
📑 *PEDIDO NUEVO*
🔖 *Número de pedido:* ${numeroPedido}

👤 *Datos del Cliente*
Nombre: ${nombre} ${apellido}
Ciudad: ${ciudad}
Colonia: ${colonia}
Calle: ${calle}
Teléfono: ${telefono}

🛒 *Carrito*
${textoCarrito}

💵 *TOTAL:* $${total}

Gracias por su compra 😊
`;

    const url = `https://wa.me/${numeroAdmin}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}




