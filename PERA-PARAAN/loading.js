const pageLoader = document.querySelector('.page-loader');

if (pageLoader) {
    let pageReady = document.readyState === 'complete';
    let minimumDelayPassed = false;
    let isHidden = false;

    const hideLoader = () => {
        if (isHidden || !pageReady || !minimumDelayPassed) return;
        isHidden = true;
        pageLoader.classList.add('is-hidden');
        pageLoader.addEventListener('transitionend', () => pageLoader.remove(), { once: true });
        setTimeout(() => pageLoader.remove(), 500);
    };

    window.addEventListener('load', () => {
        pageReady = true;
        hideLoader();
    }, { once: true });

    setTimeout(() => {
        minimumDelayPassed = true;
        hideLoader();
    }, 450);

    setTimeout(() => {
        pageReady = true;
        minimumDelayPassed = true;
        hideLoader();
    }, 3500);
}
