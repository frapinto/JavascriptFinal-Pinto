const openShopping = document.querySelector('.shopping');
const closeShopping = document.querySelector('.closeShopping');
const list = document.querySelector('.list');
const listCard = document.querySelector('.listCard');
const total = document.querySelector('.total');
const quantity = document.querySelector('.quantity');

// Evento de clic para abrir el carrito
openShopping.addEventListener('click', () => {
  document.body.classList.add('active');
});

// Evento de clic para cerrar el carrito
closeShopping.addEventListener('click', () => {
  document.body.classList.remove('active');
});

// Variables para almacenar los productos seleccionados en el carrito. "cart" comienza de 0 o llama al valor guardado en Cart del localStorage
let products = [];
let cart = JSON.parse(localStorage.getItem('CART')) || {};

// Inicializa la aplicación
const initApp = async () => {
  try {
    const response = await fetch('carrito.json');
    products = await response.json();

    // Recorre los productos en el carrito y genera un div para cada Card
    products.forEach((value, key) => {
      const newDiv = document.createElement('div');
      newDiv.classList.add('item');
      newDiv.innerHTML = `
        <img src="${value.image}">
        <div class="title">${value.item}</div>
        <div class="price">$${value.price.toLocaleString()}</div>
        <button onclick="addToCart(${key})">Añadir al Carrito</button>`;
      list.appendChild(newDiv);
    });

    reloadCart();
  } catch (error) {
    console.log(error);
  }
};

initApp();

// Función para agregar un producto al carrito
const addToCart = (key) => {
  const item = products[key].item;

  if (cart[key]) {
    cart[key].quantity += 1;
  } else {
    cart[key] = { ...products[key], quantity: 1 };
  }

  reloadCart();
  saveCartToLocalStorage();

  Swal.fire({
    position: 'center',
    icon: 'success',
    title: `Se ha añadido ${item} al carrito`,
    showConfirmButton: false,
    timer: 3000,
  });
};

// Función para actualizar el carrito
const reloadCart = () => {
  listCard.innerHTML = '';
  let count = 0;
  let totalPrice = 0;

  for (const key in cart) {
    const value = cart[key];

    totalPrice += value.price * value.quantity;
    count += value.quantity;

    const newDiv = document.createElement('li');
    newDiv.innerHTML = `
      <div><img src="${value.image}"/></div>
      <div>${value.item}</div>
      <div>$${(value.price * value.quantity).toLocaleString()}</div>
      <div>
        <button onclick="changeQuantity(${key}, ${value.quantity - 1})">-</button>
        <div class="count">${value.quantity}</div>
        <button onclick="changeQuantity(${key}, ${value.quantity + 1})">+</button>
      </div>`;
    listCard.appendChild(newDiv);
  }

  total.innerText = totalPrice.toLocaleString(); // Actualiza el total del carrito en el elemento con la clase "total"
  quantity.innerText = count; // Actualiza la cantidad total de productos en el elemento con la clase "quantity"
};

const changeQuantity = (key, quantity) => {
  if (quantity <= 0) {
    delete cart[key]; // Si la cantidad llega a 0, se elimina el producto del carrito
  } else {
    cart[key].quantity = quantity; // Actualiza la cantidad del producto en el carrito
  }

  reloadCart();
  saveCartToLocalStorage();
};

//Guarda los productos y cantidades del Cart al localStorage
const saveCartToLocalStorage = () => {
  localStorage.setItem('CART', JSON.stringify(cart));
};