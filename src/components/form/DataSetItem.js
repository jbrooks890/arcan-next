import { useEffect, useRef, useState } from "react";

const DataSetItem = ({
  option,

  secondaries,
  field,
  multi,
  checked,
  handleChange,
  setRef,
}) => {
  const [open, setOpen] = useState(false);
  const drawer = useRef();

  // useEffect(() => console.log({ checked }), []);

  return (
    <div className="wrapper">
      <div
        className={`entry-header flex middle ${open ? "open" : "closed"}`}
        onClick={() => setOpen(prev => !prev)}
      >
        <label htmlFor={option} className="flex middle">
          <input
            ref={element => setRef(element)}
            id={option}
            name={field}
            type={multi ? "checkbox" : "radio"}
            value={option}
            checked={checked}
            onChange={handleChange}
          />
          <div className={`ticker ${multi ? "checkbox" : "radio"}`} />
          <span>{option}</span>
        </label>
        <button className="arrow" onClick={() => setOpen(prev => !prev)} />
      </div>
      <div
        ref={drawer}
        className={`drawer ${open ? "open" : "closed"}`}
        style={{ maxHeight: open && drawer.current.scrollHeight + "px" }}
      >
        {secondaries}
      </div>
    </div>
  );
};

export default DataSetItem;
