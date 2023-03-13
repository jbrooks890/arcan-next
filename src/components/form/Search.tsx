import "../../styles/form/Search.css";

type PropsType = {
  handleChange?: Function;
  [key: string]: any;
};

export default function Search({ handleChange, ...props }: PropsType) {
  return (
    <div
      className={`search-bar flex middle ${props.className ?? ""}`}
      {...props}
    >
      <div className="search-icon flex middle">
        <svg>
          <use href="#search-icon" />
        </svg>
      </div>
      <input placeholder="Search" size={1} />
    </div>
  );
}
