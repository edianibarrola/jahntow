import React, { useEffect, useState } from "react";

// The staged mission reveal (playtest: "click a button, get an instant
// outcome - the start messages never show, it's not very game-like").
// The server still resolves instantly and authoritatively; flux holds
// the result for MISSION_THEATER_MS while this overlay plays the
// authored start message and an E.C.H.O. progress beat, then reveals
// the outcome. Pure theater - no game state lives here.

const PROGRESS_LINES = [
  "E.C.H.O.: Tracking your beacon. Comms steady.",
  "E.C.H.O.: Contact. Holding my commentary until you're clear.",
  "E.C.H.O.: Dust on the horizon. That's either weather or trouble.",
  "E.C.H.O.: Reading elevated heart rate. Yours, not mine.",
  "E.C.H.O.: Signal's rough out there. Recalculating odds… done. Not telling.",
  "E.C.H.O.: The desert is watching. So am I.",
];

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 8, 16, 0.8)",
  zIndex: 2000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
};

const cardStyle = { maxWidth: "34rem", width: "100%", padding: "1.25rem" };

const hashOf = (text) =>
  [...(text || "")].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);

const MissionTheater = ({ run, onClose }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!run) return undefined;
    setPhase(0);
    const beat = setTimeout(() => setPhase(1), 1100);
    return () => clearTimeout(beat);
  }, [run?.startedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!run) return null;
  const outcome = run.outcome;
  const progressLine =
    PROGRESS_LINES[Math.abs(hashOf(run.name)) % PROGRESS_LINES.length];

  return (
    <div style={overlayStyle} onClick={() => outcome && onClose()}>
      <div
        className="holo mission-theater"
        style={cardStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <h5>
          {run.name}
          {run.repeat > 1 ? ` ×${run.repeat}` : ""}
        </h5>
        {!outcome ? (
          <>
            <p>{run.startMessage || "E.C.H.O.: Underway. Stay sharp."}</p>
            {phase >= 1 && <p className="tx-info">{progressLine}</p>}
            <p className="tx-info small m-0">▸ mission in progress…</p>
          </>
        ) : (
          <>
            <h4 className={outcome.success ? "tx-sell" : "tx-error"}>
              {run.repeat > 1
                ? "📋 Mission report"
                : outcome.success
                ? "✅ Success"
                : "❌ Failed"}
            </h4>
            <p style={{ whiteSpace: "pre-wrap" }}>{outcome.message}</p>
            <div className="text-end">
              <button className="btn-buy" onClick={onClose}>
                Continue
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MissionTheater;
