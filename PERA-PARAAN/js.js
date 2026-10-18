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
	const productSearch = document.querySelector('#product-search');
	const searchEmpty = document.querySelector('.search-empty');
	const searchResults = document.querySelector('#shop-results');
	let activeCollection = 'stickers';

	function renderProducts() {
		const query = productSearch?.value.trim().toLocaleLowerCase() || '';
		let visibleCount = 0;

		productCards.forEach((card) => {
			const name = card.querySelector('h2').textContent.trim().toLocaleLowerCase();
			const matches = card.dataset.collection === activeCollection && name.includes(query);
			card.hidden = !matches;
			if (matches) visibleCount += 1;
		});

		if (searchEmpty) searchEmpty.hidden = visibleCount > 0;
		if (searchResults) {
			searchResults.textContent = visibleCount === 0 ? 'No matching products.' : `${visibleCount} product${visibleCount === 1 ? '' : 's'} found.`;
		}
	}

	function setCollection(selectedCollection) {
		activeCollection = selectedCollection;
		collectionButtons.forEach((button) => {
			const isActive = button.dataset.collection === selectedCollection;
			button.classList.toggle('is-active', isActive);
			button.setAttribute('aria-pressed', String(isActive));
		});
		renderProducts();

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
	productSearch?.addEventListener('input', renderProducts);

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
	const dialogCollection = document.querySelector('.dialog-collection');
	const dialogDiscount = document.querySelector('.dialog-discount');
	const dialogPrice = document.querySelector('.dialog-price');
	const dialogAvailability = document.querySelector('.dialog-availability');
	const dialogSubtotal = document.querySelector('.dialog-subtotal');
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
	const checkoutButton = document.querySelector('.checkout-open');
	const checkoutDialog = document.querySelector('.checkout-dialog');
	const checkoutCloseButton = document.querySelector('.checkout-close');
	const checkoutForm = document.querySelector('.checkout-form');
	const checkoutTotal = document.querySelector('.checkout-total-value');
	const fulfillmentSelect = document.querySelector('#fulfillment');
	const pickupDetails = document.querySelector('.pickup-details');
	const pickupDate = document.querySelector('#pickup-date');
	const pickupTime = document.querySelector('#pickup-time');
	const pickupCampus = document.querySelector('#pickup-campus');
	const downloadTextButton = document.querySelector('.download-order-text');
	const downloadPdfButton = document.querySelector('.download-order-pdf');
	const orderHistoryList = document.querySelector('.order-history-list');
	const orderHistoryEmpty = document.querySelector('.order-history-empty');
	const orderHistoryCount = document.querySelector('.order-history-count');
	const cartNotice = document.querySelector('.cart-notice');
	const currency = new Intl.NumberFormat('en-PH', {
		style: 'currency',
		currency: 'PHP',
		maximumFractionDigits: 2
	});
	let selectedProduct = null;
	let cart = [];
	let orders = [];
	const products = new Map();
	let noticeTimeout;

	try {
		cart = JSON.parse(localStorage.getItem('pera-paraan-cart') || '[]');
		if (!Array.isArray(cart)) cart = [];
	} catch {
		cart = [];
	}
	try {
		orders = JSON.parse(localStorage.getItem('pera-paraan-orders') || '[]');
		if (!Array.isArray(orders)) orders = [];
	} catch {
		orders = [];
	}

	document.querySelectorAll('.product-card').forEach((card) => {
		const name = card.querySelector('h2').textContent.trim();
		products.set(name, {
			name,
			price: Number(card.dataset.price || 0),
			originalPrice: Number(card.dataset.originalPrice || card.dataset.price),
			discount: Number(card.dataset.discount || 0),
			available: card.dataset.available === 'true',
			stock: Number(card.dataset.stock || 0),
			collection: card.dataset.collection,
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

	function renderOrderHistory() {
		if (!orderHistoryList || !orderHistoryEmpty || !orderHistoryCount) return;
		orderHistoryList.replaceChildren();
		orderHistoryEmpty.hidden = orders.length > 0;
		orderHistoryCount.textContent = String(orders.length);
		orders.slice(0, 5).forEach((order) => {
			const entry = document.createElement('li');
			entry.className = 'order-history-entry';
			const heading = document.createElement('strong');
			heading.textContent = `Order ${order.id}`;
			const date = document.createElement('span');
			date.textContent = new Date(order.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
			const contents = document.createElement('p');
			contents.textContent = order.items.map((item) => `${item.quantity} × ${item.name}`).join(', ');
			const total = document.createElement('b');
			total.textContent = currency.format(order.total);
			const fulfillment = document.createElement('span');
			fulfillment.textContent = order.fulfillment === 'pickup'
				? `Pickup: ${order.pickupCampus || 'Campus not saved'}, ${formatPickupDate(order.pickupDate)} at ${formatPickupTime(order.pickupTime)}`
				: 'Delivery to be arranged';
			const customer = document.createElement('span');
			customer.textContent = `${order.customerName} | ${order.contact}`;
			entry.append(heading, date, customer, fulfillment, contents);
			if (order.notes) {
				const notes = document.createElement('p');
				notes.textContent = `Additional details: ${order.notes}`;
				entry.append(notes);
			}
			entry.append(total);
			orderHistoryList.append(entry);
		});
		if (downloadTextButton) downloadTextButton.disabled = orders.length === 0;
		if (downloadPdfButton) downloadPdfButton.disabled = orders.length === 0;
	}

	function formatPickupDate(dateValue) {
		if (!dateValue) return 'Not selected';
		return new Date(`${dateValue}T00:00:00`).toLocaleDateString('en-PH', {
			year: 'numeric', month: 'long', day: 'numeric'
		});
	}

	function formatPickupTime(timeValue) {
		if (!timeValue) return 'Not selected';
		const [hour, minute] = timeValue.split(':').map(Number);
		const suffix = hour === 12 ? 'NN' : 'PM';
		const displayHour = hour > 12 ? hour - 12 : hour;
		return `${displayHour}:${String(minute).padStart(2, '0')} ${suffix}`;
	}

	function orderReportText() {
		return orders.map((order, orderIndex) => {
			const lines = [
				`ORDER ${order.id}`,
				`Submitted: ${new Date(order.createdAt).toLocaleString('en-PH')}`,
				`Customer: ${order.customerName}`,
				`Contact: ${order.contact}`,
				`Fulfillment: ${order.fulfillment === 'pickup' ? 'Pickup' : 'Delivery'}`
			];
			if (order.fulfillment === 'pickup') {
				lines.push(`Pickup campus: ${order.pickupCampus}`);
				lines.push(`Pickup date: ${formatPickupDate(order.pickupDate)}`);
				lines.push(`Pickup time: ${formatPickupTime(order.pickupTime)}`);
			} else {
				lines.push('Delivery details: To be arranged directly with Pera-Paraan');
			}
			lines.push(`Additional details: ${order.notes || 'None provided'}`);
			lines.push(`Terms accepted: ${order.termsAccepted ? 'Yes' : 'No'}`);
			lines.push('Items:');
			order.items.forEach((item) => {
				lines.push(`  ${item.quantity} x ${item.name} | ${currency.format(item.price)} each | ${currency.format(item.price * item.quantity)}`);
			});
			lines.push(`Order total: ${currency.format(order.total)}`);
			return `${orderIndex ? '\n\n' : ''}${lines.join('\n')}`;
		}).join('');
	}

	function downloadOrderText() {
		if (!orders.length) return;
		const file = new Blob([`PERA-PARAAN CHECKOUT DETAILS\n\n${orderReportText()}`], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(file);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'Check out details.txt';
		link.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	}

	function downloadOrderPdf() {
		if (!orders.length) return;
		const PdfDocument = window.jspdf?.jsPDF;
		if (!PdfDocument) {
			showCartNotice('PDF export could not load. Use Download Details (.TXT) instead.', true);
			return;
		}
		const pdf = new PdfDocument({ unit: 'pt', format: 'a4' });
		const pageHeight = pdf.internal.pageSize.getHeight();
		const pageWidth = pdf.internal.pageSize.getWidth();
		const safeText = (text) => text
			.replace(/₱/g, 'PHP ')
			.replace(/×/g, 'x')
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^\x20-\x7E]/g, '?');
		pdf.setFont('helvetica', 'bold');
		pdf.setFontSize(16);
		pdf.text('PERA-PARAAN CHECKOUT DETAILS', 40, 44);
		pdf.setFont('helvetica', 'normal');
		pdf.setFontSize(10);
		let y = 72;
		orderReportText().split('\n').forEach((line) => {
			const wrappedLines = pdf.splitTextToSize(safeText(line), pageWidth - 80);
			wrappedLines.forEach((wrappedLine) => {
				if (y > pageHeight - 42) {
					pdf.addPage();
					y = 42;
				}
				pdf.text(wrappedLine, 40, y);
				y += 15;
			});
		});
		pdf.save('Check out details.pdf');
	}

	function updatePickupFields() {
		if (!fulfillmentSelect || !pickupDetails || !pickupDate || !pickupTime || !pickupCampus) return;
		const pickupSelected = fulfillmentSelect.value === 'pickup';
		pickupDetails.hidden = !pickupSelected;
		[pickupDate, pickupTime, pickupCampus].forEach((field) => {
			field.required = pickupSelected;
				field.disabled = !pickupSelected;
		});
		if (pickupTime) {
			pickupTime.min = '12:00';
			pickupTime.max = '18:00';
		}
		if (pickupSelected) {
			const today = new Date();
			const lastPickupDay = new Date(today);
			lastPickupDay.setDate(today.getDate() + 15);
			const toDateValue = (date) => {
				const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
				return localDate.toISOString().slice(0, 10);
			};
			pickupDate.min = toDateValue(today);
			pickupDate.max = toDateValue(lastPickupDay);
		}
	}

	fulfillmentSelect?.addEventListener('change', updatePickupFields);
	updatePickupFields();

	downloadTextButton?.addEventListener('click', downloadOrderText);
	downloadPdfButton?.addEventListener('click', downloadOrderPdf);

	function renderCart() {
		if (!cartCount || !cartItemsList || !cartEmpty || !cartTotal) return;

		cartItemsList.replaceChildren();
		let itemCount = 0;
		let total = 0;

		cart.forEach((item, index) => {
			const product = products.get(item.name);
			itemCount += item.quantity;
			total += item.price * item.quantity;

			const row = document.createElement('li');
			row.className = 'cart-item';
			const details = document.createElement('div');
			const name = document.createElement('strong');
			name.textContent = item.name;
			const price = document.createElement('span');
			price.textContent = `${currency.format(item.price)} each`;
			const subtotal = document.createElement('strong');
			subtotal.className = 'cart-item-subtotal';
			subtotal.textContent = `Subtotal: ${currency.format(item.price * item.quantity)}`;
			details.append(name, price, subtotal);

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
			increase.disabled = !product || item.quantity >= product.stock;
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
		if (checkoutTotal) checkoutTotal.textContent = currency.format(total);
		if (checkoutButton) checkoutButton.disabled = cart.length === 0;
		products.forEach((product) => {
			const stockLabel = product.card.querySelector('.stock-status');
			if (stockLabel) {
				const remaining = remainingStock(product);
				stockLabel.textContent = !product.available ? 'Not available' : remaining > 0 ? `In stock: ${remaining}` : 'Out of stock';
				stockLabel.classList.toggle('availability-unavailable', !product.available || remaining === 0);
				stockLabel.classList.toggle('availability-available', product.available && remaining > 0);
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
		if (change > 0 && (!product || !product.available || cart[index].quantity >= product.stock)) {
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

	document.querySelectorAll('.product-card').forEach((card) => {
			if (card.dataset.comingSoon === 'true') return;
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
			const productButton = card.querySelector('.product-button');
			card.querySelector('.product-info').insertBefore(priceLabel, productButton);
			card.querySelector('.product-info').insertBefore(availabilityLabel, productButton);

			if (itemDialog && dialogImage && dialogTitle && closeDialogButton && productButton) {
			productButton.addEventListener('click', () => {
				const image = card.querySelector('img');
				selectedProduct = product;
				dialogImage.hidden = !image;
				if (image) {
					dialogImage.src = image.src;
					dialogImage.alt = image.alt;
				}
				dialogTitle.textContent = productName;
				if (dialogCollection) dialogCollection.textContent = product.collection === 'special' ? 'Special product / service' : 'Course sticker';
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
					dialogAvailability.textContent = !productAvailable ? 'Not available' : remaining > 0 ? `In stock: ${remaining}` : 'Out of stock';
					dialogAvailability.className = productAvailable && remaining > 0 ? 'dialog-availability availability-available' : 'dialog-availability availability-unavailable';
				}
				if (itemQuantity) {
					itemQuantity.value = '1';
					itemQuantity.max = String(remainingStock(product));
					itemQuantity.disabled = !productAvailable || remainingStock(product) < 1;
				}
				if (dialogSubtotal) dialogSubtotal.textContent = `Subtotal: ${currency.format(productPrice)}`;
				if (addToCartButton) {
					const inStock = productAvailable && remainingStock(product) > 0;
					addToCartButton.disabled = !inStock;
					addToCartButton.textContent = inStock ? 'ADD TO CART' : 'NOT AVAILABLE';
				}
				itemDialog.showModal();
			});
			}
		});

	if (itemDialog && closeDialogButton) {
		closeDialogButton.addEventListener('click', () => itemDialog.close());
		itemDialog.addEventListener('click', (event) => {
			if (event.target === itemDialog) {
				itemDialog.close();
			}
		});
	}

	if (addToCartButton) {
		addToCartButton.addEventListener('click', () => {
			const quantity = Number(itemQuantity?.value || 1);
			if (addProductToCart(selectedProduct, quantity)) itemDialog.close();
		});
	}

	if (itemQuantity) {
		itemQuantity.addEventListener('input', () => {
			const quantity = Number(itemQuantity.value);
			if (selectedProduct && Number.isInteger(quantity) && quantity > 0 && quantity <= remainingStock(selectedProduct) && dialogSubtotal) {
				dialogSubtotal.textContent = `Subtotal: ${currency.format(selectedProduct.price * quantity)}`;
			}
		});
		itemQuantity.addEventListener('change', () => {
			if (!selectedProduct) return;
			const max = remainingStock(selectedProduct);
			const value = Number(itemQuantity.value);
			if (!Number.isFinite(value) || value < 1) {
				itemQuantity.value = '1';
				if (dialogSubtotal) dialogSubtotal.textContent = `Subtotal: ${currency.format(selectedProduct.price)}`;
				return;
			}
			if (value > max) {
				showCartNotice(`Only ${max} ${selectedProduct.name} sticker(s) remain in stock. Quantity was set to the available amount.`, true);
				itemQuantity.value = String(Math.max(1, max));
			} else if (!Number.isInteger(value)) {
				itemQuantity.value = String(Math.floor(value));
			}
			const quantity = Number(itemQuantity.value);
			if (dialogSubtotal) dialogSubtotal.textContent = `Subtotal: ${currency.format(selectedProduct.price * quantity)}`;
		});
	}

	if (cartToggle && cartDialog && cartCloseButton) {
		cartToggle.addEventListener('click', () => cartDialog.showModal());
		cartCloseButton.addEventListener('click', () => cartDialog.close());
		cartDialog.addEventListener('click', (event) => {
			if (event.target === cartDialog) cartDialog.close();
		});
	}

	if (checkoutButton && checkoutDialog && cartDialog) {
		checkoutButton.addEventListener('click', () => {
			if (!cart.length) return;
			cartDialog.close();
			checkoutDialog.showModal();
		});
	}

	if (checkoutCloseButton && checkoutDialog) {
		checkoutCloseButton.addEventListener('click', () => checkoutDialog.close());
		checkoutDialog.addEventListener('click', (event) => {
			if (event.target === checkoutDialog) checkoutDialog.close();
		});
	}

	if (checkoutForm && checkoutDialog) {
		checkoutForm.addEventListener('submit', (event) => {
			event.preventDefault();
			if (!cart.length) return;
			const formData = new FormData(checkoutForm);
			const pickupDateValue = String(formData.get('pickupDate') || '');
			if (formData.get('fulfillment') === 'pickup' &&
				(pickupDateValue < pickupDate.min || pickupDateValue > pickupDate.max)) {
				pickupDate.setCustomValidity('Choose a pickup date from today through the next 15 days.');
				pickupDate.reportValidity();
				return;
			}
			pickupDate?.setCustomValidity('');
			const order = {
				id: Date.now().toString(36).toUpperCase(),
				createdAt: new Date().toISOString(),
				customerName: formData.get('name'),
				contact: formData.get('contact'),
				fulfillment: formData.get('fulfillment'),
				pickupCampus: formData.get('fulfillment') === 'pickup' ? formData.get('pickupCampus') : '',
				pickupDate: formData.get('fulfillment') === 'pickup' ? pickupDateValue : '',
				pickupTime: formData.get('fulfillment') === 'pickup' ? formData.get('pickupTime') : '',
				notes: String(formData.get('notes') || '').trim(),
				termsAccepted: formData.get('terms') === 'on',
				items: cart.map(({ name, price, quantity }) => ({ name, price, quantity })),
				total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
			};
			orders.unshift(order);
			localStorage.setItem('pera-paraan-orders', JSON.stringify(orders));
			cart = [];
			persistCart();
			renderOrderHistory();
			checkoutForm.reset();
			checkoutDialog.close();
			showCartNotice(`Order ${order.id} saved in your order history. Contact us to confirm it.`);
		});
	}

	renderCart();
	renderOrderHistory();
