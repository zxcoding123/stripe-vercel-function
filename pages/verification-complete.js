import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

/*
  VerificationComplete
  - Shows the logo always at the top
  - Checks verification session status via /api/check-verification
  - Displays loading / success / pending / error cards using the GTR color palette
  - When verified: shows a countdown (5..4..3..) and redirects to target URL
  - Uses AbortController to cancel the fetch if the component unmounts
  - Cleans up timers to avoid leaks
*/
export default function VerificationComplete() {
  const router = useRouter();

  // --- UI / flow state ---
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "pending" | "error"
  const [message, setMessage] = useState(""); // descriptive message to show in the card
  const [countdown, setCountdown] = useState(null); // number of seconds left for redirect (null = no redirect active)

  // refs for cleaning timeouts/intervals and fetch aborting
  const redirectTimerRef = useRef(null);
  const fetchControllerRef = useRef(null);

  useEffect(() => {
    // 1) Load Google font dynamically (Playfair Display)
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // 2) Function to check verification status from backend
    const checkVerificationStatus = async () => {
      // verification_session is expected as a query param in the URL
      const { verification_session } = router.query;

      if (!verification_session) {
        // If not present, immediately show an error state
        setStatus("error");
        setMessage("No verification session found in the URL.");
        return;
      }

      // Create an AbortController so we can cancel the fetch if user navigates away
      const controller = new AbortController();
      fetchControllerRef.current = controller;

      try {
        // Call your server-side endpoint (server should securely call Stripe)
        const response = await fetch(
          `/api/check-verification?session_id=${encodeURIComponent(
            verification_session
          )}`,
          { signal: controller.signal }
        );

        // If the endpoint returns non-JSON or an error, this may throw; handle gracefully
        const data = await response.json();

        // Handle the verification result statuses from your server
        if (data.status === "verified") {
          setStatus("success");
          setMessage("Your identity has been successfully verified!");

          // Start a visible countdown (5 seconds) and redirect when it hits 0.
          // Using setInterval + functional state update to avoid stale closures.
          const redirectUrl = "https://www.gettaxreliefnow.com/";
          setCountdown(5); // UI shows 5 -> 4 -> 3 -> 2 -> 1 -> 0

          redirectTimerRef.current = setInterval(() => {
            setCountdown((prev) => {
              if (prev === null) return null;
              if (prev <= 1) {
                // final step: clear interval and redirect
                clearInterval(redirectTimerRef.current);
                redirectTimerRef.current = null;
                // perform redirect
                window.location.href = redirectUrl;
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else if (data.status === "requires_input") {
          // Example: identity needs more documents from user
          setStatus("pending");
          setMessage(
            "Additional information required. Please check your email for instructions."
          );
        } else if (data.status === "processing") {
          // Example: still being reviewed
          setStatus("pending");
          setMessage("Your verification is being processed...");
        } else if (data.status === "canceled") {
          setStatus("error");
          setMessage("Verification was canceled.");
        } else {
          // catch-all for unrecognized statuses
          setStatus("pending");
          setMessage(`Status: ${String(data.status)}`);
        }
      } catch (err) {
        // Distinguish between AbortError (ignored) and other errors (show to user)
        if (err.name === "AbortError") {
          // fetch was aborted (component unmounted or effect cleaned up) – no UI change needed
          return;
        }
        console.error("Verification check failed:", err);
        setStatus("error");
        setMessage("Error checking verification status. Please try again later.");
      }
    };

    // Wait for Next.js router to be ready so router.query exists
    if (router.isReady) {
      checkVerificationStatus();
    }

    // Cleanup on unmount or when dependencies change:
    return () => {
      // Abort the in-flight fetch if any
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
        fetchControllerRef.current = null;
      }
      // Clear redirect timer/interval if active
      if (redirectTimerRef.current) {
        clearInterval(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
      // Optionally remove the injected font link (omitted here — fonts are fine to leave)
    };
  }, [router.isReady, router.query]);

  // Reusable card style (white card) — colors applied per status where needed
  const cardStyle = {
    padding: "1.5rem",
    borderRadius: "12px",
    marginTop: "1rem",
    background: "#ffffff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };

  // ---------- JSX ----------
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // content vertically centered
        alignItems: "center",
        backgroundColor: "#0f2c76", // deep blue background
        color: "#ffffff",
        fontFamily: "'Playfair Display', serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      {/* Logo: always shown at the top of the page.
          Put a file named /public/gtr_logo.png in your Next.js project.
          next/image optimizes delivery automatically in supported environments. */}
      <Image
        src="/gtr_logo.png"
        alt="GetTaxRelief Logo"
        width={150}
        height={50}
        style={{ marginBottom: "2rem" }}
        priority // optional: hint to preload the image for fastest display
      />

      <h1 style={{ color: "#ddc946", marginBottom: "1.5rem" }}>Verification Status</h1>

      {/* Loading */}
      {status === "loading" && <p>Checking verification status...</p>}

      {/* Success */}
      {status === "success" && (
        <div
          style={{
            ...cardStyle,
            border: "2px solid #0f2c76", // blue border on success card
            color: "#0f2c76",
            maxWidth: "500px",
          }}
          role="status"
          aria-live="polite"
        >
          <h3>✅ Success!</h3>
          <p>{message}</p>

          {/* Show the active countdown if set */}
          {typeof countdown === "number" && (
            <p style={{ marginTop: "1rem", fontSize: "0.95rem", color: "#666" }}>
              Redirecting you in {countdown} second{countdown === 1 ? "" : "s"}...
            </p>
          )}
        </div>
      )}

      {/* Pending / requires input / processing */}
      {status === "pending" && (
        <div
          style={{
            ...cardStyle,
            border: "2px solid #ddc946",
            color: "#ddc946",
            maxWidth: "500px",
          }}
          role="status"
          aria-live="polite"
        >
          <h3>⏳ Processing</h3>
          <p>{message}</p>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div
          style={{
            ...cardStyle,
            border: "2px solid red",
            color: "red",
            maxWidth: "500px",
          }}
          role="alert"
          aria-live="assertive"
        >
          <h3>❌ Error</h3>
          <p>{message}</p>
        </div>
      )}

      {/* Return button */}
      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={() => (window.location.href = "https://www.gettaxreliefnow.com")}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            cursor: "pointer",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#ddc946",
            color: "#0f2c76",
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#ffffff";
            e.target.style.color = "#0f2c76";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#ddc946";
            e.target.style.color = "#0f2c76";
          }}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
