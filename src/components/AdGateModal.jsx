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

  const [adClicked, setAdClicked] = useState(false);

  const handleOpenAd = () => {
    // Open the HilltopAds Direct Link
    window.open('https://fluffy-machine.com/bt3.VB0EPZ3/pVvEbzmmVoJCZCDQ0o2mOVTHkL2FNxzBAd5aLBTZYU5/OMTOY/3/M_T/Mn', '_blank');
    setAdClicked(true);
  };

  const handleContinue = async () => {
    if (!canContinue || !adClicked) return;
    setBusy(true);
    try {
      await onComplete?.();
      onHide?.();
    } finally {
      setBusy(false);
      setAdClicked(false);
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
          {adClicked 
            ? "Verification complete! You can now start your download below." 
            : "Complete the security step below to generate your high-speed download link."}
        </p>

        <div className="ad-slot rounded-4 border bg-black d-flex align-items-center justify-content-center mb-4 shadow-inner" style={{cursor: 'pointer'}} onClick={!adClicked ? handleOpenAd : undefined}>
          <div className="text-center px-3 py-5">
            {adClicked ? (
              <>
                <div className="text-success display-4 mb-2">
                   <i className="bi bi-patch-check-fill"></i>
                </div>
                <div className="text-white fw-bold mb-1 fs-5">Link Generated Successfully!</div>
                <div className="text-success-50 small">Click the red button below to start.</div>
              </>
            ) : (
              <>
                <div className="text-white opacity-25 display-4 mb-2">
                   <i className="bi bi-shield-lock"></i>
                </div>
                <div className="text-white fw-bold mb-1 fs-5">Click Here to Unlock Link</div>
                <div className="text-white-50 small">
                  Analyze connection & bypass bot protection
                </div>
              </>
            )}
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
          <div className="small fw-semibold">
            {secondsLeft > 0 ? (
              <span className="text-secondary">
                Wait <strong>{secondsLeft}s</strong>…
              </span>
            ) : adClicked ? (
              <span className="text-success">
                <i className="bi bi-check-circle-fill me-2"></i>Verified & Ready.
              </span>
            ) : (
              <span className="text-warning">
                <i className="bi bi-info-circle-fill me-2"></i>Complete step above.
              </span>
            )}
          </div>

          {!adClicked ? (
            <Button
              variant="primary"
              className="btn-primary-blue px-5 fw-bold"
              onClick={handleOpenAd}
              disabled={secondsLeft > 0}
            >
              Unlock Download Link
            </Button>
          ) : (
            <Button
              variant="danger"
              className="btn-primary-red px-5 fw-bold"
              onClick={handleContinue}
              disabled={!canContinue || busy}
            >
              {busy ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" /> Starting...
                </>
              ) : (
                'Start Download Now'
              )}
            </Button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
