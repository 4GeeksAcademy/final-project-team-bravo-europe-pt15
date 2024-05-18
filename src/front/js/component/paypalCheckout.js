import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const PayPalCheckout = ({ onClose, onSuccess }) => {
  const handleApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      onSuccess(details);
    });
  };

  return (
    <div className="paypal-checkout-modal">
      <div className="paypal-checkout-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "1.00", // $1.00 for 10 credits
                  },
                },
              ],
            });
          }}
          onApprove={handleApprove}
        />
      </div>
    </div>
  );
};

export default PayPalCheckout;
