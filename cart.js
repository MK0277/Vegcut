/* ============================================================
   Harvest & Co. — Shared Cart Module
   Persists cart items in localStorage so the cart survives
   navigation between index.html and cart.html.
   ============================================================ */
const HarvestCart = (function(){
  const KEY = 'harvestCart';

  function getCart(){
    try{
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){
      return [];
    }
  }

  function saveCart(cart){
    localStorage.setItem(KEY, JSON.stringify(cart));
    // notify other listeners on the same page (cart.html) that data changed
    window.dispatchEvent(new CustomEvent('harvestcart:change', {detail: cart}));
  }

  function addItem(item){
    const cart = getCart();
    const existing = cart.find(i => i.name === item.name);
    if(existing){
      existing.qty += 1;
    }else{
      cart.push({name:item.name, price:item.price, img:item.img, qty:1});
    }
    saveCart(cart);
    return cart;
  }

  function updateQty(name, qty){
    let cart = getCart();
    cart = cart.map(i => i.name === name ? {...i, qty: qty} : i);
    cart = cart.filter(i => i.qty > 0);
    saveCart(cart);
    return cart;
  }

  function removeItem(name){
    const cart = getCart().filter(i => i.name !== name);
    saveCart(cart);
    return cart;
  }

  function clearCart(){
    saveCart([]);
  }

  function totals(){
    const cart = getCart();
    const itemCount = cart.reduce((s,i)=>s+i.qty,0);
    const subtotal = cart.reduce((s,i)=>s+(i.price*i.qty),0);
    return {itemCount, subtotal};
  }

  return {getCart, saveCart, addItem, updateQty, removeItem, clearCart, totals};
})();
