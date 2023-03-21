import styles from "@/styles/reader/Contents.module.scss";

export default function Contents({ content }: { content?: string }) {
  const CHAPTERS =
    "Turbulent Calm; Corruption; Living Darkness; Faces of Truth; The Company Kept; Scheme of the Wicked; Pursuit; Nexus Advent; Closed Eyes Open; The Descended; Trouble In Paradise; The Powers That Be; The Deadwoods; The Wick; Rough Acquaintances; Unshadowed; Restless Outsiders; Obstruction & Injustice; Inky Truth; Under the Black Sun; The Red Dragon; Seized Souls; Revenant; Near & Far".split(
      "; "
    );

  const _UNAVAILABLE = Math.floor(Math.random() * CHAPTERS.length);
  console.log({ _UNAVAILABLE });

  return (
    <div className={`${styles.wrapper} contents`}>
      <h3>Contents</h3>
      <div className={`${styles.cache} content-cache flex col`}>
        {CHAPTERS.map((chapter, i) => {
          const _PROGRESS = Math.floor(Math.random() * 100) + 1;
          return (
            <button
              key={i}
              className={`${styles.button} ${
                i > _UNAVAILABLE
                  ? "unavailable"
                  : _PROGRESS <= 0
                  ? "not-started"
                  : _PROGRESS >= 100
                  ? "complete"
                  : "in-progress"
              } `}
              data-chapter-progress={_PROGRESS}
              tabIndex={0}
            >
              {chapter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
