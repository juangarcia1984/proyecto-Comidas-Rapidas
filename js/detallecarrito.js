//variables globales
let tablacarrito = document.querySelector(".cart-table tbody");
let resumensubtotal = document.querySelector(".sub-total");
let resumendescuento = document.querySelector(".promo");
let resumentotal = document.querySelector(".total");
let destino = document.querySelector(".destino");
let resumendomicilio = document.querySelector(".valor-domi");
let btnresumen = document.querySelector(".btn-resumen");

//agregar evento al nabegador
document.addEventListener("DOMContentLoaded", ()=>{
    cargarproductos();
});

//funcion cargar productos guardados en localstorage
function cargarproductos() {
    let todosproductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
   
    //limpiar la tabla
    tablacarrito.innerHTML = "";

    //cargar tabla 
    if(todosproductos.length != 0) {
        todosproductos.forEach((producto, i)=>{    
        let fila = document.createElement("tr");
        fila.innerHTML = `
        <td class="d-flex justify-content-center align-items-center">
        <span onclick="borrarproducto(${i})" class="btn">❌</span>
        <img src="${producto.imagen}"width="70px">
        ${producto.nombre}
        </td>
        <td>
        $<span>${producto.precio}</span>
        </td>
        <td>
        <div class="quantity quantity-wrap">
            <div class="decrement" onclick="actualizarcantidad(${i}, -1)"> <i class="fa-solid fa-minus"></i></div>
            <input class="number" type="text" name="quantity" value="${producto.cantidad || 1}" maxlength="2" size="1" readonly>
            <div class="increment" onclick="actualizarcantidad(${i}, 1)"> <i class="fa-solid fa-plus"></i></div>
        </div>
        </td>
        <td>$${(producto.precio * producto.cantidad).toFixed(3)}</td>
        `;
        tablacarrito.appendChild(fila);
        }); 
    }else{
        let fila = document.createElement("tr");
        fila.innerHTML = `
        <td colspan="4">
           <p class= "text-center fs-3">NO HAY PRODUCTOS EN EL CARRITO</p>
        </td>   
        `;
        tablacarrito.appendChild(fila);
    }
    //ejecutar el resumen de compra
    resumencompra();       
}

//funcion para actualizar cantidades del producto
function actualizarcantidad(pos, cambio) {
    let todosproductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    if(todosproductos[pos]){
        //actualizar cantidad
        todosproductos[pos].cantidad = (todosproductos[pos].cantidad || 1) + cambio;
        //asegurarse de que la cantidad no sea menor a 1
        if(todosproductos[pos].cantidad < 1){
            todosproductos[pos].cantidad = 1;
        }

        //calcular subtotal
        let subtotal = todosproductos[pos].precio * todosproductos[pos].cantidad;

    }
    //actualizar el localstorage
    localStorage.setItem("pro-carrito", JSON.stringify(todosproductos));
    //recargar la tabla
    cargarproductos();
}

//funcion para borrar productos del carrito en el detalle cart
function borrarproducto(pos) {
    let todosproductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    todosproductos.splice(pos, 1);
    localStorage.setItem("pro-carrito", JSON.stringify(todosproductos));

    //recargar la tabla
    cargarproductos();

}

//funcion para el resumen de la compra
function resumencompra(){
    let todosproductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    let subtotal = 0;//acumular el subtotal de los productos
    //recorre cada producto y acumulamos en el subtotal
    todosproductos.forEach((producto)=>{
        subtotal += producto.precio * producto.cantidad;
    });

    //calcular el valor del domicilio
    let domicilio = 0;
    switch (destino.value) {
        case "Medellin": default: domicilio; break;
        case "Bello": domicilio = 10.000; break; 
        case "Copacabana": case "Caldas": case "La Estrella": domicilio = 20.000; break;
        case "Envigado": case "Itagui": case "Sabaneta": domicilio = 15.000; break;
    }

    //calcular descuento del 10% si compra es mayor a 100000
    let descuento = (subtotal >= 100.000) ? subtotal * 0.1 : 0

    //calcular el total de la compra
    let totalpagar = subtotal - descuento + domicilio;

    //mostrar los calculos de resumen de compra
    resumensubtotal.textContent = subtotal.toFixed(3);
    resumendescuento.textContent = descuento.toFixed(3);
    resumentotal.textContent = totalpagar.toFixed(3);
    resumendomicilio.textContent = domicilio.toFixed(3);
}

//agregar evento al destino para calcular el valor del domicilio
destino.addEventListener("change", ()=>{
    //actualizar el resumen de la compra
    resumencompra();
});

//evento al boton pagar para guardar el resumen en el localstorage
btnresumen.addEventListener("click", ()=>{
   // extraer los productos del localstorage
   let productos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
   let resumen = {
    "productos" : productos,
   }
   //llenar la variable resumen con el resumen de la compra
   resumen.subtotal = resumensubtotal.textContent;
   resumen.descuento = resumendescuento.textContent;
   resumen.destino = destino.value;
   resumen.domicilio = resumendomicilio.textContent;
   resumen.totalpagar = resumentotal.textContent;

   //guardar el resumen de la compra en el localstorage
   localStorage.setItem("pro-resumen", JSON.stringify(resumen));

   //redirigir al usuario a la pagina de pago
   location.href = "checkout.html";
})