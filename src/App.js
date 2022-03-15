import React, { useState, useEffect } from "react";
import { commerce } from "./lib/commerce";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Products, Navbar, Cart, Checkout } from "./Components";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchProducts() {
    const { data } = await commerce.products.list();
    setProducts(data);
  }

  async function fetchCart() {
    setCart(await commerce.cart.retrieve());
  }

  async function handleAddToCart(productId, quantity) {
    const { cart } = await commerce.cart.add(productId, quantity);
    setCart(cart);
  }

  async function handleUpdateCartQty(productId, quantity) {
    const { cart } = await commerce.cart.update(productId, { quantity });
    setCart(cart);
  }

  async function handleRemoveFromCart(productId) {
    const { cart } = await commerce.cart.remove(productId);
    setCart(cart);
  }

  async function handleEmptyCart() {
    const { cart } = await commerce.cart.empty();
    setCart(cart);
  }

  const refrechCart = async () => {
    const newCart = await commerce.cart.refresh();
    setCart(newCart);
  };

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(
        checkoutTokenId,
        newOrder
      );
      setOrder(incomingOrder);
      refrechCart();
    } catch (error) {
      setErrorMessage(error.data.error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  // console.log(cart);

  return (
    <BrowserRouter>
      <div>
        <Navbar totalItems={cart.total_items} />

        <Routes>
          <Route
            path="/"
            element={
              <Products products={products} onAddToCart={handleAddToCart} />
            }
          />
          <Route
            exact
            path="/cart"
            element={
              <Cart
                cart={cart}
                handleEmptyCart={handleEmptyCart}
                handleRemoveFromCart={handleRemoveFromCart}
                handleUpdateCartQty={handleUpdateCartQty}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                cart={cart}
                order={order}
                onCaptureCheckout={handleCaptureCheckout}
                error={errorMessage}
              />
            }
            // cart={cart}
            // order={order}
            // onCaptureCheckout={handleCaptureCheckout}
            // error={errorMessage}
          />
          {/* ^^ add exact path */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
