import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0f2c76",
        color: "#ffffff",
        fontFamily: "'Playfair Display', serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      {/* Logo */}
      <img
        src="/gtr_logo.png" // place your logo in the public folder
        alt="GetTaxRelief Logo"
        style={{ width: "150px", marginBottom: "1rem" }}
      />

      <h1 style={{ color: "#ddc946", marginBottom: "1rem" }}>
        GetTaxRelief Server
      </h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "500px" }}>
        This server is dedicated solely to <strong>GetTaxRelief</strong> operations,
        handling <strong>Stripe API requests</strong> and payment processing.
      </p>
      <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#ddc946" }}>
        ⚠️ Not a public-facing website.
      </p>
    </div>
  );
}
