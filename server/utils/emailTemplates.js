// utils/emailTemplates.js

/* ======================================================
   ORDER PRODUCTS TABLE
   ====================================================== */
export const generateOrderProductsHTML = (items) => {
  let html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
    <h2 style="color:#333;">🛒 Order Summary</h2>

    <table style="width:100%; border-collapse:collapse;">
      <thead>
        <tr style="background:#f2f2f2;">
          <th style="padding:8px; text-align:left;">Product</th>
          <th style="padding:8px; text-align:center;">Qty</th>
          <th style="padding:8px; text-align:right;">Price</th>
        </tr>
      </thead>
      <tbody>
  `;

  let subtotal = 0;

  items.forEach((item) => {
    const price = item.product.offerPrice * item.quantity;
    subtotal += price;

    html += `
      <tr>
        <td style="padding:8px;">${item.product.name}</td>
        <td style="padding:8px; text-align:center;">${item.quantity}</td>
        <td style="padding:8px; text-align:right;">₹${price}</td>
      </tr>
    `;
  });

  const tax = Math.floor(subtotal * 0.02);
  const total = subtotal + tax;

  html += `
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding:8px; text-align:right;"><b>Subtotal</b></td>
          <td style="padding:8px; text-align:right;">₹${subtotal}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:8px; text-align:right;"><b>Tax (2%)</b></td>
          <td style="padding:8px; text-align:right;">₹${tax}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:8px; text-align:right; font-size:16px;"><b>Total</b></td>
          <td style="padding:8px; text-align:right; font-size:16px;"><b>₹${total}</b></td>
        </tr>
      </tfoot>
    </table>
  </div>
  `;

  return html;
};

/* ======================================================
   DELIVERY ADDRESS (MATCHES YOUR SCHEMA)
   ====================================================== */
export const generateAddressHTML = (address) => {
  if (!address) {
    return `<p style="color:red;">Delivery address not found</p>`;
  }

  return `
    <div style="margin-top:20px; border:1px solid #ddd; padding:12px;">
      <h3 style="margin-bottom:6px;">📍 Delivery Address</h3>
      <p style="margin:0;">
        <b>${address.firstName || ""} ${address.lastName || ""}</b><br/>
        ${address.street || ""}<br/>
        ${address.city || ""}, ${address.state || ""} - ${address.zipcode || ""}<br/>
        ${address.country || ""}<br/>
        📞 ${address.phone || ""}<br/>
        ✉️ ${address.email || ""}
      </p>
    </div>
  `;
};

/* ======================================================
   DELIVERY MESSAGE
   ====================================================== */
export const deliveryInfoHTML = `
  <p style="margin-top:15px; font-weight:bold; color:green;">
    🚚 Your order will be delivered within 7 days.
  </p>
`;
