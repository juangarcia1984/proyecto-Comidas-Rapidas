//variables globales
let btnproducts = document.querySelectorAll(".btn-product");
let contadorcarrito = document.querySelector(".contar-pro");
let listadocarrito = document.querySelector(".list-cart tbody")
let con = 0;
document.addEventListener("DOMContentLoaded", ()=>{
    cargarprolocalstorage();
})

btnproducts.forEach((btn, i)=>{
    btn.addEventListener("click", ()=>{
        //contador de productos en el carrito
        con++;
        contadorcarrito.textContent = con;
        //agregar producto al carrito
        infoproducto(i);
    });
});
//agregar producto al carrito
function agregarproducto(producto){
    let fila = document.createElement("tr");
    fila.innerHTML = `
    <td>${con}</td>
    <td><img src="${producto.imagen}"width="70px"></td>
    <td>${producto.nombre}</td>
    <td>$${producto.precio}</td>
    <td><span onclick="borrarproducto(${con})" class="btn">❌</span></td>
    `;
    listadocarrito.appendChild(fila);
}

//funcion para agregar la informacion del producto al carrito
function infoproducto(pos) {
    let producto = btnproducts[pos].parentElement.parentElement.parentElement;
    let infopro = {
        nombre: producto.querySelector("h3").textContent ,
        imagen: producto.querySelector("img").src ,
        precio: producto.querySelector("h5").textContent.split("$")[1],
        cantidad: 1
    }
    agregarproducto(infopro);
    guardarprolocalstorage(infopro);
}

//funcio eliminar producto del carrito
function borrarproducto(pos) {
   let producto = event.target;
   producto.parentElement.parentElement.remove();
   //disminuir el contador de productos en el carrito
   if(con > 0){
    con--;
    contadorcarrito.textContent = con;
   }
   eliminarprolocalstorage(pos);      
}

//guardar los productos en localstorage
function guardarprolocalstorage(producto) {
    let todosproductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    todosproductos.push(producto);
    localStorage.setItem("pro-carrito", JSON.stringify(todosproductos));
}

//eliminar producto del localstorage
function eliminarprolocalstorage(pos) {
    let todosproductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    todosproductos.splice((pos-1), 1);
    localStorage.setItem("pro-carrito", JSON.stringify(todosproductos));
}

//cargar productos del localstorage en el carrito
function cargarprolocalstorage() {
    let todosproductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    agregarproducto(producto);
}

contadorcarrito.parentElement.addEventListener("click", ()=>{
    listadocarrito.parentElement.classList.toggle("ocultar")
});