import { en } from "./en";
import type { TranslationKey } from "../types";

export const he: Record<TranslationKey, string> = {
  ...en,
  language_modal_title: "בחר שפה",
  header_more: "עוד",
  language_modal_desc: "בחר את השפה המועדפת עליך."
};
