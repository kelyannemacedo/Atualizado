const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const retiradaInput = document.getElementById("retirada");
const entregaInput = document.getElementById("entrega");
const addressWarn = document.getElementById("address-warn");

let cart = []; //lista do carrinho

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

//Fechar o modal cliando fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

//Botão fechar
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

//Menu - adicioando items no carrinho
menu.addEventListener("click", function (event) {
  //console.log(event.target) - descobrir item sendo clicado

  let parentButton = event.target.closest(".add-to-cart-btn");

  //console.log(parentButton); - para descobrir em qual item estou clicando

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    //adicioanr no carrinho
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

//Função para adicionar no carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name); //find é para o Js analisar toda lista

  if (existingItem) {
    //se já existir o item, só aumenta a quant. +1
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

//atualiza carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div"); // criando uma div dentro JS, para aparecer o histórico do pedido
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    document.querySelectorAll('observacao').forEach(item =>(item.textContent))
    document.querySelectorAll('formaEntrega').forEach(item =>(item.textContent))

    

    cartItemElement.innerHTML = `
        
        <hr>
        <div class='flex items-center  justify-between'>
        <div>
        <h3 class='font-bold'> ${item.name} </h3>
        <p> Qtd: ${item.quantity}</p>
        <p class='font-medium  mt-2'> R$ ${item.price.toFixed(2)} por item</p>
        </div>

        <button class='remove-cart' data-name='${item.name}'>
            Remover
        </button> 
        
        </div>
        `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement); //colocando os elementos da div nova dentro do carrinho
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    //formatando o total
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length; //Estilizando footer - botão de ver carrinho
}

// Função remover item  do carrinho

cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-cart")) {
    const name = event.target.getAttribute("data-name");

    romeveItemcart(name);
  }
});

function romeveItemcart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return; //para execução ficar sempre ativa
    }

    cart.splice(index, 1);
    updateCartModal(); //remover quando tiver só 1 item na lista
  }
}

//ENTREGA
entregaInput.addEventListener("id", function (event) {
  let optionId = event.target.value;
});

//ENTREGA
retiradaInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;
});

//FINALIZAR PEDIDO
checkoutBtn.addEventListener("click", function () {
  let nome = document.getElementById("nome").value;
  let contato = document.getElementById("contato").value;
  let endereco = document.getElementById("endereco").value;
  const formaEntrega = document.querySelector(".dropdown").value

  


  /*const isOpen =checkRestaurantOpen();
    if(!isOpen){
        alert('RESTAURANTE FECHADO NO MOMENTO')
    return;
    } */

  if (cart.length === 0) return;

  /* if(addressInput.value === '') {
    addressWarn.classList.remove('hidden')  //Esse código não está funcinando! Remover o hidden e aparecer alerta em vermelho para pessoa digitar o endereço
 }*/

  //Enviar pedido para api do whats]

  let cartItem = cart
    .map((item) => {
      console.log(item);
      return `${item.name} Quantidade (${item.quantity}) Preço: R$${item.price} `;
    })
    .join("");
 

  //const message = encodeURIComponent(cartItem)
  const phone = "9892314854";

  const mensagem = `

Itens:
➡ 1x TRIBO CASADINHA 770ML 
Nome: ${nome} - Contato: ${contato} - Endereço: ${endereco} - Entrega: ${entrega} - Observação: ${observacao}
      ACOMPANHAMENTOS
          1x PAÇOCA
          1x FLOCOS DE ARROZ
          2x LEITE EM PÓ
      ACOMPANHAMENTOS COPO 2
          1x GRANOLA
➡ 1x TRIBO CASADINHA 770ML 
      ACOMPANHAMENTOS
          1x PAÇOCA
          1x LEITE EM PÓ
          1x AMENDOIM FARELADO
          1x UVA
          1x CALDA DE UVA
      ACOMPANHAMENTOS COPO 2
          1x CALDA MORANGO
          1x GRANOLA
          1x LEITE EM PO
          1x AMENDOIM FARELADO
          1x UVA

Observação: (Preciso de itens descartáveis)

:credit_card: Cartão

:motor_scooter: Delivery (taxa de: R$ 0,00)
:house: 
(Estimativa: entre 50~80 minutos)

Total: 

Obrigado pela preferência, se precisar de algo é só chamar!`;

  const encodedMessage = encodeURIComponent(mensagem);

  window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");

  cart = [];
  updateCartModal();
});

//Verificar  a hora e manipular o card horário
function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22;
  //true = restaurant estás aberto
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
