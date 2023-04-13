// import apiUrl from "config";

export const fetchArcanData = async () => {
  const response = await fetch("http://localhost:3005/api/models");

  if (!response.ok) throw new Error("failed to fetch data");
  return response.json();
};

export const getChapterContent = async (url: string) => {
  const res = await fetch(
    "http://localhost:3005/api/Section/6413cd759d213b5e2ac9cbcf"
  );
};
