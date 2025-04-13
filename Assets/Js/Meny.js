import menyer from "../json/Meny.json" with { "type": "json" };

console.log(menyer);

const Meny = document.getElementById('Meny-container');

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


    menyer.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');

        const heading = document.createElement('h2');
        heading.textContent = category.category;
        categoryDiv.appendChild(heading);

        const list = document.createElement('ul');
        category.items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span class="item-name">${item.name}</span> <span class="price">${item.price} NOK</span>`;;
            list.appendChild(listItem);
        });

        categoryDiv.appendChild(list);
        Meny.appendChild(categoryDiv);

    });
    

});