document.addEventListener('DOMContentLoaded', function () {
    const decreaseButtons = document.querySelectorAll('.qty-btn.decrease');
    const increaseButtons = document.querySelectorAll('.qty-btn.increase');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const priceElements = document.querySelectorAll('.cart-item-price');
    
    // Store the original price (unit price) for each item
    const unitPrices = Array.from(priceElements).map(priceElement => {
        const priceText = priceElement.textContent.replace('₹', '').trim();
        return parseFloat(priceText) / parseInt(priceElement.closest('li').querySelector('.quantity-input').value);
    });

    decreaseButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            let qty = parseInt(quantityInputs[index].value);
            if (qty > 1) {
                qty -= 1;
                quantityInputs[index].value = qty;
                updatePriceAndTotal(index, qty);
            }
        });
    });

    increaseButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            let qty = parseInt(quantityInputs[index].value);
            qty += 1;
            quantityInputs[index].value = qty;
            updatePriceAndTotal(index, qty);
        });
    });

    function updatePriceAndTotal(index, qty) {
        const unitPrice = unitPrices[index];
        const newPrice = unitPrice * qty;
        
        // Update the displayed price for the item
        priceElements[index].textContent = `₹${newPrice.toFixed(2)}`;
        
        // Recalculate the total bill
        updateTotal();
    }

    function updateTotal() {
        let total = 0;
        priceElements.forEach((priceElement, index) => {
            const price = parseFloat(priceElement.textContent.replace('₹', '').trim());
            total += price;
        });
        document.querySelector('.total-bill').textContent = 'Total: ₹' + total.toFixed(2);
    }
});
