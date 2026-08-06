import React, { useContext } from "react";
import { Context } from "../store/appContext";

// The collected dossier panel (playtest note: dossiers lived only inside
// story scenes, where they were easy to tap once and never find again).
// Characters appear here as the story introduces them - firstWin is
// authored in CHARACTER_LORE. During a chronicle retelling the cast
// re-introduces itself with the story, same as the regions and tribes.
const CharactersComponent = () => {
  const { store } = useContext(Context);
  const { player, characterLore, charactersImages } = store;

  const cast = Object.entries(characterLore || {}).sort(
    ([, a], [, b]) => (a.firstWin || 0) - (b.firstWin || 0)
  );
  const storyWins = player.storyWins || 0;
  const metCount = cast.filter(([, c]) => storyWins >= (c.firstWin || 0)).length;

  return (
    <div className="row mb-3">
      <div className="row sticky-top holo text-center">
        <div className="col-12 text-center">
          <p>
            Characters{" "}
            <span className="tx-info">
              — the people of Zephyr ({metCount}/{cast.length} met)
            </span>
          </p>
        </div>
      </div>

      {cast.map(([id, character]) => {
        const met = storyWins >= (character.firstWin || 0);
        const image = charactersImages?.[id];
        return (
          <div className="col-12 col-md-6 p-2" key={id}>
            <div
              className={`holo p-3 h-100 ${met ? "" : "achievement-locked"}`}
            >
              <div className="d-flex align-items-center gap-2">
                {met && image ? (
                  <img
                    src={image}
                    alt={character.name}
                    className="warband-captain"
                  />
                ) : (
                  <span style={{ fontSize: "2rem" }}>{met ? "🧑" : "❓"}</span>
                )}
                <div>
                  <strong>{met ? character.name : "Unknown"}</strong>
                  {met && (
                    <div className="tx-info small">
                      {character.epithet} · {character.faction}
                    </div>
                  )}
                </div>
              </div>
              <p className="small mt-2 mb-0">
                {met ? (
                  character.bio
                ) : (
                  <span className="tx-info">
                    The story hasn't introduced this person yet — they enter
                    at {character.firstWin} story wins (you: {storyWins}).
                  </span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CharactersComponent;
