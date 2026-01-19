import React from 'react'

const Faq = () => {
  const faqs = [
    {
      question: "How can I place an order?",
      answer: [
        "Click on the product you wish to buy.",
        "Add the product to your cart.",
        "Update the quantity if needed.",
        "Click on “View Cart” or “My Cart.”",
        "If you have a coupon code, enter it; otherwise, click “Proceed to Checkout.”",
        "Update your billing and shipping address.",
        "Click on the “Place Order” button.",
        "Choose your preferred payment method and click “Proceed.”",
        "Your order will be successfully placed!"
      ]
    },
    // You can add more Q&A objects here
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{faq.question}</h2>
            <ul className="list-decimal list-inside space-y-1 text-gray-700">
              {faq.answer.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Faq
