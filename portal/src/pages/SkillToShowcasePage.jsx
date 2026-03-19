import { META_SKILLS } from "../config";
import MetaSkillLayout from "./MetaSkillLayout";

export default function SkillToShowcasePage() {
  const meta = META_SKILLS.find((m) => m.id === "skill-to-showcase");
  return <MetaSkillLayout meta={meta} />;
}
