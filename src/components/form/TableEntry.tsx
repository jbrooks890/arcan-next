import { ReactElement, useRef, useState } from "react";
import { useDBMaster } from "../contexts/DBContext";
import { useDBDraft } from "../contexts/DBDraftContext";

type PropsType = {
  entry: object;
  headers: string[];
  index: string | number;
  ancestors: string[];
  children: ReactElement | ReactElement[];
};

export default function TableEntry({
  entry,
  headers,
  index,
  ancestors,
  children,
}: PropsType) {
  const [open, setOpen] = useState(false);
  const { getPathData } = useDBDraft();
  const { arcanData } = useDBMaster();
  const { references } = arcanData;
  const dataList = useRef<HTMLTableRowElement | null>(null);

  // console.log({ children });

  // ---------| TOGGLE |---------

  const toggle = () => setOpen(prev => !prev);

  // ---------| RENDER ENTRY |---------

  const renderEntry = (ancestors: string[]) => {
    const pathData = getPathData(ancestors);
    const { instance, options } = pathData;
    const display = entry[ancestors.pop() ?? 0];
    const isArray = Array.isArray(display);

    // instance === "ObjectID" && console.log({ display, instance });

    let render = display;

    if (typeof display === "object") {
      render = Object.values(display).filter(Boolean).join(", ");
      // console.log({ display, render });
    }
    if (isArray) render = `[ ${display.length} ]`;

    if (instance === "ObjectID") {
      const ref = options?.ref ?? options?.refPath;
      // console.log({ ref, [display]: references[ref][display] });

      return <span data-oid={display}>{references[ref][display]}</span>;
    }

    return String(render);
  };

  return (
    <>
      <tr onClick={toggle}>
        {
          <td className="entry-index ">
            {/* <input type="checkbox" className="entry-selector" /> */}
            {index}
          </td>
        }
        {headers.map((field, i) => (
          <td key={i}>{renderEntry([...ancestors, field])}</td>
        ))}
      </tr>

      {children && (
        <tr
          ref={dataList}
          className={`data-list ${open ? "open" : "closed"}`}
          style={{
            maxHeight: open ? dataList.current?.scrollHeight + "px" : undefined,
          }}
        >
          <td colSpan={headers.length}>{children}</td>
        </tr>
      )}
    </>
  );
}
