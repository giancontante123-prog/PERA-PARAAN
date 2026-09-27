const shopDropdown = document.querySelector('.nav-dropdown');
const shopDropdownButton = document.querySelector('.nav-dropbtn');

if (shopDropdown && shopDropdownButton) {
	shopDropdownButton.addEventListener('click', (event) => {
		event.stopPropagation();
		shopDropdown.classList.toggle('is-open');
		const isOpen = shopDropdown.classList.contains('is-open');
		shopDropdownButton.setAttribute('aria-expanded', String(isOpen));
	});

	document.addEventListener('click', (event) => {
		if (!shopDropdown.contains(event.target)) {
			shopDropdown.classList.remove('is-open');
			shopDropdownButton.setAttribute('aria-expanded', 'false');
		}
	});
}
	const collectionButtons = document.querySelectorAll('.shop-subnav-button');
	const productCards = document.querySelectorAll('.product-card');

	function setCollection(selectedCollection) {
		collectionButtons.forEach((button) => {
			const isActive = button.dataset.collection === selectedCollection;
			button.classList.toggle('is-active', isActive);
			button.setAttribute('aria-pressed', String(isActive));
		});

		productCards.forEach((card) => {
			const matches = card.dataset.collection === selectedCollection;
			card.hidden = !matches;
		});

		const params = new URLSearchParams(window.location.search);
		params.set('category', selectedCollection);
		const newUrl = `${window.location.pathname}?${params.toString()}`;
		window.history.replaceState({}, '', newUrl);
	}

	collectionButtons.forEach((button) => {
		button.addEventListener('click', () => {
			setCollection(button.dataset.collection);
		});
	});

	const queryCategory = new URLSearchParams(window.location.search).get('category');
	const hashCategory = window.location.hash.replace('#', '');
	const initialCollection = queryCategory || hashCategory || 'stickers';

	if (collectionButtons.length && productCards.length) {
		setCollection(initialCollection);
	}

	const sliderSlides = document.querySelectorAll('.about-slide');
	if (sliderSlides.length) {
		let sliderIndex = 0;
		setInterval(() => {
			sliderSlides.forEach((slide, index) => {
				slide.classList.toggle('is-active', index === sliderIndex);
			});
			sliderIndex = (sliderIndex + 1) % sliderSlides.length;
		}, 2600);
	}

	const itemDialog = document.querySelector('.item-dialog');
	const dialogImage = document.querySelector('.dialog-image');
	const dialogTitle = document.querySelector('#dialog-title');
	const dialogDiscount = document.querySelector('.dialog-discount');
	const dialogPrice = document.querySelector('.dialog-price');
	const dialogAvailability = document.querySelector('.dialog-availability');
	const addToCartButton = document.querySelector('.add-to-cart');
	const itemQuantity = document.querySelector('.item-quantity');
	const closeDialogButton = document.querySelector('.dialog-close');
	const cartDialog = document.querySelector('.cart-dialog');
	const cartToggle = document.querySelector('.cart-toggle');
	const cartCloseButton = document.querySelector('.cart-close');
	const cartCount = document.querySelector('.cart-count');
	const cartItemsList = document.querySelector('.cart-items');
	const cartEmpty = document.querySelector('.cart-empty');
	const cartTotal = document.querySelector('.cart-total');
	const cartNotice = document.querySelector('.cart-notice');
	const currency = new Intl.NumberFormat('en-PH', {
		style: 'currency',
		currency: 'PHP',
		maximumFractionDigits: 0
	});
	let selectedProduct = null;
	let cart = [];
	const products = new Map();
	let noticeTimeout;

	try {
		cart = JSON.parse(localStorage.getItem('pera-paraan-cart') || '[]');
		if (!Array.isArray(cart)) cart = [];
	} catch {
		cart = [];
	}

	document.querySelectorAll('.product-card').forEach((card) => {
		const name = card.querySelector('h2').textContent.trim();
		products.set(name, {
			name,
			price: Number(card.dataset.price),
			originalPrice: Number(card.dataset.originalPrice || card.dataset.price),
		discount: Number(card.dataset.discount || 0),
			available: card.dataset.available === 'true',
			stock: Number(card.dataset.stock || 0),
			card
		});
	});

	const productContainer = document.querySelector('.product-container');
	if (productContainer) {
		[...productCards]
			.sort((first, second) => Number(second.dataset.bestseller === 'true') - Number(first.dataset.bestseller === 'true'))
			.forEach((card) => productContainer.append(card));
	}

	cart = cart.filter((item) => {
		const product = products.get(item.name);
		return product && product.available && Number.isFinite(item.quantity) && item.quantity > 0;
	}).map((item) => {
		const product = products.get(item.name);
		return { name: product.name, price: product.price, quantity: Math.min(Math.floor(item.quantity), product.stock) };
	}).filter((item) => item.quantity > 0);

	function quantityInCart(productName) {
		return cart.find((item) => item.name === productName)?.quantity || 0;
	}

	function remainingStock(product) {
		return Math.max(0, product.stock - quantityInCart(product.name));
	}

	function showCartNotice(message, isWarning = false) {
		if (!cartNotice) return;
		cartNotice.textContent = message;
		cartNotice.setAttribute('role', isWarning ? 'alert' : 'status');
		cartNotice.classList.toggle('cart-notice-warning', isWarning);
		cartNotice.hidden = false;
		clearTimeout(noticeTimeout);
		noticeTimeout = setTimeout(() => {
			cartNotice.hidden = true;
		}, 2800);
	}

	function renderCart() {
		if (!cartCount || !cartItemsList || !cartEmpty || !cartTotal) return;

		cartItemsList.replaceChildren();
		let itemCount = 0;
		let total = 0;

		cart.forEach((item, index) => {
			itemCount += item.quantity;
			total += item.price * item.quantity;

			const row = document.createElement('li');
			row.className = 'cart-item';
			const details = document.createElement('div');
			const name = document.createElement('strong');
			name.textContent = item.name;
			const price = document.createElement('span');
			price.textContent = `${currency.format(item.price)} each`;
			details.append(name, price);

			const controls = document.createElement('div');
			controls.className = 'cart-item-controls';
			const decrease = document.createElement('button');
			decrease.type = 'button';
			decrease.textContent = '-';
			decrease.setAttribute('aria-label', `Remove one ${item.name}`);
			decrease.addEventListener('click', () => updateQuantity(index, -1));
			const quantity = document.createElement('span');
			quantity.textContent = String(item.quantity);
			const increase = document.createElement('button');
			increase.type = 'button';
			increase.textContent = '+';
			increase.setAttribute('aria-label', `Add one ${item.name}`);
			increase.addEventListener('click', () => updateQuantity(index, 1));
			const remove = document.createElement('button');
			remove.type = 'button';
			remove.textContent = 'Remove';
			remove.addEventListener('click', () => {
				cart.splice(index, 1);
				persistCart();
			});
			controls.append(decrease, quantity, increase, remove);
			row.append(details, controls);
			cartItemsList.append(row);
		});

		cartCount.textContent = String(itemCount);
		cartEmpty.hidden = cart.length > 0;
		cartTotal.textContent = currency.format(total);
		products.forEach((product) => {
			const stockLabel = product.card.querySelector('.stock-status');
			if (stockLabel) {
				const remaining = remainingStock(product);
				stockLabel.textContent = remaining > 0 ? `In stock: ${remaining}` : 'Out of stock';
				stockLabel.classList.toggle('availability-unavailable', remaining === 0);
				stockLabel.classList.toggle('availability-available', remaining > 0);
			}
		});
	}

	function persistCart() {
		localStorage.setItem('pera-paraan-cart', JSON.stringify(cart));
		renderCart();
	}

	function updateQuantity(index, change) {
		if (!cart[index]) return;
		const product = products.get(cart[index].name);
		if (change > 0 && (!product || cart[index].quantity >= product.stock)) {
			showCartNotice(`Only ${product ? product.stock - cart[index].quantity : 0} more ${cart[index].name} sticker(s) are in stock.`, true);
			return;
		}
		cart[index].quantity += change;
		if (cart[index].quantity <= 0) cart.splice(index, 1);
		persistCart();
	}

	function addProductToCart(product, quantity) {
		if (!product || !product.available) return false;
		const remaining = remainingStock(product);
		if (!Number.isInteger(quantity) || quantity < 1 || quantity > remaining) {
			showCartNotice(`Only ${remaining} ${product.name} sticker(s) remain in stock. Please lower the quantity.`, true);
			return false;
		}
		const existing = cart.find((item) => item.name === product.name);
		if (existing) {
			existing.quantity += quantity;
		} else {
			cart.push({ name: product.name, price: product.price, quantity });
		}
		persistCart();
		showCartNotice(`${quantity} × ${product.name} added to your cart.`);
		return true;
	}

	if (itemDialog && dialogImage && dialogTitle && closeDialogButton) {
			document.querySelectorAll('.product-card').forEach((card) => {
			const productName = card.querySelector('h2').textContent.trim();
			const product = products.get(productName);
			const productPrice = product.price;
			const productAvailable = product.available;
			if (product.discount > 0) {
				const discountLabel = document.createElement('p');
				discountLabel.className = 'discount-label';
				discountLabel.textContent = `${product.discount}% OFF`;
				const originalPriceLabel = document.createElement('p');
				originalPriceLabel.className = 'product-original-price';
				originalPriceLabel.textContent = currency.format(product.originalPrice);
				card.querySelector('.product-info').insertBefore(discountLabel, card.querySelector('.product-button'));
				card.querySelector('.product-info').insertBefore(originalPriceLabel, card.querySelector('.product-button'));
			}
			const priceLabel = document.createElement('p');
			priceLabel.className = 'product-price';
			priceLabel.textContent = currency.format(productPrice);
			const availabilityLabel = document.createElement('p');
			availabilityLabel.className = productAvailable ? 'availability-available' : 'availability-unavailable';
			availabilityLabel.classList.add('stock-status');
			availabilityLabel.textContent = productAvailable ? `In stock: ${product.stock}` : 'Not available';
			card.querySelector('.product-info').insertBefore(priceLabel, card.querySelector('.product-button'));
			card.querySelector('.product-info').insertBefore(availabilityLabel, card.querySelector('.product-button'));

			card.querySelector('.product-button').addEventListener('click', () => {
				const image = card.querySelector('img');
				selectedProduct = product;
				dialogImage.src = image.src;
				dialogImage.alt = image.alt;
				dialogTitle.textContent = productName;
				if (dialogDiscount) {
					dialogDiscount.hidden = product.discount <= 0;
					dialogDiscount.textContent = product.discount > 0 ? `${product.discount}% OFF` : '';
				}
				if (dialogPrice) {
					dialogPrice.replaceChildren();
					if (product.discount > 0) {
						const original = document.createElement('del');
						original.className = 'dialog-original-price';
						original.textContent = currency.format(product.originalPrice);
						dialogPrice.append(original, document.createTextNode(' '));
					}
					dialogPrice.append(document.createTextNode(currency.format(productPrice)));
				}
				if (dialogAvailability) {
					const remaining = remainingStock(product);
					dialogAvailability.textContent = productAvailable && remaining > 0 ? `In stock: ${remaining}` : 'Not available';
					dialogAvailability.className = productAvailable && remaining > 0 ? 'dialog-availability availability-available' : 'dialog-availability availability-unavailable';
				}
				if (itemQuantity) {
					itemQuantity.value = '1';
					itemQuantity.max = String(Math.max(1, remainingStock(product)));
					itemQuantity.disabled = !productAvailable || remainingStock(product) < 1;
				}
				if (addToCartButton) {
					const inStock = productAvailable && remainingStock(product) > 0;
					addToCartButton.disabled = !inStock;
					addToCartButton.textContent = inStock ? 'ADD TO CART' : 'NOT AVAILABLE';
				}
				itemDialog.showModal();
			});
		});

		closeDialogButton.addEventListener('click', () => itemDialog.close());
		itemDialog.addEventListener('click', (event) => {
			if (event.target === itemDialog) {
				itemDialog.close();
			}
		});
	}

	if (addToCartButton) {
		addToCartButton.addEventListener('click', () => {
			const quantity = Math.floor(Number(itemQuantity?.value || 1));
			if (addProductToCart(selectedProduct, quantity)) itemDialog.close();
		});
	}

	if (itemQuantity) {
		itemQuantity.addEventListener('change', () => {
			if (!selectedProduct) return;
			const max = remainingStock(selectedProduct);
			const value = Math.floor(Number(itemQuantity.value));
			if (value > max) {
				showCartNotice(`Only ${max} ${selectedProduct.name} sticker(s) remain in stock. Quantity was set to the available amount.`, true);
				itemQuantity.value = String(Math.max(1, max));
				return;
			}
			itemQuantity.value = String(Math.max(1, Number.isFinite(value) ? value : 1));
		});
	}

	if (cartToggle && cartDialog && cartCloseButton) {
		cartToggle.addEventListener('click', () => cartDialog.showModal());
		cartCloseButton.addEventListener('click', () => cartDialog.close());
		cartDialog.addEventListener('click', (event) => {
			if (event.target === cartDialog) cartDialog.close();
		});
	}

	renderCart();
