const latagStickers = [
    { name: 'College Of Public Administration', identity: 'College of Public Administration', image: 'images/pubad 11.jpg', description: 'Public Administration sticker design.', price: 50 },
    { name: 'College Of Information Technology', identity: 'College of Information Technology', image: 'images/IT 4.jpg', description: 'Information Technology sticker design.', price: 50 },
    { name: 'College Of Science', identity: 'College Of Science', image: 'images/1.jpg', description: 'College of Science sticker design.', price: 50 },
    { name: 'College Of Arts', identity: 'College Of Arts', image: 'images/arts 5.jpg', description: 'College of Arts sticker design.', price: 37.5 },
    { name: 'College Of Business Administration', identity: 'College Of Business Administration', image: 'images/BA 3.jpg', description: 'College of Business Administration sticker design.', price: 50 },
    { name: 'College Of Education', identity: 'College Of Education', image: 'images/educ 9.jpg', description: 'College of Education sticker design.', price: 50 },
    { name: 'College Of Engineering', identity: 'College Of Engineering', image: 'images/engr 10.jpg', description: 'College of Engineering sticker design.', price: 37.5 },
    { name: 'College Of Communication', identity: 'College Of Communication', image: 'images/item2.jpg', description: 'College of Communication sticker design.', price: 37.5 },
    { name: 'College Of Social Science', identity: 'College Of Social Science', image: 'images/social science 7.jpg', description: 'College of Social Science sticker design.', price: 50 },
    { name: 'College Of Tourism', identity: 'College Of Tourism', image: 'images/tourism 8 - Copy.jpg', description: 'College of Tourism sticker design.', price: 50 }
];

const latagPhoto = document.querySelector('.latag-photo');
const latagHotspots = document.querySelectorAll('.latag-hotspot');
const latagDialog = document.querySelector('.latag-product-dialog');
const latagProductImage = document.querySelector('.latag-product-image');
const latagProductTitle = document.querySelector('#latag-product-title');
const latagPackNumber = document.querySelector('.latag-pack-number');
const latagProductDescription = document.querySelector('.latag-product-description');
const latagProductPrice = document.querySelector('.latag-product-price');
const latagCartDialog = document.querySelector('.cart-dialog');
const latagCartToggle = document.querySelector('.cart-toggle');
const latagCartClose = document.querySelector('.cart-close');
const latagCartList = document.querySelector('.cart-items');
const latagCartEmpty = document.querySelector('.cart-empty');
const latagCartTotal = document.querySelector('.cart-total');
const latagCartCount = document.querySelector('.cart-count');
const latagMoney = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2
});
let latagCart = [];

try {
    const storedCart = JSON.parse(localStorage.getItem('pera-paraan-cart') || '[]');
    if (Array.isArray(storedCart)) latagCart = storedCart;
} catch {
    latagCart = [];
}

function latagRenderCart() {
    latagCartList.replaceChildren();
    let itemCount = 0;
    let total = 0;

    latagCart.forEach((item, index) => {
        const row = document.createElement('li');
        row.className = 'cart-item';
        const details = document.createElement('div');
        const name = document.createElement('strong');
        name.textContent = item.name;
        const price = document.createElement('span');
        price.textContent = `${latagMoney.format(item.price)} each`;
        const subtotal = document.createElement('strong');
        subtotal.className = 'cart-item-subtotal';
        subtotal.textContent = `Subtotal: ${latagMoney.format(item.price * item.quantity)}`;
        details.append(name, price, subtotal);

        const controls = document.createElement('div');
        controls.className = 'cart-item-controls';
        const decrease = document.createElement('button');
        decrease.type = 'button';
        decrease.textContent = '-';
        decrease.setAttribute('aria-label', `Remove one ${item.name}`);
        decrease.addEventListener('click', () => latagChangeQuantity(index, -1));
        const quantity = document.createElement('span');
        quantity.textContent = String(item.quantity);
        const increase = document.createElement('button');
        increase.type = 'button';
        increase.textContent = '+';
        increase.setAttribute('aria-label', `Add one ${item.name}`);
        increase.disabled = item.quantity >= 20;
        increase.addEventListener('click', () => latagChangeQuantity(index, 1));
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.textContent = 'Remove';
        remove.addEventListener('click', () => {
            latagCart.splice(index, 1);
            latagSaveCart();
        });
        controls.append(decrease, quantity, increase, remove);
        row.append(details, controls);
        latagCartList.append(row);
        itemCount += item.quantity;
        total += item.price * item.quantity;
    });

    latagCartEmpty.hidden = latagCart.length > 0;
    latagCartCount.textContent = String(itemCount);
    latagCartTotal.textContent = latagMoney.format(total);
}

function latagSaveCart() {
    localStorage.setItem('pera-paraan-cart', JSON.stringify(latagCart));
    latagRenderCart();
}

function latagChangeQuantity(index, change) {
    const item = latagCart[index];
    if (!item) return;
    const nextQuantity = item.quantity + change;
    if (nextQuantity <= 0) latagCart.splice(index, 1);
    else if (nextQuantity <= 20) item.quantity = nextQuantity;
    latagSaveCart();
}

function latagOpenSticker(packNumber) {
    const sticker = latagStickers[packNumber - 1];
    if (!sticker) return;
    latagPackNumber.textContent = String(packNumber);
    latagProductTitle.textContent = sticker.identity;
    latagProductDescription.textContent = sticker.description;
    latagProductPrice.textContent = latagMoney.format(sticker.price);
    latagProductImage.src = sticker.image;
    latagProductImage.alt = `${sticker.identity} standalone sticker design`;
    latagProductImage.classList.remove('latag-image-missing');
    latagDialog.showModal();
}

function latagAddStickerToCart() {
    const sticker = latagStickers[Number(latagPackNumber.textContent) - 1];
    if (!sticker) return;
    const existing = latagCart.find((item) => item.name === sticker.name);
    if (existing) {
        if (existing.quantity >= 20) return;
        existing.quantity += 1;
    } else {
        latagCart.push({ name: sticker.name, price: sticker.price, quantity: 1 });
    }
    latagSaveCart();
    latagDialog.close();
}

latagHotspots.forEach((hotspot) => {
    hotspot.addEventListener('click', () => latagOpenSticker(Number(hotspot.dataset.pack)));
});

document.querySelector('.latag-dialog-close').addEventListener('click', () => latagDialog.close());
latagDialog.addEventListener('click', (event) => {
    if (event.target === latagDialog) latagDialog.close();
});
document.querySelector('.latag-add-to-cart').addEventListener('click', latagAddStickerToCart);
latagCartToggle.addEventListener('click', () => latagCartDialog.showModal());
latagCartClose.addEventListener('click', () => latagCartDialog.close());
latagCartDialog.addEventListener('click', (event) => {
    if (event.target === latagCartDialog) latagCartDialog.close();
});
latagPhoto.addEventListener('error', () => {
    latagPhoto.alt = 'Original LATAG table photo could not be loaded. Check LATAG table orig.jpg.';
});
latagProductImage.addEventListener('error', () => {
    latagProductImage.alt = 'Standalone artwork is unavailable for this sticker.';
    latagProductImage.classList.add('latag-image-missing');
});

latagRenderCart();
