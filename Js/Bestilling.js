import menyer from "../Assets/json/Bestilling.json" with { "type": "json" };

console.log(menyer);

const Meny = document.getElementById('Meny-container');

document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('.icon');
    const navMenu = document.getElementById('menu');
    const handlevognIcon = document.querySelector('.cart-icon');
    const handlevognMeny = document.querySelector('.sidebar');
    const handlevognClose = document.querySelector('.sidebar-close');
    const count = document.querySelector('.cart-count');
    const Items = document.querySelector('.Items');
    const kasse = document.querySelector('.Checkout');

    const Cart = [];
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        parsedCart.forEach(item => {
            Cart.push(item);
        });
    }

    const updateCartCount = () => {
        const cartCount = document.querySelector('.cart-count');
        const cartCountValue = Cart.reduce((acc, item) => acc + (item.count || 1), 0);
        cartCount.textContent = cartCountValue;
        cartCount.style.display = cartCountValue > 0 ? 'block' : 'none';
    };

    const handleItemCount = (item) => {
        const existingItem = Cart.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            existingItem.count = (existingItem.count || 1) + 1;
        } else {
            Cart.push({ ...item, count: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(Cart));
    };

    const updateCartDisplay = () => {
        Items.style.maxHeight = '350px';
        Items.style.overflowY = 'auto';
        Items.innerHTML = Cart.map((item, index) => `
            <li style="display: flex; align-items: center; justify-content: space-between;">
                <button class="countItems" style="background: none; border: 1px solid black; padding: 5px; cursor: pointer;">(${item.count || 1})</button>
                <span>${item.name} - ${item.price * (item.count || 1)} NOK</span>
                <div style="display: flex; gap: 5px;">
                    <button class="remove-button" data-index="${index}" style="background: none; border: 1px solid black; padding: 5px; cursor: pointer;">-</button>
                    <button class="add-button2" data-index="${index}" style="background: none; border: 1px solid black; padding: 5px; cursor: pointer;">+</button>
                </div>
            </li>
        `).join('');

        const total = Cart.reduce((acc, item) => acc + item.price * (item.count || 1), 0);
        const totalElement = document.querySelector('.Handlevogn-total');
        totalElement.innerHTML = `<span style="color: green; font-weight: bold;">${total} NOK</span>`;
    };

    updateCartDisplay();

    Items.addEventListener('click', (event) => {
        const target = event.target;
        const index = target.dataset.index;

        if (target.classList.contains('remove-button')) {
            const item = Cart[index];
            if (item.count > 1) {
                item.count -= 1;
            } else {
                Cart.splice(index, 1);
            }
            localStorage.setItem('cart', JSON.stringify(Cart));
            updateCartDisplay();
            updateCartCount();
        } else if (target.classList.contains('add-button2')) {
            const item = Cart[index];
            handleItemCount(item);
            updateCartDisplay();
            updateCartCount();
        }
    });

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

    if (handlevognIcon && handlevognMeny) {
        handlevognIcon.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            handlevognMeny.classList.toggle('active');
        });

        handlevognClose.addEventListener('click', () => {
            handlevognMeny.classList.remove('active');
        });

        handlevognMeny.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    menyer.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');

        const heading = document.createElement('h2');
        heading.textContent = category.category;
        categoryDiv.appendChild(heading);

        const list = document.createElement('ul');
        category.items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="item-name">${item.name}</span> 
                <span class="price">${item.price} NOK</span>
                <button class="add-button">+</button>
            `;

            const addButton = listItem.querySelector('.add-button');
            addButton.addEventListener('click', () => {
                console.log(`Added ${item.name} to the order.`);
                handleItemCount(item);
                updateCartDisplay();
                updateCartCount();
            });

            list.appendChild(listItem);
        });

        categoryDiv.appendChild(list);
        Meny.appendChild(categoryDiv);
    });
    updateCartCount();

    kasse.addEventListener('click', () => {
        if (Cart.length > 0) {
            const confirmationPopup = document.createElement('div');
            confirmationPopup.style.position = 'fixed';
            confirmationPopup.style.top = '50%';
            confirmationPopup.style.left = '50%';
            confirmationPopup.style.transform = 'translate(-50%, -50%)';
            confirmationPopup.style.backgroundColor = '#fff';
            confirmationPopup.style.padding = '20px';
            confirmationPopup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            confirmationPopup.style.borderRadius = '8px';
            confirmationPopup.style.textAlign = 'center';
            confirmationPopup.style.zIndex = '1000';

            const message = document.createElement('p');
            message.textContent = 'Takk for at du valgte oss! Din bestilling er bekreftet.';
            message.style.marginBottom = '20px';
            message.style.fontSize = '16px';
            message.style.color = '#333';

            const closeButton = document.createElement('button');
            closeButton.textContent = 'Lukk';
            closeButton.style.backgroundColor = '#4CAF50';
            closeButton.style.color = '#fff';
            closeButton.style.border = 'none';
            closeButton.style.padding = '10px 20px';
            closeButton.style.borderRadius = '5px';
            closeButton.style.cursor = 'pointer';

            closeButton.addEventListener('click', () => {
                document.body.removeChild(confirmationPopup);
            });

            confirmationPopup.appendChild(message);
            confirmationPopup.appendChild(closeButton);
            document.body.appendChild(confirmationPopup);
        } else {
            const errorPopup = document.createElement('div');
            errorPopup.style.position = 'fixed';
            errorPopup.style.top = '50%';
            errorPopup.style.left = '50%';
            errorPopup.style.transform = 'translate(-50%, -50%)';
            errorPopup.style.backgroundColor = '#fff';
            errorPopup.style.padding = '20px';
            errorPopup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            errorPopup.style.borderRadius = '8px';
            errorPopup.style.textAlign = 'center';
            errorPopup.style.zIndex = '1000';

            const message = document.createElement('p');
            message.textContent = 'Du har ingen varer i handlekurven.';
            message.style.marginBottom = '20px';
            message.style.fontSize = '16px';
            message.style.color = '#333';

            const closeButton = document.createElement('button');
            closeButton.textContent = 'Lukk';
            closeButton.style.backgroundColor = '#f44336';
            closeButton.style.color = '#fff';
            closeButton.style.border = 'none';
            closeButton.style.padding = '10px 20px';
            closeButton.style.borderRadius = '5px';
            closeButton.style.cursor = 'pointer';

            closeButton.addEventListener('click', () => {
                document.body.removeChild(errorPopup);
            });

            errorPopup.appendChild(message);
            errorPopup.appendChild(closeButton);
            document.body.appendChild(errorPopup);
        }
    });

});
