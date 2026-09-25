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
	const closeDialogButton = document.querySelector('.dialog-close');

	if (itemDialog && dialogImage && dialogTitle && closeDialogButton) {
		document.querySelectorAll('.product-card').forEach((card) => {
			card.querySelector('.product-button').addEventListener('click', () => {
				const image = card.querySelector('img');
				const title = card.querySelector('h2');

				dialogImage.src = image.src;
				dialogImage.alt = image.alt;
				dialogTitle.textContent = title.textContent;
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
