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
      contentClassName="bg-dark border-0 overflow-hidden"
    >
      <Modal.Header closeButton closeVariant="white" className="border-0">
        <Modal.Title className="text-white fs-5">One short ad to download</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <p className="text-white mb-2">
          Please watch the ad to unlock the download for <strong>{title}</strong>.
        </p>
        <p className="text-muted small mb-3">
          This helps keep the site running. After the timer ends, you can continue.
        </p>

        <div className="ad-slot rounded-3 border border-secondary-subtle bg-black d-flex align-items-center justify-content-center mb-3">
          <div className="text-center px-3">
            <div className="text-white fw-bold mb-1">Ad Space</div>
            <div className="text-muted small">
              Put your ad code here (AdSense / interstitial / video ad).
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
          <div className="text-muted small">
            {secondsLeft > 0 ? (
              <>
                Unlocking in <strong>{secondsLeft}s</strong>…
              </>
            ) : (
              <>
                <strong>Unlocked.</strong> You can continue.
              </>
            )}
          </div>

          <Button
            variant="danger"
            className="btn-primary-red px-4 fw-bold"
            onClick={handleContinue}
            disabled={!canContinue}
          >
            {busy ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" /> Preparing…
              </>
            ) : (
              'Continue to download'
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

