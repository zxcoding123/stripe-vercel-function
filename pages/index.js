import { useEffect } from "react";
import Image from "next/image";

export default function Home() {
  useEffect(() => {
    // Load Google Font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Auto-redirect after 5 seconds
    const redirectUrl = "https://www.gettaxreliefnow.com/"; // change this to your target
    const timer = setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);

    // Cleanup timer if component unmounts
    return () => clearTimeout(timer);
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
      <Image
        src="/gtr_logo.png"
        alt="GetTaxRelief Logo"
        width={150}
        height={50}
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

      {/* Redirect link */}
      <p style={{ marginTop: "1rem", fontSize: "1rem", color: "#ffffff" }}>
        You will be redirected automatically in a second, or click{" "}
        <a href="https://www.gettaxreliefnow.com/" style={{ color: "#ddc946", textDecoration: "underline" }}>
          here
        </a>{" "}
        to go now.
      </p>
    </div>
  );
}
