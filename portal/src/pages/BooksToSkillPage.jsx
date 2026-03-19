import { META_SKILLS } from "../config";
import { META_CONTENT } from "../metaContent";
import MetaSkillLayout from "./MetaSkillLayout";

export default function BooksToSkillPage() {
  const meta = META_SKILLS.find((m) => m.id === "books-to-skill");
  return <MetaSkillLayout meta={meta} content={META_CONTENT["books-to-skill"]} />;
}
