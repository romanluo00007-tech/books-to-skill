import { META_SKILLS } from "../config";
import MetaSkillLayout from "./MetaSkillLayout";

export default function BooksToSkillPage() {
  const meta = META_SKILLS.find((m) => m.id === "books-to-skill");
  return <MetaSkillLayout meta={meta} />;
}
