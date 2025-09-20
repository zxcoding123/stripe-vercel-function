import Image from "next/image";
import { useRouter } from "next/router";

export default function FormInstructions() {
  const router = useRouter();
  const { product } = router.query;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f9fafb 0%, #e0e7ff 100%)",
        padding: "2rem",
        fontFamily: "'Playfair Display', serif",
        color: "#0f2c76",
      }}
    >
      {/* Logo */}
      <Image
        src="/gtr_logo.png"
        alt="GetTaxRelief Logo"
        width={180}
        height={60}
        style={{ marginBottom: "2rem" }}
      />

      <h1
        style={{
          color: "#ddc946",
          fontSize: "2.5rem",
          textAlign: "center",
          marginBottom: "1.5rem",
        }}
      >
        {product ? `${product} Instructions` : "Form Instructions"}
      </h1>

      <div
        style={{
          maxWidth: "700px",
          width: "100%",
          background: "#fff",
          padding: "2.5rem",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        {/* Step 1 */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ display: "flex", alignItems: "center", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            📄 Step 1: Download the Form
          </h2>
          <p>Please download the official IRS Form 8821 using the link below:</p>
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
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#0b1a4a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#0f2c76")}
          >
            📥 Download Form 8821
          </a>
        </div>

        {/* Step 2 */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ display: "flex", alignItems: "center", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            🖊️ Step 2: Sign the Form
          </h2>
          <p>
            Carefully fill out and sign the form. Ensure all information is{" "}
            <b>accurate and complete</b>. Inaccurate forms may delay processing.
          </p>
        </div>

        {/* Step 3 */}
        <div>
          <h2 style={{ display: "flex", alignItems: "center", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            📤 Step 3: Submit via TaxDome
          </h2>
          <p>Once signed, please submit the form securely through our TaxDome portal:</p>
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
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#c0b23f")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ddc946")}
          >
            🚀 Submit on TaxDome
          </a>
        </div>
      </div>
    </div>
  );
}
