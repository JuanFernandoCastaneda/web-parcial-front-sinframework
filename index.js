
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
    await loadMenu(name);
}

async function searchMenu(name) {
    for(let i = 0; i < data.length; i++) {
        if(data[i].name === name) {
            return data[i];
        }
    }
}

async function agregarCarrito(event) {
    const nombre = event.target.parentNode.children[1].children[0].innerText;
    const promesaTipoComida = await searchMenu(tipoComida.innerText);
    const producto = promesaTipoComida.products.find((element) => {
        return element.name === nombre;
    });
    const productoEnCarro = carrito.find((element) => {
        return element[0] === producto;
    })
    if(productoEnCarro != null) {
        productoEnCarro[1] = productoEnCarro[1] + 1; 
    } 
    else {
        carrito.push([producto, 1]);
    }
    
    numeroItems.innerHTML = carrito.reduce((acumulador, element) => {
        return acumulador + element[1];
    }, 0) + " items";
}

async function loadCarrito(event) {
    tipoComida.innerHTML = "Order detail";
    cartasComida.innerHTML = "";

    const tablaCarrito = document.createElement("table");
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
    const tablaCarritoBody = tablaCarrito.tBodies[0];
    console.log(tablaCarritoBody);

    carrito.forEach((element) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <th>${element[0].name}</th>
            <th>${element[1]}</th>
            <th>${element[0].description}</th>
            <th>${element[0].price}</th>
            <th>${element[0].price*element[1]}</th>
            <th></th>
        `;
        tablaCarritoBody.appendChild(tr);
    })

    cartasComida.appendChild(tablaCarrito);
}
