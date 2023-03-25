import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default function getMarkdown(
  dirName: string,
  hasMeta = false,
  sort = false
) {
  const dir = path.join(process.cwd(), dirName);
  const fileNames = fs.readdirSync(dir);

  const allMDdata = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, "");
    const fullPath = path.join(dir, fileName);
    let content = fs.readFileSync(fullPath, "utf8");

    // if (hasMeta) {
    //   const parsed = matter(contents);
    //   content = { id } as {
    //     id?: string;
    //     title?: string;
    //     date?: Date;
    //     [key: string]: any;
    //   };
    // }

    return content;
  });

  return allMDdata;
}
