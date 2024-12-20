import React, { useState, useEffect } from "react";
import ShoppingBasket from "./ShoppingBasket.jsx";
import { fetchShoppingBasketList } from "../../../../api/shoppingBasket";

function ShoppingBasketList() {
  const [baskets, setBaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBaskets = async () => {
      try {
        const data = await fetchShoppingBasketList();
        setBaskets(data.basket || []);
      } catch (err) {
        setError("Error fetching shopping Baskets");
      } finally {
        setLoading(false);
      }
    };

    getBaskets();
  }, []);

  if (loading) {
    return <div className="background-message">Loading...</div>;
  }

  if (error) {
    return <div className="background-message">{error}</div>;
  }

  return (
    <div className="shoppingBasket">
      <div className="title">Shopping Baskets</div>
      {baskets && baskets.length > 0 ? (
        baskets.map((basket, index) => (
          <ShoppingBasket
            key={basket._id}
            basket={basket}
            basketId={basket._id}
            basketIndex={index + 1}
          />
        ))
      ) : (
        <div className="background-message">
          Your shopping basket is currently empty. Please start adding raw
          materials to proceed with your order.
        </div>
      )}
    </div>
  );
}

export default ShoppingBasketList;
