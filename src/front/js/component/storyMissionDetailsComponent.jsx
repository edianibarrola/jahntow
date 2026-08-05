import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

// Mirrors STORY_WINS_PER_UNLOCK in src/api/game_routes.py; the arc is
// authored 5 beats per chapter to match (see storyArc.js).
const BEATS_PER_CHAPTER = 5;

// First sentence of a beat, for "Previously..." recaps. Falls back to the
// whole message if it somehow has no sentence-ending punctuation.
const firstSentence = (text) => {
  const match = text.match(/^.*?[.!?]["']?(?=\s|$)/);
  return match ? match[0] : text;
};

// The chapter (story-mission) name a beat belongs to, from the catalog
// key order - beat 210 is the coda and has no chapter.
const chapterNameFor = (beatIndex, chapterNames) =>
  chapterNames[Math.floor(beatIndex / BEATS_PER_CHAPTER)] || null;

// A choice's epilogue line for this beat, if the player has made the
// matching choice. The story remembers what you chose.
const callbackLineFor = (beatIndex, choiceCallbacks, storyChoices) => {
  const callback = choiceCallbacks[beatIndex];
  if (!callback) return null;
  const picked = (storyChoices || {})[callback.choice];
  return picked ? callback.lines[picked] || null : null;
};

// One rendered beat: title, prose, and any remembered-choice epilogue.
const Beat = ({ beat, beatIndex, choiceCallbacks, storyChoices, dimmed }) => {
  const callbackLine = callbackLineFor(beatIndex, choiceCallbacks, storyChoices);
  return (
    <div className={`story-beat${dimmed ? " story-beat-past" : ""}`}>
      <h5 className="story-beat-title">{beat.Title}</h5>
      <p className="m-0">{beat.Message}</p>
      {callbackLine && <p className="story-callback m-0">{callbackLine}</p>}
    </div>
  );
};

const StoryMissionDetailsComponent = () => {
  const { store } = useContext(Context);
  const {
    player,
    storyMissionArc,
    charactersImages,
    characterLore,
    choiceCallbacks,
    gameData,
  } = store;
  const [openDossier, setOpenDossier] = useState(null);

  // One beat per win, in order: winning the current story mission reveals
  // the next part of its story. That correspondence is the whole point of
  // the arc, so the beats advance with storyWins rather than being dumped
  // out a chapter at a time. This only stays aligned because
  // STORY_WINS_PER_UNLOCK matches the beats authored per chapter - see the
  // note on that constant in src/api/game_routes.py.
  const arc = Object.values(storyMissionArc);
  if (!arc.length) return null;
  const beatIndex = Math.min(player.storyWins, arc.length - 1);
  const currentBeat = arc[beatIndex];

  const chapterNames = Object.keys(gameData.storyMissions || {});
  const catalog = gameData.storyMissions || {};
  const chapterStart =
    Math.floor(beatIndex / BEATS_PER_CHAPTER) * BEATS_PER_CHAPTER;
  const isCoda = beatIndex === arc.length - 1 && arc.length % BEATS_PER_CHAPTER === 1;
  const currentChapterName = isCoda ? null : chapterNameFor(beatIndex, chapterNames);
  const currentFaction = currentChapterName
    ? catalog[currentChapterName]?.Faction
    : null;

  // Everything revealed so far, split into finished chapters (the journal)
  // and the chapter in progress (the open scene).
  const sceneStart = isCoda ? beatIndex : chapterStart;
  const sceneBeats = arc
    .slice(sceneStart, beatIndex + 1)
    .map((beat, offset) => [sceneStart + offset, beat]);
  const journalChapters = [];
  for (let start = 0; start < sceneStart; start += BEATS_PER_CHAPTER) {
    const name = chapterNameFor(start, chapterNames);
    journalChapters.push({
      name,
      faction: catalog[name]?.Faction,
      beats: arc
        .slice(start, Math.min(start + BEATS_PER_CHAPTER, sceneStart))
        .map((beat, offset) => [start + offset, beat]),
    });
  }

  // "Previously..." - the last line of story before this chapter began.
  const previousBeat = sceneStart > 0 ? arc[sceneStart - 1] : null;

  // Everyone in the latest beat is tappable; portraits where we have
  // them (jahntow and emeraldMage currently don't), name chips otherwise.
  const dossier = openDossier ? characterLore[openDossier] : null;

  return (
    <div className="col-12">
      {journalChapters.length > 0 && (
        <details className="holo story-journal mb-3 p-3">
          <summary className="story-journal-summary">
            📜 The story so far ({journalChapters.length}{" "}
            {journalChapters.length === 1 ? "chapter" : "chapters"})
          </summary>
          {journalChapters.map((chapter) => (
            <details className="story-journal-chapter" key={chapter.name}>
              <summary>
                {chapter.name}
                {chapter.faction && chapter.faction !== "United Front" && (
                  <span className="tx-rep"> · {chapter.faction}</span>
                )}
              </summary>
              {chapter.beats.map(([index, beat]) => (
                <Beat
                  key={index}
                  beat={beat}
                  beatIndex={index}
                  choiceCallbacks={choiceCallbacks}
                  storyChoices={player.storyChoices}
                  dimmed
                />
              ))}
            </details>
          ))}
        </details>
      )}

      <div className="holo story-scene mb-4 p-3 border rounded">
        {currentChapterName && (
          <div className="text-center mb-1">
            <span className="story-chapter-tag">
              Chapter {Math.floor(beatIndex / BEATS_PER_CHAPTER) + 1}:{" "}
              {currentChapterName}
              {currentFaction && ` · ${currentFaction}`}
            </span>
          </div>
        )}
        {previousBeat && (
          <p className="story-previously text-center">
            Previously: {firstSentence(previousBeat.Message)}
          </p>
        )}

        <div className="flex-row-custom m-0 justify-content-center">
          {currentBeat.Characters.filter(
            (character) => charactersImages[character]
          ).map((character) => (
            <button
              type="button"
              className="char-portrait-btn m-0 p-0"
              key={character}
              onClick={() =>
                setOpenDossier(openDossier === character ? null : character)
              }
              title={characterLore[character]?.name || character}
            >
              <img
                src={charactersImages[character]}
                alt={characterLore[character]?.name || character}
                className={`img-contain${
                  openDossier === character ? " char-portrait-active" : ""
                }`}
                style={{ maxWidth: "20vw" }}
              />
            </button>
          ))}
        </div>
        <div className="text-center">
          {currentBeat.Characters.filter((character) => characterLore[character]).map(
            (character) => (
              <button
                type="button"
                className={`char-chip${
                  openDossier === character ? " char-chip-active" : ""
                }`}
                key={character}
                onClick={() =>
                  setOpenDossier(openDossier === character ? null : character)
                }
              >
                {characterLore[character].name}
              </button>
            )
          )}
        </div>

        {dossier && (
          <div className="dossier-card mt-2 p-2">
            <p className="m-0">
              <strong>{dossier.name}</strong>
              <span className="tx-info"> — {dossier.epithet}</span>
              <span className="tx-rep"> · {dossier.faction}</span>
            </p>
            <p className="m-0 mt-1">{dossier.bio}</p>
          </div>
        )}

        {sceneBeats.map(([index, beat]) => (
          <Beat
            key={index}
            beat={beat}
            beatIndex={index}
            choiceCallbacks={choiceCallbacks}
            storyChoices={player.storyChoices}
            dimmed={index !== beatIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default StoryMissionDetailsComponent;
