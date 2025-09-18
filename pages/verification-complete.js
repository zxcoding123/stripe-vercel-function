// /pages/verification-complete.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function VerificationComplete() {
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkVerificationStatus = async () => {
      const { verification_session } = router.query;

      if (!verification_session) {
        setStatus('error');
        setMessage('No verification session found in URL');
        return;
      }

      try {
        // Call the API route that retrieves the real verification session status
        const response = await fetch(`/api/check-verification?session_id=${verification_session}`);
        const data = await response.json();

        if (data.status === 'verified') {
          setStatus('success');
          setMessage('Your identity has been successfully verified!');
        } else if (data.status === 'requires_input') {
          setStatus('pending');
          setMessage('Additional information required. Please check your email for instructions.');
        } else if (data.status === 'processing') {
          setStatus('pending');
          setMessage('Your verification is being processed...');
        } else if (data.status === 'canceled') {
          setStatus('error');
          setMessage('Verification was canceled.');
        } else {
          setStatus('pending');
          setMessage(`Status: ${data.status}`);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Error checking verification status');
      }
    };

    if (router.isReady) {
      checkVerificationStatus();
    }
  }, [router.isReady, router.query]);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Verification Complete</h1>

      {status === 'loading' && <p>Checking verification status...</p>}

      {status === 'success' && (
        <div style={{ color: 'green', padding: '1rem', border: '1px solid green', borderRadius: '4px' }}>
          <h3>✅ Success!</h3>
          <p>{message}</p>
        </div>
      )}

      {status === 'pending' && (
        <div style={{ color: 'orange', padding: '1rem', border: '1px solid orange', borderRadius: '4px' }}>
          <h3>⏳ Processing</h3>
          <p>{message}</p>
        </div>
      )}

      {status === 'error' && (
        <div style={{ color: 'red', padding: '1rem', border: '1px solid red', borderRadius: '4px' }}>
          <h3>❌ Error</h3>
          <p>{message}</p>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={() => router.push('/')}
          style={{ padding: '0.5rem 1rem', fontSize: '1rem', cursor: 'pointer' }}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
