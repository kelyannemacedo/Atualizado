const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

// Fechar o modal clicando fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Botão fechar
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

// Menu - adicionando itens no carrinho
menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

// Adicionando itens dos selects ao carrinho
document.getElementById("btnlistproduct").addEventListener("click", () => {
  const selects = document.querySelectorAll(".list-products");

  const newProduct = {
    name: "",
    price: 0,
  };

  selects.forEach((select) => {
    const selectedOption = select.options[select.selectedIndex];
    const name = selectedOption.getAttribute("data-name");
    if (newProduct.name === "") {
      newProduct.name = name;
    } else {
      newProduct.name += ` + ${name}`;
    }
    const price = parseFloat(selectedOption.getAttribute("data-price"));
    newProduct.price += price;
  });

  addToCart(newProduct.name, newProduct.price);
});

// Função para adicionar no carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

// Atualiza o carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

    cartItemElement.innerHTML = `
      <hr>
      <div class='flex items-center justify-between'>
        <div>
          <h3 class='font-bold'>${item.name}</h3>
          <p>Qtd: ${item.quantity}</p>
          <p class='font-medium mt-2'>R$ ${item.price.toFixed(2)} por item</p>
        </div>
        <button class='remove-cart' data-name='${item.name}'>
          Remover
        </button>
      </div>
    `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
}

// Função remover item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-cart")) {
    const name = event.target.getAttribute("data-name");
    removeItemFromCart(name);
  }
});

function removeItemFromCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}




// Finalizar pedido
checkoutBtn.addEventListener("click", function () {
  let nome = document.getElementById("nome").value.trim();
  let contato = document.getElementById("contato").value.trim();
  let endereco = document.getElementById("endereco").value.trim();
  let formaentrega = document.getElementById("formaentrega").value
  const observacao = document.getElementById("observacao").value.trim();
  const bairro = document.getElementById("bairro").value.trim(); // Corrigido para usar getElementById
  const formapg = document.getElementById("formapg").value.trim(); // Corrigido para usar getElementById
  

  if (cart.length === 0) return;



  let cartItem = cart
    .map((item) => `➡ ${item.quantity}x ${item.name} Preço: R$${item.price.toFixed(2)}`)
    .join("\n");

  const phone = "9892314854";

  const mensagem = `
Itens:
${cartItem}

Nome: ${nome}
Contato: ${contato}
Endereço: ${endereco}
Entrega: ${formaentrega}
Bairro: ${bairro}
Forma de pagamento: ${formapg}
Observação: ${observacao}

Total: R$${parseFloat(cartTotal.textContent.replace('R$', '').replace(',', '.')).toFixed(2)}

Obrigado pela preferência, se precisar de algo é só chamar!
  `;

  const encodedMessage = encodeURIComponent(mensagem);

  window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");

  cart = [];
  updateCartModal();
});

// Verificar a hora e manipular o card horário
function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}
