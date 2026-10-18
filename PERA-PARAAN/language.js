const languageCopy = {
    en: {
        navHome: 'HOME',
        navShop: 'SHOP',
        navAbout: 'ABOUT',
        navContact: 'CONTACT',
        termsLink: 'Terms and Conditions',
        languageLabel: 'Language',
        locationLabel: 'Location',
        termsTitle: 'Terms and Conditions',
        termsIntro: 'Welcome to Pera-Paraan. By browsing our shop or submitting an order request, you agree to the terms below. These terms are intended to make ordering clear and fair for both our customers and our small creative business.',
        termsProductsTitle: '1. Products and availability',
        termsProducts: 'Product photos and descriptions are provided to help you choose. Small variations in color, print, or finish may occur. Items marked unavailable or coming soon cannot be added to an order. Prices and stock may change, and an order is subject to confirmation by Pera-Paraan.',
        termsOrdersTitle: '2. Order requests and payment',
        termsOrders: 'Submitting checkout on this website records an order request in your current browser. It does not send your request to the seller, reserve inventory, charge a payment method, or confirm a sale. Contact Pera-Paraan directly to confirm availability, final price, payment method, and order acceptance. Do not submit sensitive payment information through this website.',
        termsFulfillmentTitle: '3. Pickup, delivery, and timing',
        termsFulfillment: 'Pickup at PUP Lagoon and any delivery arrangements must be confirmed directly with the seller. Delivery coverage, fees, and estimated dates depend on the agreed arrangement. Custom products may need additional preparation time; we will confirm timing before accepting a custom request.',
        termsCustomTitle: '4. Custom designs',
        termsCustom: 'Please provide accurate spelling, names, dates, and other details for personalized work. We may contact you to approve a design or clarify a request before production. Once a custom design has been approved or production has begun, changes may not be possible.',
        termsCancelTitle: '5. Cancellations and concerns',
        termsCancel: 'Contact us as soon as possible if you need to change or cancel a request. Cancellation, replacement, or refund arrangements are reviewed individually and confirmed directly with the seller, especially for personalized items or products already prepared.',
        termsDataTitle: '6. Website and local data',
        termsData: 'The cart and order history feature stores order details, including your name and contact information, in local browser storage on the device you use. Clearing browser data or switching devices may remove that information. This demo website does not process payments or transmit checkout details to a server; please contact the seller separately to place and confirm an actual order.'
    },
    tl: {
        navHome: 'HOME',
        navShop: 'MGA PRODUKTO',
        navAbout: 'TUNGKOL',
        navContact: 'KONTAK',
        termsLink: 'Mga Tuntunin at Kundisyon',
        languageLabel: 'Wika',
        locationLabel: 'Lokasyon',
        termsTitle: 'Mga Tuntunin at Kundisyon',
        termsIntro: 'Maligayang pagdating sa Pera-Paraan. Sa pag-browse sa aming tindahan o pagpapadala ng kahilingan sa pag-order, sumasang-ayon ka sa mga tuntunin sa ibaba. Layunin ng mga ito na maging malinaw at patas ang pag-order para sa aming mga customer at maliit na negosyong malikhaing ito.',
        termsProductsTitle: '1. Mga produkto at availability',
        termsProducts: 'Nasa mga larawan at paglalarawan ng produkto ang gabay sa pagpili. Maaaring magkaroon ng kaunting pagkakaiba sa kulay, print, o finish. Hindi maaaring idagdag sa order ang mga produktong walang stock o paparating pa lamang. Maaaring magbago ang presyo at stock; kailangan munang kumpirmahin ng Pera-Paraan ang bawat order.',
        termsOrdersTitle: '2. Kahilingan sa order at bayad',
        termsOrders: 'Itinatala lamang ng checkout sa website na ito ang kahilingan sa order sa browser na ginagamit mo. Hindi ito ipinapadala sa nagbebenta, nagrereserba ng stock, naniningil, o nagkukumpirma ng bentahan. Direktang kontakin ang Pera-Paraan upang kumpirmahin ang availability, pinal na presyo, paraan ng bayad, at pagtanggap sa order. Huwag ilagay dito ang sensitibong impormasyon sa pagbabayad.',
        termsFulfillmentTitle: '3. Pickup, delivery, at oras',
        termsFulfillment: 'Kailangang direktang kumpirmahin sa nagbebenta ang pickup sa PUP Lagoon at anumang delivery. Nakadepende sa napagkasunduan ang sakop, bayad, at tinatayang petsa ng delivery. Maaaring mangailangan ng dagdag na oras ang mga custom na produkto; kukumpirmahin muna namin ang iskedyul bago tanggapin ang kahilingan.',
        termsCustomTitle: '4. Mga custom na disenyo',
        termsCustom: 'Tiyaking tama ang baybay ng mga pangalan, petsa, at iba pang detalye para sa personalized na produkto. Maaari kaming makipag-ugnayan upang ipaapruba ang disenyo o linawin ang kahilingan bago ito gawin. Maaaring hindi na mabago ang disenyo kapag naaprubahan na o nasimulan na ang paggawa.',
        termsCancelTitle: '5. Pagkansela at mga alalahanin',
        termsCancel: 'Makipag-ugnayan sa amin sa lalong madaling panahon kung nais baguhin o kanselahin ang kahilingan. Isa-isang sinusuri at direktang pinagkakasunduan sa nagbebenta ang pagkansela, pagpapalit, o refund, lalo na para sa personalized o naihandang produkto.',
        termsDataTitle: '6. Website at lokal na datos',
        termsData: 'Iniimbak ng cart at order history ang mga detalye ng order, kasama ang pangalan at contact information mo, sa lokal na storage ng browser sa device na ginagamit mo. Maaaring mabura ang impormasyong ito kapag nilinis ang browser data o nagpalit ng device. Hindi nagpoproseso ng bayad o nagpapadala ng checkout details sa server ang demo website na ito; direktang kontakin ang nagbebenta upang maglagay at magkumpirma ng aktuwal na order.'
    }
};

const languageSelects = document.querySelectorAll('.language-select');

function applyLanguage(language) {
    const selectedLanguage = languageCopy[language] ? language : 'en';
    document.documentElement.lang = selectedLanguage === 'tl' ? 'fil' : 'en';
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const translation = languageCopy[selectedLanguage][element.dataset.i18n];
        if (translation) element.textContent = translation;
    });
    languageSelects.forEach((select) => {
        select.value = selectedLanguage;
        select.setAttribute('aria-label', selectedLanguage === 'tl' ? 'Wika' : 'Language');
    });
    try {
        localStorage.setItem('pera-paraan-language', selectedLanguage);
    } catch {
        // Language switching remains available when browser storage is disabled.
    }
}

let savedLanguage = 'en';
try {
    savedLanguage = localStorage.getItem('pera-paraan-language') || 'en';
} catch {
    savedLanguage = 'en';
}

languageSelects.forEach((select) => {
    select.addEventListener('change', () => applyLanguage(select.value));
});
applyLanguage(savedLanguage);
