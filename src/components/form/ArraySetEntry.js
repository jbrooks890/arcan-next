import { useState } from "react";
import Cascade from "./Cascade";

const ArraySetEntry = ({ obj, ancestry }) => {
  const [expanded, setExpanded] = useState(false);

  // console.log({ obj });
  return (
    <div className={`array-set-entry flex col`}>
      <Cascade dataObj={obj} ancestry={ancestry} />
      <div className="flex">
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  );
};

export default ArraySetEntry;
