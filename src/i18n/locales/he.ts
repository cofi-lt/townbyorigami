import { en } from "./en";
import type { TranslationKey } from "../types";

export const he: Record<TranslationKey, string> = {
  ...en,
  filter_room_all: "סוג החדר",
  filter_kind_all: "סוג הנכס",
  filter_condition_all: "מצב",
  filter_search: "חיפוש",
  language_modal_title: "בחר שפה",
  language_modal_desc: "בחר את השפה המועדפת עליך."
};
