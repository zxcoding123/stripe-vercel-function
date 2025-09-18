useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get("session_id");

  if (sessionId) {
    fetch("/api/create-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.verificationUrl) {
          window.location.href = data.verificationUrl; // send to Stripe verification
        } else {
          console.error("Verification link missing", data);
        }
      });
  }
}, []);
