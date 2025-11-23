// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Cart functionality
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const emptyCartMessage = document.getElementById('empty-cart-message');
const checkoutBtn = document.getElementById('checkout-btn');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('secretLayersCart')) || [];
updateCart();

// Open cart
cartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
});

// Close cart
closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('translate-x-full');
    document.body.style.overflow = 'auto';
});

// Add to cart buttons
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id').toString(); // Ensure id is string
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));

        // Find existing item by string id
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        saveAndUpdateCart();
        showNotification(`Added ${name} to cart`);
    });
});

// Save to localStorage and update cart display
function saveAndUpdateCart() {
    localStorage.setItem('secretLayersCart', JSON.stringify(cart));
    updateCart();
}

// Update cart UI
function updateCart() {
    // Clear cartItems container
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add('opacity-50');
    } else {
        emptyCartMessage.classList.add('hidden');
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('opacity-50');

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'flex justify-between items-center py-3 border-b border-gray-100';
            cartItem.innerHTML = `
                <div>
                    <h4 class="font-medium">${item.name}</h4>
                    <div class="flex items-center mt-1">
                        <button class="decrease-quantity text-gray-500 hover:text-burgundy px-2" data-id="${item.id}">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="increase-quantity text-gray-500 hover:text-burgundy px-2" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="flex items-center">
                    <span class="mr-4">£${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-item text-gray-400 hover:text-burgundy" data-id="${item.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        // Attach event listeners for quantity and remove buttons AFTER rendering
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                if (item) {
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                    } else {
                        cart = cart.filter(item => item.id !== id);
                    }
                    saveAndUpdateCart();
                }
            });
        });

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                if (item) {
                    item.quantity += 1;
                    saveAndUpdateCart();
                }
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                cart = cart.filter(item => item.id !== id);
                saveAndUpdateCart();
            });
        });
    }

    // Update total and count in UI
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `£${total.toFixed(2)}`;

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

// Checkout
checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        showNotification('Order placed successfully!');
        cart = [];
        saveAndUpdateCart();
        setTimeout(() => {
            cartSidebar.classList.add('translate-x-full');
            document.body.style.overflow = 'auto';
        }, 1500);
    }
});

// Notifications
function showNotification(message) {
    notificationMessage.textContent = message;
    notification.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        notification.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}
