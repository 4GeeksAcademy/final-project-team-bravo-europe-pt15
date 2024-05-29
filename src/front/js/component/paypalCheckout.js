import React, { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Swal from "sweetalert2";

const PayPalCheckout = ({ onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  const handleApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      const amountPaid = details.purchase_units[0].amount.value;
      onSuccess(details, amountPaid); // Pass the amountPaid to onSuccess
    });
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      if (parseInt(value, 10) < 2) {
        Swal.fire({
          title: "Invalid Input",
          text: "Please enter a value of 2 or more.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setAmount("");
      } else {
        setAmount(value);
      }
    } else {
      Swal.fire({
        title: "Invalid Input",
        text: "Please enter a valid whole number.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleContinueWithDefault = () => {
    setAmount("1.00");
    setShowCheckout(true);
  };

  const handleContinueWithCustom = () => {
    setShowCheckout(true);
  };

  const createOrder = (data, actions) => {
    const orderAmount = amount.trim() !== "" ? amount : "1.00";
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: orderAmount, // Use entered amount or default to $1.00
          },
        },
      ],
    });
  };

  return (
    <div className="paypal-checkout-modal">
      <div className="paypal-checkout-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        {!showCheckout ? (
          <div>
            <button onClick={handleContinueWithDefault}>
              Checkout with 1$
            </button>
            <h6>or</h6>
            <h6>
              <span>Select amount to purchase:</span>
              <br></br>
              <br></br>
              <span>1$ = 10 credits</span>
            </h6>
            <input
              type="text"
              value={amount}
              onChange={handleChange}
              placeholder="Enter amount 2 or more"
              className="amount-input"
            />
            {amount.trim() !== "" && (
              <button onClick={handleContinueWithCustom}>
                Checkout with {amount} $
              </button>
            )}
          </div>
        ) : (
          <>
            <p>Please choose your payment method to continue</p>
            <PayPalButtons
              createOrder={createOrder}
              onApprove={handleApprove}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PayPalCheckout;
