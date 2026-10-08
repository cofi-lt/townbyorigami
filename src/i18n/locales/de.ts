import { en } from "./en";
import type { TranslationKey } from "../types";

export const de: Record<TranslationKey, string> = {
  ...en,
  filter_room_all: "Zimmertyp",
  filter_kind_all: "Immobilientyp",
  filter_condition_all: "Zustand",
  filter_search: "Suchen",
  language_modal_title: "Sprache waehlen",
  language_modal_desc: "Bitte waehlen Sie Ihre bevorzugte Sprache."
};
