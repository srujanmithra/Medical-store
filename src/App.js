import { useEffect, useMemo, useState } from "react";

const PRODUCTS = [
  { id: 1, name: "Paracetamol", price: 50 },
  { id: 2, name: "Vitamin C", price: 120 },
  { id: 3, name: "Cough Syrup", price: 90 }
];

function App() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const removeFromCart = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0)
    }));
  };

  const removeItemCompletely = (id) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const clearCart = () => setCart({});

  const cartItems = useMemo(() => {
    return PRODUCTS
      .map((p) => {
        const qty = cart[p.id] || 0;
        return qty > 0 ? { ...p, qty, subtotal: qty * p.price } : null;
      })
      .filter(Boolean);
  }, [cart]);

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.subtotal, 0),
    [cartItems]
  );

  const handlePayment = () => {
    alert("Payment successful! (Demo)");
    clearCart();
  };

  return (
    <div style={styles.page}>
      
      {/* PRODUCTS */}
      <div style={styles.section}>
        <h1 style={{ color: "#2563EB" }}>Medical Store</h1>

        {PRODUCTS.map((p) => {
          const qty = cart[p.id] || 0;

          return (
            <div key={p.id} style={styles.card}>
              <div>
                <h3>{p.name}</h3>
                <p>₹{p.price}</p>
                <p>Qty: {qty}</p>
              </div>

              <div style={styles.actions}>
                <button style={styles.btn} onClick={() => addToCart(p.id)}>
                  +
                </button>

                <button
                  style={{ ...styles.btn, opacity: qty === 0 ? 0.5 : 1 }}
                  onClick={() => removeFromCart(p.id)}
                  disabled={qty === 0}
                >
                  -
                </button>

                <button
                  style={styles.danger}
                  onClick={() => removeItemCompletely(p.id)}
                  disabled={qty === 0}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CART */}
      <div style={styles.section}>
        <h2 style={{ color: "#111827" }}>Cart</h2>

        {cartItems.length === 0 && <p>No items in cart</p>}

        {cartItems.map((item) => (
          <div key={item.id} style={styles.row}>
            <span>
              {item.name} × {item.qty}
            </span>
            <span>₹{item.subtotal}</span>
          </div>
        ))}

        <hr />

        <div style={styles.row}>
          <strong>Total</strong>
          <strong style={styles.success}>₹{total}</strong>
        </div>

        <div style={{ marginTop: 12 }}>
          <button
            style={{ ...styles.btn, marginRight: 8 }}
            onClick={clearCart}
            disabled={cartItems.length === 0}
          >
            Clear Cart
          </button>

          {total > 0 && (
            <button style={styles.primary} onClick={handlePayment}>
              Proceed to Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
    padding: 24,
    fontFamily: "sans-serif",
    backgroundColor: "#F9FAFB",
    minHeight: "100vh"
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #E5E7EB"
  },
  actions: {
    display: "flex",
    gap: 8
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    margin: "6px 0",
    color: "#111827"
  },
  btn: {
    padding: "6px 10px",
    cursor: "pointer",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#E5E7EB"
  },
  primary: {
    padding: "10px 16px",
    backgroundColor: "#2563EB",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: 8
  },
  danger: {
    padding: "6px 10px",
    backgroundColor: "#EF4444",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: 6
  },
  success: {
    color: "#10B981",
    fontWeight: "bold"
  }
};

export default App;