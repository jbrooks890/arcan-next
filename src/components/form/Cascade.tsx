import { useDBMaster } from "../contexts/DBContext";
import { useDBDraft } from "../contexts/DBDraftContext";
import Accordion from "./Accordion";

type Props = {
  source: object;
  omit?: string[];
  ancestors?: string[];
} & Passthrough;

export default function Cascade({
  source,
  omit,
  ancestors = [],
  id,
  className,
}: Props) {
  // :::::::::::::\ BUILD LIST /:::::::::::::

  const buildList = (obj = {}, ancestors = []) => {
    obj = omit?.length
      ? Object.fromEntries(
          Object.entries(obj).filter(([field]) => omit?.includes(field))
        )
      : obj;

    return (
      <ul>
        {Object.entries(obj).map(([key, value], i) => {
          const isObject = typeof value === "object";
          const isArray = Array.isArray(value);
          const isSimple =
            isArray && value.every(entry => typeof entry !== "object");
          isArray && console.log({ key, value });

          // ---------- RENDER ENTRY ----------
          const renderEntry = () => {
            if (value === null || value === undefined)
              return <span className="fade">no entry</span>;

            // const type = typeof value;
            // console.log({ value, type });

            return String(value);
          };

          return (
            <li key={i} className={!isObject ? "flex" : "block"}>
              {isObject ? (
                <Accordion
                  field={key}
                  list={buildList(value, [...ancestors, key])}
                  sum={isSimple ? value.join(", ") : undefined}
                  mode={!isSimple || Object.keys(value).length < 6}
                />
              ) : (
                <>
                  <strong className={isObject ? "flex middle" : ""}>
                    {key}
                  </strong>
                  <span>{renderEntry()}</span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div id={id} className={className}>
      {buildList(source, ancestors)}
    </div>
  );
}
