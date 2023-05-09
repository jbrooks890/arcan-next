import { useDBMaster } from "../contexts/DBContext";
import { useDBDraft } from "../contexts/DBDraftContext";
import Accordion from "./Accordion";

type Props = {
  dataObj: object;
  omit?: string[];
  ancestors?: string[];
} & Passthrough;

export default function Cascade({
  dataObj,
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

          // ---------- RENDER ENTRY ----------
          const renderEntry = () => {
            const type = typeof value;
            return value === null || value === undefined ? (
              <span className="fade">no entry</span>
            ) : (
              String(value)
            );
          };

          return (
            <li key={i} className={!isObject ? "flex" : "block"}>
              {isObject ? (
                <Accordion
                  field={key}
                  list={buildList(value, [...ancestors, key])}
                  mode={Object.keys(value).length < 6}
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
      {buildList(dataObj, ancestors)}
    </div>
  );
}
