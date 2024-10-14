document.addEventListener('DOMContentLoaded', function () {
    const decreaseButtons = document.querySelectorAll('.qty-btn.decrease');
    const increaseButtons = document.querySelectorAll('.qty-btn.increase');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const priceElements = document.querySelectorAll('.cart-item-price');
    const totalBillElement = document.querySelector('.total-bill');
    const removeButtons = document.querySelectorAll('.remove-item');

    // Load the cart state from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || {};

    // Store the original unit prices for each item
    const unitPrices = Array.from(priceElements).map((priceElement, index) => {
        const priceText = priceElement.textContent.replace('₹', '').trim();
        const initialQty = parseInt(quantityInputs[index].value);
        return parseFloat(priceText) / initialQty; // Get the unit price for each item
    });

    // Initialize the cart with saved quantities if available
    quantityInputs.forEach((input, index) => {
        const productId = input.dataset.productId; // Associate each product by its ID
        if (cart[productId]) {
            input.value = cart[productId]; // Load saved quantity from localStorage
            updatePriceAndTotal(index, cart[productId]); // Update displayed prices accordingly
        }
    });

    // Event listener for decreasing quantity
    decreaseButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            let qty = parseInt(quantityInputs[index].value);
            if (qty > 1) {
                qty -= 1;
                quantityInputs[index].value = qty;
                updatePriceAndTotal(index, qty); // Update the price for this item
                saveCartState(index, qty); // Save to localStorage
            }
        });
    });

    // Event listener for increasing quantity
    increaseButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            let qty = parseInt(quantityInputs[index].value);
            qty += 1;
            quantityInputs[index].value = qty;
            updatePriceAndTotal(index, qty); // Update the price for this item
            saveCartState(index, qty); // Save to localStorage
        });
    });

    // Event listener for removing an item from the cart
    removeButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            const productId = quantityInputs[index].dataset.productId; // Get the product ID
            document.querySelector(`#cart-item-${productId}`).remove(); // Remove item from the UI
            delete cart[productId]; // Remove from the local cart object
            localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart to localStorage
            updateTotal(); // Update the total bill
        });
    });

    // Function to update the price of an item based on quantity
    function updatePriceAndTotal(index, qty) {
        const unitPrice = unitPrices[index];
        const newPrice = unitPrice * qty;

        // Update the displayed price for the item
        priceElements[index].textContent = `₹${newPrice.toFixed(2)}`;

        // Recalculate the total bill
        updateTotal();
    }

    // Function to update the total bill
    function updateTotal() {
        let total = 0;
        priceElements.forEach((priceElement) => {
            const price = parseFloat(priceElement.textContent.replace('₹', '').trim());
            total += price;
        });
        totalBillElement.textContent = 'Total: ₹' + total.toFixed(2); // Update total price
    }

    // Function to save the cart state to localStorage
    function saveCartState(index, qty) {
        const productId = quantityInputs[index].dataset.productId;
        cart[productId] = qty;
        localStorage.setItem('cart', JSON.stringify(cart)); // Save the current cart state
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const removeButtons = document.querySelectorAll('.remove-item');

    removeButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const productId = this.dataset.productId;
            
            fetch('/cart/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: productId }),
            }).then((response) => {
                if (response.ok) {
                    window.location.reload(); // Reload the cart after removal
                }
            });
        });
    });
});
