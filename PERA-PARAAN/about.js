const photoPaths = [
    'about me pic 1.jpg',
    'about me pic 2.jpg',
    'about me pic 3.jpg',
    'about me pic 4.jpg',
    'about me pic 5.jpg',
    'about me pic 6.jpg',
    'about me  7.jpg',
    'about me 8.jpg',
    'about me 9.jpg'
];

const photoTrack = document.querySelector('#about-photo-track');

if (photoTrack) {
    for (let index = photoPaths.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [photoPaths[index], photoPaths[randomIndex]] = [photoPaths[randomIndex], photoPaths[index]];
    }

    const photos = [
        { src: 'first pic.jpg', alt: 'A Pera-Paraan keepsake' },
        ...photoPaths.map((src, index) => ({ src, alt: `Pera-Paraan photo ${index + 1}` }))
    ];

    for (const photo of [...photos, ...photos]) {
        const frame = document.createElement('figure');
        const image = document.createElement('img');
        frame.className = 'marquee-item';
        image.src = photo.src;
        image.alt = photo.alt;
        image.loading = 'lazy';
        frame.append(image);
        photoTrack.append(frame);
    }
}