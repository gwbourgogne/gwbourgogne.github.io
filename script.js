
const grid = document.getElementById('productGrid');
const search = document.getElementById('search');
const category = document.getElementById('category');
const brand = document.getElementById('brand');
const sort = document.getElementById('sort');
let cart = [];

function money(v){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v);}
function unique(key){return [...new Set(PRODUCTS.map(p=>p[key]))].sort();}
unique('category').forEach(v=>category.insertAdjacentHTML('beforeend',`<option>${v}</option>`));
unique('brand').forEach(v=>brand.insertAdjacentHTML('beforeend',`<option>${v}</option>`));

function render(){
  let items = PRODUCTS.filter(p=>{
    const q=search.value.trim().toLowerCase();
    return (!q || (p.name+' '+p.brand+' '+p.category).toLowerCase().includes(q))
      && (category.value==='all'||p.category===category.value)
      && (brand.value==='all'||p.brand===brand.value);
  });
  if(sort.value==='low') items.sort((a,b)=>a.price-b.price);
  if(sort.value==='high') items.sort((a,b)=>b.price-a.price);
  if(sort.value==='az') items.sort((a,b)=>a.name.localeCompare(b.name));
  grid.innerHTML = items.length ? items.map((p)=>`
    <article class="product-card">
      <div class="product-visual">
        ${p.tag?`<span class="tag">${p.tag}</span>`:''}
        <div class="product-icon">${p.icon}</div>
      </div>
      <div class="product-body">
        <span class="brand-label">${p.brand}</span>
        <h3>${p.name}</h3>
        <span class="meta">${p.category} • Reference: ${p.retailer}</span>
        <div class="card-bottom">
          <span class="price">${money(p.price)}</span>
          <button class="add" data-index="${PRODUCTS.indexOf(p)}">Add</button>
        </div>
      </div>
    </article>`).join('') : `<div class="empty">No products match your filters.</div>`;

  document.querySelectorAll('.add').forEach(btn=>btn.addEventListener('click',()=>addToCart(PRODUCTS[btn.dataset.index])));
}
[search,category,brand,sort].forEach(el=>el.addEventListener(el===search?'input':'change',render));

function addToCart(p){cart.push(p); updateCart(); openCart();}
function updateCart(){
  document.getElementById('cartCount').textContent=cart.length;
  document.getElementById('cartItems').innerHTML=cart.length?cart.map((p,i)=>`
    <div class="cart-item"><div><b>${p.name}</b><br><span>${p.brand}</span></div><div><b>${money(p.price)}</b><br><button data-remove="${i}">Remove</button></div></div>`).join(''):'<p>Your cart is empty.</p>';
  document.getElementById('cartTotal').textContent=money(cart.reduce((s,p)=>s+p.price,0));
  document.querySelectorAll('[data-remove]').forEach(btn=>btn.addEventListener('click',()=>removeItem(Number(btn.dataset.remove))));
}
function removeItem(i){cart.splice(i,1);updateCart();}
function openCart(){document.getElementById('cartPanel').classList.add('open');document.getElementById('overlay').classList.add('show');}
function closeCart(){document.getElementById('cartPanel').classList.remove('open');document.getElementById('overlay').classList.remove('show');}
document.getElementById('cartBtn').onclick=openCart;
document.getElementById('closeCart').onclick=closeCart;
document.getElementById('overlay').onclick=closeCart;
render(); updateCart();
