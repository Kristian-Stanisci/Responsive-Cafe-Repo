import menyer from "../Assets/json/Meny.json" with { "type": "json" };

console.log(menyer);

document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('.icon');
    const navMenu = document.getElementById('menu');

    if (!menuButton || !navMenu) {
        console.error('Menu button or nav menu not found!');
        return;
    }

    menuButton.addEventListener('click', (event) => {
        event.stopPropagation(); 
        navMenu.classList.toggle('active');
    });

    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });

    

});
