import React, { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
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
    setAmount(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default form submission on Enter key
      handleContinueWithCustom(); // Trigger custom checkout on Enter key
    }
  };

  const handleContinueWithDefault = () => {
    setAmount("1.00"); // Set to $1.00 for default checkout
    setShowCheckout(true);
  };

  const handleContinueWithCustom = () => {
    if (amount.trim() === "1") {
      Swal.fire({
        title: "Invalid Amount",
        text: "The amount of $1 is not allowed for custom payment. Please enter a value of 2 or more.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      setShowCheckout(true);
    }
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount || "1.00", // Use entered amount or default to $1.00
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
              Checkout with $1
            </button>
            <h6>or</h6>
            <h6>
              <span>Select amount to purchase:</span>
              <br />
              <span>1$ = 10 credits</span>
            </h6>
            <input
              type="text"
              value={amount}
              onChange={handleChange}
              onKeyDown={handleKeyDown} // Listen for the Enter key press
              placeholder="Enter amount 2 or more"
              className="amount-input"
            />
            <button onClick={handleContinueWithCustom}>
              Checkout with ${amount || "default amount"}
            </button>
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
