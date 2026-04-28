import React, { useEffect, useMemo, useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';

const DEFAULT_WAIT_SECONDS = 6;

export default function AdGateModal({
  show,
  onHide,
  onComplete,
  movieTitle,
  waitSeconds = DEFAULT_WAIT_SECONDS,
}) {
  const [secondsLeft, setSecondsLeft] = useState(waitSeconds);
  const [busy, setBusy] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
  }, [show]);

  const canContinue = secondsLeft <= 0 && !busy;

  const title = useMemo(() => movieTitle || 'your movie', [movieTitle]);

  useEffect(() => {
    if (!show) return;
    setSecondsLeft(waitSeconds);
    setBusy(false);
  }, [show, waitSeconds]);

  useEffect(() => {
    if (!show) return;
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [show, secondsLeft]);

  const handleContinue = async () => {
    if (!canContinue) return;
    
    // Open the HilltopAds Direct Link in a new tab
    window.open('https://fluffy-machine.com/bt3.VB0EPZ3/pVvEbzmmVoJCZCDQ0o2mOVTHkL2FNxzBAd5aLBTZYU5/OMTOY/3/M_T/Mn', '_blank');

    setBusy(true);
    try {
      await onComplete?.();
      onHide?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={busy ? undefined : onHide}
      centered
      size="lg"
      contentClassName="border-0 overflow-hidden glass-card"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <Modal.Header closeButton closeVariant={theme === 'dark' ? 'white' : undefined} className="border-0">
        <Modal.Title className="fs-5 fw-bold">Download Authentication</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <p className="mb-2">
          Verify your request to unlock <strong>{title}</strong>.
        </p>
        <p className="text-secondary small mb-4">
          This secure gate ensures the safety of our drive vault. The download button will activate after the cooldown.
        </p>

        <div className="ad-slot rounded-4 border bg-black d-flex align-items-center justify-content-center mb-4 shadow-inner">
          <div className="text-center px-3 py-5">
            <div className="text-white opacity-25 display-4 mb-2">
               <i className="bi bi-shield-lock"></i>
            </div>
            <div className="text-white fw-bold mb-1 fs-5">Security Check in Progress</div>
            <div className="text-white-50 small">
              Analyzing connection security...
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
          <div className="small fw-semibold">
            {secondsLeft > 0 ? (
              <span className="text-secondary">
                Verifying in 1, <strong>{secondsLeft}s</strong>…
              </span>
            ) : (
              <span className="text-success">
                <i className="bi bi-check-circle-fill me-2"></i>Verified. Safe to proceed.
              </span>
            )}
          </div>

          <Button
            variant="danger"
            className="btn-primary-red px-5 fw-bold"
            onClick={handleContinue}
            disabled={!canContinue}
          >
            {busy ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" /> Unlocking...
              </>
            ) : (
              'Get My Movie'
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
