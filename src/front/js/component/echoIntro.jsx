import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

// First-login onboarding, in E.C.H.O.'s voice (the oldest open playtest
// note: a new player lands in the game cold). Auto-opens once for a
// fresh account (nothing accomplished yet + never dismissed on this
// browser), replayable anytime from the 🤖 chip in the header. Purely
// client-side: dismissal is a localStorage flag, no server state.
const SEEN_KEY = "echo_intro_seen";

const STEPS = [
  {
    title: "🤖 E.C.H.O. — boot complete",
    text:
      "Systems check: you're awake, the pod is scrap, and the twin suns " +
      "are already too hot. Good morning, Jahntow. I'm E.C.H.O. — " +
      "navigator, quartermaster, and the only one on Zephyr who reads " +
      "the manuals. This console is how we fight a war. I'll keep it " +
      "honest if you keep it charged.",
  },
  {
    title: "🎯 Missions pay the bills",
    text:
      "Region operations earn credits and experience. Every card shows " +
      "your real odds and what failure costs BEFORE you commit — I " +
      "compute them, you gamble them. Equipment is survival gear; " +
      "supplies are fuel, burned every attempt. Run what you can " +
      "afford to lose.",
  },
  {
    title: "📖 The Story is the war",
    text:
      "Vortex Corp holds this planet and the tribes won't free it " +
      "divided. Story missions carry the plot: they open new regions, " +
      "win you allies, and sometimes ask you to choose. Choices are " +
      "permanent. I archive everything — the story remembers.",
  },
  {
    title: "📈 The Market moves while you sleep",
    text:
      "Buy low, watch the feed for spikes and crashes, sell into the " +
      "surge. Your Positions tab tracks what you paid against what it's " +
      "worth right now. Later, tribal warbands and properties will earn " +
      "while you're away — everything on this planet compounds.",
  },
  {
    title: "🧭 Last notes from the manual",
    text:
      "Energy and health recover on their own; the Medlab hurries it " +
      "for credits. Daily contracts under Goals pay you for what you'd " +
      "do anyway. That's the briefing. The desert doesn't wait, and " +
      "neither do I — let's get to work.",
  },
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

const cardStyle = {
  maxWidth: "34rem",
  width: "100%",
  padding: "1.25rem",
};

const EchoIntro = ({ open, setOpen }) => {
  const { store } = useContext(Context);
  const { player } = store;
  const [step, setStep] = useState(0);

  // Auto-open exactly once, for accounts that haven't done anything yet.
  useEffect(() => {
    const fresh =
      (player.stats?.missions_won || 0) === 0 && (player.storyWins || 0) === 0;
    if (!localStorage.getItem(SEEN_KEY) && fresh) {
      setOpen(true);
    }
  }, [player.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  if (!open) return null;

  const close = () => {
    localStorage.setItem(SEEN_KEY, "1");
    setOpen(false);
  };
  const last = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <div style={overlayStyle} onClick={close}>
      <div
        className="holo echo-intro"
        style={cardStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <h4>{current.title}</h4>
        <p>{current.text}</p>
        <div className="d-flex justify-content-between align-items-center">
          <span className="tx-info small">
            {step + 1}/{STEPS.length}
          </span>
          <span>
            {!last && (
              <button className="me-2" onClick={close}>
                Skip
              </button>
            )}
            <button
              className="btn-buy"
              onClick={() => (last ? close() : setStep(step + 1))}
            >
              {last ? "Let's get to work" : "Next"}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default EchoIntro;
