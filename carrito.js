const addToShoppingCartButtons = document.querySelectorAll('.addToCart');//capturado boton añadir al carrito
addToShoppingCartButtons.forEach((addToCardButton) =>{ //el forEach aplica una funcion (callback) por cada uno de los elementos del arreglo
    addToCardButton.addEventListener('click', addToCarClicked)
})

//FUNCIONALIDAD BOTON COMPRAR
const comprarButton = document.querySelector('.comprarButton')
comprarButton.addEventListener('click', comprarButtonClicked)
//comprarButton.addEventListener('click', () => console.log()) ASI SE PRUEBAN LOS EVENTOS

const shoppingCartItemsContainer = document.querySelector('.shoppingCartItemsContainer')//contenedor del carrito en html

//CAPTURAMOS EL CARD DEL POKEMON ENTERO Y LO SEPARAMOS POR TITULO IMAGEN Y PRECIO
function addToCarClicked(event) {/*siempre que haya un addeventlistener la funcion callback envia un event*/
    const button = event.target; //sabe especificamente cual fue el boton clickeado por el target
    const item = button.closest('.item');//esto captura todo el elemento mas cercano (item) del target "button" 
    
    const itemTitle = item.querySelector('.item-title').textContent;
    const itemPrice = item.querySelector('.item-price').textContent;
    const itemImage = item.querySelector('.item-image').src;

    addItemToShoppingCart(itemTitle, itemPrice, itemImage)
}

function addItemToShoppingCart(itemTitle, itemPrice, itemImage){
    const elementsTitle = shoppingCartItemsContainer.getElementsByClassName('shoppingCartItemTitle')
    //ANTES DE QUE SE AÑADA CUALQUIER ELEMENTO ESTO VERIFICA SI YA EXISTE EN EL ARREGLO
    for(let i = 0; i < elementsTitle.length; i++){
        if (elementsTitle[i].innerText === itemTitle){
            let elementQuantity = elementsTitle[i].parentElement.parentElement.parentElement.querySelector(//esto de parent sube al componente padre mas cercano
                '.shoppingCartItemQuantity'
            )
            elementQuantity.value++
            $('.toast').toast('show') //elemento de bootstrap cuando pones un elemento repetido tira un mensaje ¡da un error en la consola
            updateShoppingCartTotal()
            return //si encuentra duplicado, despues de sumarse la cantidad TERMINA LA FUNCION
        }   
    }
    const shoppingCartRow = document.createElement('div');
//para no complicarse diseño la tarjeta en el html principal y luego lo pego aca y simplemente reemplazo los valores
    const shoppingCartContent = ` 
                <div class="row shoppingCartItem">
                    <div class="col-6">
                        <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                            <img src=${itemImage} class="shopping-cart-image">
                            <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${itemTitle}</h6>
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                            <p class="item-price mb-0 shoppingCartItemPrice">${itemPrice}</p>
                        </div>
                    </div>
                    <div class="col-4">
                        <div
                            class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                            <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                                value="1">
                            <button class="btn btn-danger buttonDelete" type="button">X</button>
                        </div>
                    </div>
                </div>`;
    
    shoppingCartRow.innerHTML = shoppingCartContent
    shoppingCartItemsContainer.append(shoppingCartRow)

    //TRAEMOS EL BOTON BORRAR
    shoppingCartRow.querySelector('.buttonDelete').addEventListener('click', removeShoppingCartItem)

    //BOTON CANTIDAD
    shoppingCartRow.querySelector('.shoppingCartItemQuantity').addEventListener('change', quantityChanged)

    updateShoppingCartTotal()
}

function updateShoppingCartTotal() {
    let total = 0
    const shoppingCartTotal = document.querySelector('.shoppingCartTotal')//es el total dinamico del html

    const shoppingCartItems = document.querySelectorAll('.shoppingCartItem')//toma todos los elementos en el carrito
    
    shoppingCartItems.forEach((shoppingCartItem) => {
        //PRECIO
        const shoppingCartItemPriceElement = shoppingCartItem.querySelector('.shoppingCartItemPrice')
        const shoppingCartItemPrice = Number( //todo lo contenido se pasa a numero
            shoppingCartItemPriceElement.textContent.replace('€', '')//valor a reemplazar y el reemplazo
            ) 

        //CANTIDAD
        const shoppingCartItemQuantityElement = shoppingCartItem.querySelector('.shoppingCartItemQuantity') 
        const shoppingCartItemQuantity = Number(
            shoppingCartItemQuantityElement.value
        )

        total+= shoppingCartItemPrice * shoppingCartItemQuantity
    })
shoppingCartTotal.innerHTML = `${total.toFixed(2)}€`//solo dos dijitos despues de la coma
}

//BOTON BORRAR
function removeShoppingCartItem(event) {
    const buttonClicked= event.target //que boton tocaste
    buttonClicked.closest('.shoppingCartItem').remove()//y remueve todo el componente

    updateShoppingCartTotal()
}

//BOTON CANTIDAD
function quantityChanged(event){
    const input = event.target
    if (input.value <= 0){
        input.value = 1
    }
 //lo mismo   input.value <= 0 ? (input.value = 1) : null
    updateShoppingCartTotal()
}

function comprarButtonClicked() {
    shoppingCartItemsContainer.innerHTML = ""
    updateShoppingCartTotal()
}

