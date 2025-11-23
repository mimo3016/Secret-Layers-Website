document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Cart Functionality
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
    
    // Open Cart
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('translate-x-full');
        document.body.style.overflow = 'hidden';
    });
    
    // Close Cart
    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('translate-x-full');
        document.body.style.overflow = 'auto';
    });
    
    // Add to Cart
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }
            
            // Save cart to localStorage
            localStorage.setItem('secretLayersCart', JSON.stringify(cart));
            
            updateCart();
            showNotification(`Added ${name} to cart`);
        });
    });
    
    // Update Cart
    function updateCart() {
        // Clear cart items
        while (cartItems.firstChild && cartItems.firstChild !== emptyCartMessage) {
            cartItems.removeChild(cartItems.firstChild);
        }
        
        // Show/hide empty cart message
        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add('opacity-50');
        } else {
            emptyCartMessage.classList.add('hidden');
            checkoutBtn.disabled = false;
            checkoutBtn.classList.remove('opacity-50');
            
            // Add items to cart
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
            
            // Add event listeners to cart item buttons
            document.querySelectorAll('.decrease-quantity').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    const item = cart.find(item => item.id === id);
                    
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                    } else {
                        cart = cart.filter(item => item.id !== id);
                    }
                    
                    // Save cart to localStorage
                    localStorage.setItem('secretLayersCart', JSON.stringify(cart));
                    
                    updateCart();
                });
            });
            
            document.querySelectorAll('.increase-quantity').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    const item = cart.find(item => item.id === id);
                    item.quantity += 1;
                    
                    // Save cart to localStorage
                    localStorage.setItem('secretLayersCart', JSON.stringify(cart));
                    
                    updateCart();
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    cart = cart.filter(item => item.id !== id);
                    
                    // Save cart to localStorage
                    localStorage.setItem('secretLayersCart', JSON.stringify(cart));
                    
                    updateCart();
                });
            });
        }
        
        // Update cart total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `£${total.toFixed(2)}`;
        
        // Update cart count
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = count;
    }
    
    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            showNotification('Order placed successfully!');
            cart = [];
            
            // Save cart to localStorage
            localStorage.setItem('secretLayersCart', JSON.stringify(cart));
            
            updateCart();
            setTimeout(() => {
                cartSidebar.classList.add('translate-x-full');
                document.body.style.overflow = 'auto';
            }, 1500);
        }
    });
    
    // Show Notification
    function showNotification(message) {
        notificationMessage.textContent = message;
        notification.classList.remove('translate-y-20', 'opacity-0');
        
        setTimeout(() => {
            notification.classList.add('translate-y-20', 'opacity-0');
        }, 3000);
    }
});