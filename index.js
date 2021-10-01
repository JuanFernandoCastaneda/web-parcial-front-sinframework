
const url = "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";

let data;

let carrito = [];

const nav = document.getElementsByTagName("nav")[0];
const tipoComida = document.getElementById("tipoComida");
const cartasComida = document.getElementById("cartasComida");
const numeroItems = document.getElementById("numeroItems");

let itemsEnCarro = 0;

loadData();

document.getElementById("fotoCarrito").onclick = loadCarrito;

async function loadData() {
    // Cargo datos
    const res = await fetch(url);
    data = await res.json();

    // Lleno la nav de buttons.
    for(let i = 0; i < data.length; i++) {
        const button = document.createElement("BUTTON");
        button.innerHTML = data[i].name;
        button.onclick = loadContent;

        // Si es el primer contenido, se llena el menú de sus elementos.
        if(i === 0) {
            loadMenu(data[i].name);
        }
        nav.appendChild(button);
    }

    // Lleno los primeros elementos del menú.
    
}

async function loadMenu(name) {
    const menu = await searchMenu(name);
    tipoComida.innerHTML = menu.name;
    cartasComida.innerHTML = "";
    
    for(let j = 0; j < menu.products.length; j++) {
        const div = document.createElement("div");
        div.innerHTML = `
        <div id="card${j}" class="card" style="width: 18rem">
            <img class="card-img-top" src="${menu.products[j].image}" alt="Card image cap" />
            <div class="card-body">
                <h5 class="card-title">${menu.products[j].name}</h5>
                <p class="card-text">
                    ${menu.products[j].description}
                    Price: ${menu.products[j].price}
                </p>
            </div>
        </div>`;
        cartasComida.appendChild(div);
        const card = document.getElementById("card"+j);
        const botonCompra = document.createElement("button");
        botonCompra.innerHTML = `Agregar al carrito`;
        botonCompra.onclick = agregarCarrito;
        card.appendChild(botonCompra);
    }
}

async function loadContent(event) {
    const name = event.target.innerHTML;
    console.log(name);
    loadMenu(name);
}

async function searchMenu(name) {
    for(let i = 0; i < data.length; i++) {
        if(data[i].name === name) {
            return data[i];
        }
    }
}

async function searchProductType(name) {
    for(let i = 0; i < data.length; i++) {
        for(let j = 0; j < data[i].products.length; j++) {
            if(data[i].products[j].name === name) {
                return data[i];
            }
        }
    }
    return null;
}

async function modificarElementoCarrito(nombre, agregar) {
    const promesaTipoComida = await searchProductType(nombre);
    const producto = promesaTipoComida.products.find((element) => {
        return element.name === nombre;
    });
    const productoEnCarro = carrito.find((element) => {
        return element[0] === producto;
    })
    if(agregar) {
        if(productoEnCarro != null) {
            productoEnCarro[1] = productoEnCarro[1] + 1; 
        } 
        else {
            carrito.push([producto, 1]);
        }
    } 
    else {
        productoEnCarro[1] = productoEnCarro[1] - 1;
        if(productoEnCarro[1] === 0) {
            carrito = carrito.filter((element) => {
                return productoEnCarro[0] != element[0];
            });
        }
    }
    numeroItems.innerHTML = carrito.reduce((acumulador, element) => {
            return acumulador + element[1];
        }, 0) + " items";
}

async function modificarElementoCarritoTabla(nombre, agregar) {
    await modificarElementoCarrito(nombre, agregar);
    const tablaCarrito = document.getElementById("tablaCarrito");
    pintarCarrito(tablaCarrito);
}

async function agregarCarrito(event) {
    const nombre = event.target.parentNode.children[1].children[0].innerText;
    modificarElementoCarrito(nombre, true);
}

async function loadCarrito(event) {
    console.log(carrito);
    tipoComida.innerHTML = "Order detail";
    cartasComida.innerHTML = `
    <table id="tablaCarrito" class="table table-striped">
    </table>`;
    const tablaCarrito = document.getElementById("tablaCarrito");
    tablaCarrito.tHead = document.createElement("tHead");
    tablaCarrito.tHead.innerHTML = `
    <tr>
        <th>Item</th>
        <th>Qty.</th>
        <th>Description</th>
        <th>Unit Price</th>
        <th>Amount</th>
        <th>Modify</th>
    </tr>`;

    tablaCarrito.appendChild(document.createElement("tBody"));

    await pintarCarrito(tablaCarrito);
}

async function pintarCarrito(tablaCarrito) {
    const tablaCarritoBody = tablaCarrito.tBodies[0];
    tablaCarritoBody.innerHTML = "";
    carrito.forEach((element) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${element[0].name}</td>
            <td>${element[1]}</td>
            <td>${element[0].description}</td>
            <td>${element[0].price}</td>
            <td>${element[0].price*element[1]}</td>
            <td class = "row">
                <button class="col-6 btn btn-dark">+</button>
                <button class="col-6 btn btn-dark">-</button>
            </td>
        `;
        tablaCarritoBody.appendChild(tr);
    });

    const botones = tablaCarrito.getElementsByTagName("button");
    for(let i = 0; i < botones.length; i++) {
        if(i%2 === 0) {
            botones[i].onclick = aumentar;
        }
        else {
            botones[i].onclick = disminuir;
        }
    }
}

async function aumentar(event) {
    modificarElementoCarritoTabla(event.target.parentNode.parentNode.children[0].innerText, true);
}

async function disminuir(event) {
    modificarElementoCarritoTabla(event.target.parentNode.parentNode.children[0].innerText, false);
}
