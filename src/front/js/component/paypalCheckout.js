import React, { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Swal from "sweetalert2";

const PayPalCheckout = ({ onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  const handleApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      onSuccess(details);
    });
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      // Ensure only digits are entered
      setAmount(value);
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
    if (parseInt(amount, 10) >= 2) {
      setShowCheckout(true);
    } else {
      Swal.fire({
        title: "Minimum Value",
        text: "Minimum value is 2.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
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
              placeholder="Enter amount"
              className="amount-input"
            />
            {amount.trim() !== "" ? (
              <button onClick={handleContinueWithCustom}>
                Continue with {amount} $
              </button>
            ) : (
              <>
                <h6>Or</h6>
                <button onClick={handleContinueWithDefault}>
                  Continue with default value of 1$
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <p>Please choose your payment method to contiunue</p>
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
