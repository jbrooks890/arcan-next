export default function Criteria({
  content,
  show,
}: {
  content: string | string[];
  show: boolean;
}) {
  return <div className={`criteria ${show ? "show" : "hide"}`}>{content}</div>;
}
