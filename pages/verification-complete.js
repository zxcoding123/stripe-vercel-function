import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function VerificationComplete() {
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(null);

  const redirectTimerRef = useRef(null);
  const fetchControllerRef = useRef(null);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      const { verification_session, product } = router.query;

      if (!verification_session) {
        setStatus("error");
        setMessage("No verification session found in the URL.");
        return;
      }

      const controller = new AbortController();
      fetchControllerRef.current = controller;

      try {
        const response = await fetch(
          `/api/check-verification?verification_session=${encodeURIComponent(
            verification_session
          )}`,
          { signal: controller.signal }
        );
        const data = await response.json();

        if (data.status === "verified") {
          setStatus("success");
          setMessage("Your identity has been successfully verified!");

          const redirectUrl = `/form-instructions?product=${encodeURIComponent(
            product || data.product || ""
          )}`;

          setCountdown(5);
          redirectTimerRef.current = setInterval(() => {
            setCountdown((prev) => {
              if (prev === null) return null;
              if (prev <= 1) {
                clearInterval(redirectTimerRef.current);
                redirectTimerRef.current = null;
                window.location.href = redirectUrl;
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else if (data.status === "requires_input") {
          setStatus("pending");
          setMessage("Additional information required. Please check your email.");
        } else if (data.status === "processing") {
          setStatus("pending");
          setMessage("Your verification is being processed...");
        } else if (data.status === "canceled") {
          setStatus("error");
          setMessage("Verification was canceled.");
        } else {
          setStatus("pending");
          setMessage(`Status: ${String(data.status)}`);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Verification check failed:", err);
          setStatus("error");
          setMessage("Error checking verification status. Please try again later.");
        }
      }
    };

    if (router.isReady) {
      checkVerificationStatus();
    }

    return () => {
      if (fetchControllerRef.current) fetchControllerRef.current.abort();
      if (redirectTimerRef.current) clearInterval(redirectTimerRef.current);
    };
  }, [router.isReady, router.query]);

  const cardStyle = {
    padding: "1.5rem",
    borderRadius: "12px",
    marginTop: "1rem",
    background: "#ffffff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };

  return (
    <div style={{
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
    }}>
      <Image src="/gtr_logo.png" alt="GetTaxRelief Logo" width={150} height={50} style={{ marginBottom: "2rem" }} priority />
      <h1 style={{ color: "#ddc946", marginBottom: "1.5rem" }}>Verification Status</h1>

      {status === "loading" && <p>Checking verification status...</p>}
      {status === "success" && (
        <div style={{ ...cardStyle, border: "2px solid #0f2c76", color: "#0f2c76", maxWidth: "500px" }}>
          <h3>✅ Success!</h3>
          <p>{message}</p>
          {typeof countdown === "number" && <p style={{ marginTop: "1rem", fontSize: "0.95rem", color: "#666" }}>
            Redirecting you in {countdown} second{countdown === 1 ? "" : "s"}...
          </p>}
        </div>
      )}
      {status === "pending" && (
        <div style={{ ...cardStyle, border: "2px solid #ddc946", color: "#ddc946", maxWidth: "500px" }}>
          <h3>⏳ Processing</h3>
          <p>{message}</p>
        </div>
      )}
      {status === "error" && (
        <div style={{ ...cardStyle, border: "2px solid red", color: "red", maxWidth: "500px" }}>
          <h3>❌ Error</h3>
          <p>{message}</p>
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <button onClick={() => window.location.href = "https://www.gettaxreliefnow.com"} style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          cursor: "pointer",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#ddc946",
          color: "#0f2c76",
          fontWeight: "bold",
          transition: "all 0.3s ease",
        }}>Return to Home</button>
      </div>
    </div>
  );
}
