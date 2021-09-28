
const url = "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";

let data;

const nav = document.getElementsByTagName("nav")[0];
const tipoComida = document.getElementById("tipoComida");
const cartasComida = document.getElementById("cartasComida");
const numeroItems = document.getElementById("numeroItems");

loadData();

async function loadData() {
    // Cargo datos
    const res = await fetch(url);
    data = await res.json();
    console.log(data);

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
        const comida = document.createElement("div");
        comida.innerHTML = `
        <div class="card" style="width: 18rem">
            <img class="card-img-top" src="${menu.products[j].image}" alt="Card image cap" />
            <div class="card-body">
                <h5 class="card-title">${menu.products[j].name}</h5>
                <p class="card-text">
                    ${menu.products[j].description}
                    Price: ${menu.products[j].price}
                </p>
            </div>
        </div>`;
        const botonCompra = document.createElement("button");
        botonCompra.innerHTML = `Agregar al carrito ${menu.products[j].name}`
        botonCompra.onclick = agregarCarrito;
        cartasComida.appendChild(comida);
        cartasComida.appendChild(botonCompra);
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
    cuenta = parseInt(numeroItems.innerHTML) + 1;
    numeroItems.innerHTML = cuenta + " items";
}

