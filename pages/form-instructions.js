import Image from "next/image";
import { useRouter } from "next/router";

export default function FormInstructions() {
  const router = useRouter();
  const { product } = router.query; // product from URL if passed

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f9fafb",
        padding: "2rem",
        fontFamily: "'Playfair Display', serif",
        color: "#0f2c76",
      }}
    >
      {/* Logo */}
      <Image
        src="/gtr_logo.png"
        alt="GetTaxRelief Logo"
        width={150}
        height={50}
        style={{ marginBottom: "2rem" }}
      />

      <h1 style={{ color: "#ddc946" }}>
        {product ? `${product} Instructions` : "Form Instructions"}
      </h1>

      <div
        style={{
          maxWidth: "600px",
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          marginTop: "1.5rem",
        }}
      >
        <h2>📄 Step 1: Download the Form</h2>
        <p>
          Please download the official IRS Form 8821 using the link below:
        </p>
        <a
          href="https://www.cdn.gettaxreliefnow.com/form_8821.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: "#0f2c76",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          📥 Download Form 8821
        </a>

        <h2 style={{ marginTop: "1.5rem" }}>🖊️ Step 2: Sign the Form</h2>
        <p>
          Carefully fill out and sign the form. Ensure all information is{" "}
          <b>accurate and complete</b>. Inaccurate forms may delay processing.
        </p>

        <h2 style={{ marginTop: "1.5rem" }}>📤 Step 3: Submit via TaxDome</h2>
        <p>
          Once signed, please submit the form securely through our TaxDome
          portal:
        </p>
        <a
          href="https://app.taxdome.com/gettaxrelief"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: "#ddc946",
            color: "#0f2c76",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          🚀 Submit on TaxDome
        </a>
      </div>
    </div>
  );
}
