import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import Breadcrumb from "./Breadcrumb";
import "./ShoppingCart.css";
import mada from "../../../images/mada-logo.png";
import ConfirmationDialog from "../../../Dialog/ConfirmationDialog";
import Address from "../../../Dialog/Address";
import { useAddress } from "../../../../contexts/AddressContext";

function CompleteOrder({ userId }) {
  const { id } = useParams();
  const [stepType, setStepType] = useState("");
  const { address } = useAddress();// استخدام context للحصول على العنوان
  const [dialogState, setDialogState] = useState({
    confirmationDialog: false,
    address: false,
  });

  // Helper function to toggle dialog states (open or close)
  const toggleDialog = (dialogName, value, requestId = null, status = "") => {
    setDialogState((prev) => ({ ...prev, [dialogName]: value }));
    // if (requestId) setSelectedRequestId(requestId);
    // if (status) setSelectedStatus(status);
  };

  // Handle confirmation for conferm Payment or View order
  const handleConfirmAction = () => {

    if (stepType == "confirmPay") {
      console.log("Put the send order BE logic");
      toggleDialog("confirmationDialog", false);
      setStepType("viewOrder");
      toggleDialog("confirmationDialog", true);

    } else if (stepType == "viewOrder") {

      console.log("open view order page");
      <Link to={`/viewOrder`} />;
      // set state of dialog to false "close"
      toggleDialog("confirmationDialog", false);
    }
  };

  const handelCheckout = () => {
    setStepType("confirmPay");
    toggleDialog("confirmationDialog", true);
  };

  const handleDialogClose = () => {
    toggleDialog("address", false);
  };

  const handleEditAddress = () => {
    toggleDialog("address", true);
  };

  return (
    <div className="shoppingCart">
      <Breadcrumb
        crumbs={[
          { name: "Shopping Carts", path: `/shoppingCarts/${userId}` },
          { name: `Shopping Cart ${id}`, path: `/shoppingCarts/${userId}/${id}` },
          {
            name: "Payment Confirmation",
            path: `/shoppingCarts/${userId}/${id}/complete`,
          },
        ]}
      />
      <div className="complate-page-container">
        <div className="order-summary">
          <div className="order-total">
            <div className="total-title">Order Total:</div>
            <div className="total-price">930$</div>
          </div>
        </div>
        <div className="user-info">
          <div className="user-info-step">
            <div className="step-num">
              <p>1</p>
            </div>
            <div className="step-content">
              <div className="step-title">Receiving Address</div>
              <div className="adress-detail">
                {address ? (
                  // if address exist , display it
                  <div className="address">{`${address.country}, ${address.city}, ${address.neighborhood}, ${address.street}.`}</div>
                ) : (
                  // if not exist  , display a message
                  <div className="no-address">
                    <p>No address found, Click 'Edit' to add.</p>
                  </div>
                )}
                <div className="edit-address">
                  <button onClick={handleEditAddress}>
                    Edit <EditOutlined />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="user-info-step">
            <div className="step-num">
              <p>2</p>
            </div>
            <div className="step-content">
              <div className="step-title">Payment</div>
              <div className="step-detail">
                <div className="pay-method">
                  <input type="radio" checked />
                  <img src={mada}></img>
                </div>
                <div className="card-form">
                  <label className="card-num">
                    Card Number
                    <input type="text" placeholder="Card Number" required />
                  </label>
                  <label className="card-date">
                    Expiration Date
                    <input type="date" placeholder="Expiration Date" required />
                  </label>
                  <label className="card-code">
                    CVV Code
                    <input type="text" placeholder="CVV" required />
                  </label>
                </div>
                <div className="pay-button-container">
                  <button className="Checkout-button" onClick={handelCheckout}>
                    Confirm Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {dialogState.confirmationDialog && (
        <ConfirmationDialog
          title={`${stepType === "confirmPay"
            ? "Are you ready to confirm your payment?"
            : "Your Order Has Been Created"
            }`}
          message={` ${stepType === "confirmPay"
            ? "Once confirmed, you won't be able to cancel your order."
            : "Would you like to view the Request? "
            }`}
          onConfirm={handleConfirmAction}
          onCancel={() => toggleDialog("confirmationDialog", false)}
          stepType={stepType} // Pass stepType as a prop to control icon and buttons
        />
      )}
      {dialogState.address && (
        <Address
          onClose={() => handleDialogClose(false)}
          onRequestSent={() => handleDialogClose(true)}
        />
      )}
    </div>
  );
}

export default CompleteOrder;
