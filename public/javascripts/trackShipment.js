document.addEventListener('DOMContentLoaded', () => {
  const trackButton = document.getElementById('track-btn');
  const shipmentStatusDiv = document.getElementById('shipment-status');

  const mockData = {
    '12345': {
      status: 'Out for Delivery',
      timeline: ['Order Placed', 'Dispatched', 'Out for Delivery'],
      deliveryDate: '14th October 2024, 2 PM',
      payment: { total: 208, paid: true, method: 'Card' },
      contact: { name: 'Raghav Keerthana', phone: '+91-9908942130', email: 'psrsvkmsharma@example.com' },
      address: 'K-27, Sector 47, Noida, Uttar Pradesh, 201301',
      orderDetails: [{ item: 'Apples', quantity: 2, price: 180, image: 'apple.png' }, { item: 'Milk', quantity: 1, price: 28, image: 'milk.png' }],
      currentStep: 3
    },
    '12346': {
      status: 'Delivered',
      timeline: ['Order Placed', 'Dispatched', 'Out for Delivery', 'Delivered'],
      deliveryDate: '13th October 2024',
      payment: { total: 180, paid: true, method: 'Cash on Delivery' },
      contact: { name: 'V Sai Rahul', phone: '+91-9347613587', email: 'rsv239@example.com' },
      address: 'Flat 392, B Wing, Green Meadows, Thane, Maharashtra, 400601',
      orderDetails: [{ item: 'Bananas', quantity: 2, price: 140, image: 'banana.png' }, { item: 'Bread', quantity: 1, price: 40, image: 'bread.png' }],
      currentStep: 4
    },
    '12347': {
      status: 'Order Placed - Awaiting Payment',
      timeline: ['Order Placed'],
      deliveryDate: 'Expected: 15th October 2024',
      payment: { total: 160, paid: false, method: 'UPI Payment' },
      contact: { name: 'F Anand', phone: '+91-9030252306', email: 'botguy@example.com' },
      address: '06, Anand Nagar, Indore, Madhya Pradesh, 452001',
      orderDetails: [{ item: 'Chips', quantity: 2, price: 40, image: 'chips.png' }, { item: 'Cookies', quantity: 2, price: 120, image: 'cookies.png' }],
      currentStep: 1
    }
  };

  function trackOrder() {
    const orderId = document.getElementById('order-id').value.trim();

    if (!orderId) {
      shipmentStatusDiv.innerHTML = `<p class="error">Please enter a valid Order ID.</p>`;
      return;
    }

    const orderData = mockData[orderId];

    if (orderData) {
      const { status, timeline, deliveryDate, payment, contact, address, orderDetails, currentStep } = orderData;

      const timelineHTML = timeline.map((step, index) => {
        const activeClass = index < currentStep ? 'completed' : '';
        return `<li class="timeline-step ${activeClass}">${step}</li>`;
      }).join('');

      const orderDetailsHTML = orderDetails.map(item =>
        `<div class="order-item">
          <img src="/images/${item.image}" alt="${item.item}" class="order-image"/>
          <div class="order-info">
            <span>${item.item} - Quantity: ${item.quantity} - ₹${item.price}</span>
          </div>
        </div>`
      ).join('');

      const paymentStatus = payment.paid ? 'Paid' : 'Pending';
      const paymentDetailsHTML = `
        <p><strong>Total Amount:</strong> ₹${payment.total}</p>
        <p><strong>Payment Status:</strong> ${paymentStatus}</p>
        <p><strong>Payment Method:</strong> ${payment.method}</p>
      `;

      shipmentStatusDiv.innerHTML = `
        <h2>Status: ${status}</h2>
        <div class="contact-details">
          <h3>Delivery Contact</h3>
          <ul>
            <li><strong>Name:</strong> ${contact.name}</li>
            <li><strong>Phone:</strong> ${contact.phone}</li>
            <li><strong>Email:</strong> ${contact.email}</li>
          </ul>
        </div>
        <div class="address-details">
          <h3>Delivery Address</h3>
          <p>${address}</p>
        </div>
        <div class="order-details">
          <h3>Order Details</h3>
          <div class="order-details-list">${orderDetailsHTML}</div>
        </div>
        <div class="payment-details">
          <h3>Payment Details</h3>
          ${paymentDetailsHTML}
        </div>
        <h3>Estimated Delivery: ${deliveryDate}</h3>
        <ul class="timeline">${timelineHTML}</ul>
      `;
    } else {
      shipmentStatusDiv.innerHTML = `<p class="error">Order not found. Please check your Order ID and try again.</p>`;
    }
  }

  trackButton.addEventListener('click', trackOrder);
});
