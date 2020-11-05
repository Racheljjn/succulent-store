
const cartBtn = document.querySelector(".cart-btn");
const bannerBtn = document.querySelector(".banner-btn");
const products = document.querySelector('#our-products')
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
let cart = [];




class Products{

 async getProducts(){

  try{
   let result = await fetch("products.json");
   let data = await result.json();

   let products = data.items
   products = products.map((item)=>{
    const { title, price } = item.fields;
    const { id } = item.sys;
    const image = item.fields.image.fields.file.url;
    return {title, price, id, image}

   })
   return products

  }catch(error){
   console.log('errors');

  }
  
 }

}

class UI{
 scrollToProduct(){
  bannerBtn.addEventListener('click', ()=>{
   products.scrollIntoView()
  })
 }
 displayProducts(products){
  console.log(products);
  let result = ""
  products.forEach(product => {
   result+=`<article class="product">
    <div class="img-container">
     <img src=${product.image} alt="aloe collection" class="product-img">

      <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              add to bag
      </button>
    </div>
    <h3>${product.title}</h3>
    <h4>$${product.price}</h4>
   </article>`
   
  });
  productsDOM.innerHTML=result
 }

 getBagBtns(){
  const buttons = document.querySelectorAll('.bag-btn')
  buttons.forEach(button =>{
   let id = button.dataset.id
   let inCart = cart.find(item => item.id === id)
   if(inCart){
    button.innerText = 'In Cart'
    button.disabled = true
   }

   button.addEventListener('click', (e)=>{
    e.target.innerText = 'In Cart'
    e.target.disabled = true
    let cartItem = {...Storage.getProducts(id), amount: 1}
    cart = [...cart, cartItem]
    
    // console.log(cartItem);
    Storage.saveCart(cart)

    // set cart value
    this.setCartValue(cart)
    this.addToCart(cartItem)
    this.showCart()
   

   })
  })

 }
 addToCart(item){
   const div = document.createElement('div')
   div.classList.add('cart-item')
   div.innerHTML = `
   <img src=${item.image} alt="product" />
            <div>
              <h4>${item.title}</h4>
              <h5>${item.price}</h5>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id=${item.id}></i>
              <p class="item-amount">
                ${item.amount}
              </p>
              <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
          </div> -->

   `
   cartContent.appendChild(div)
   
  }



  showCart(){
   cartOverlay.classList.add('transparentBcg')
   cartDOM.classList.add('showCart')
  }

  hideCart(){
   cartOverlay.classList.remove('transparentBcg')
   cartDOM.classList.remove('showCart')

  }

  cartLogic(){
   clearCartBtn.addEventListener('click', ()=>{
    this.clearCart()
   })
   // cart functionality: event bubbling

   cartContent.addEventListener('click', e=>{
    if(e.target.classList.contains('remove-item')){
     let removeItem = e.target
     let id = removeItem.dataset.id
     cartContent.removeChild(removeItem.parentElement.parentElement)
     this.removeItem(id)
    }else if(e.target.classList.contains('fa-chevron-up')){
     let addItem = e.target
     let id = addItem.dataset.id
     let tempItem = cart.find(item => item.id === id)
     tempItem.amount += 1
     Storage.saveCart(cart)
     this.setCartValue(cart)
     addItem.nextElementSibling.innerText = tempItem.amount


    }else if(e.target.classList.contains('fa-chevron-down')){
     let lowerItem = e.target
     let id = lowerItem.dataset.id
     let tempItem = cart.find(item => item.id === id)
     tempItem.amount -= 1
     if(tempItem.amount > 0){
      Storage.saveCart(cart)
     this.setCartValue(cart)
     lowerItem.previousElementSibling.innerText = tempItem.amount

     }else{
      this.removeItem(id)
      cartContent.removeChild(lowerItem.parentElement.parentElement)
      
     }
    }
   })




  }



  clearCart(){
   let cartItems = cart.map(item => item.id)
   cartItems.forEach(id => this.removeItem(id))
    while(cartContent.children.length > 0){
    cartContent.removeChild(cartContent.children[0])

   }
   this.hideCart()
  }



  removeItem(id){
   cart = cart.filter(item => item.id !== id)
   this.setCartValue(cart)
   Storage.saveCart(cart)
   let button = this.getSingleButton(id)
    button.innerHTML=`<i class="fas fa-shopping-cart"></i>add to bag`
    button.disabled=false
  }

  getSingleButton(id){
   const buttons = document.querySelectorAll('.bag-btn')
   return [...buttons].find(button => button.dataset.id === id)
  }

  // clearCart(){
  //  // cart = []
   
   
  //  // buttons.forEach(button=>{
  //  //  button.innerHTML=`<i class="fas fa-shopping-cart"></i>add to bag`
  //  //  button.disabled=false
  //  // })

   

  // }

  setupApp(){
   cart = Storage.getCart()
   this.setCartValue(cart)
   this.populateCart(cart)
   cartBtn.addEventListener('click', this.showCart)
   closeCartBtn.addEventListener('click', this.hideCart)
   


  }

  populateCart(cart){
   cart.forEach(item =>{this.addToCart(item)})

  }

 setCartValue(cart){
  let itemTotal = 0
  let valueTotal = 0
  cart.map(item =>{
   valueTotal+=item.price * item.amount
   itemTotal += item.amount
  })
  cartItems.innerText= itemTotal
  cartTotal.innerText=parseFloat(valueTotal.toFixed(2)) 
 }



 




}

class Storage{

 static saveProducts(products){
  // push all items into local storage
  localStorage.setItem('products', JSON.stringify(products))

 }
 static getProducts(id){
  let products = JSON.parse(localStorage.getItem('products'))
  return products.find(item => item.id === id)
 }
 static saveCart(cart){
  localStorage.setItem('cart', JSON.stringify(cart))
 }

 static getCart(){
  return localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')):[]
 }



}


document.addEventListener('DOMContentLoaded', ()=>{
 const products = new Products()
 const ui = new UI()
 ui.setupApp()
 ui.scrollToProduct()
 

 products.getProducts()
 .then(products =>
  {ui.displayProducts(products)
   Storage.saveProducts(products)
  })
 .then(()=>{
  ui.getBagBtns()
  ui.cartLogic()
 })
 
})