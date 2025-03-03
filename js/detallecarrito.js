//variables globales
let tablacarrito = document.querySelector(".cart-table tbody");

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
            <input class="text" type="number" name="quantity" value="${producto.cantidad || 1}" maxlength="2" size="1" readonly>
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