import { en } from "./en";
import type { TranslationKey } from "../types";

export const it: Record<TranslationKey, string> = {
  ...en,
  filter_room_all: "Tipologia di stanza",
  filter_kind_all: "Tipologia di proprietà",
  filter_condition_all: "Condizione",
  filter_search: "Cerca",
  language_modal_title: "Scegli la lingua",
  language_modal_desc: "Scegli la lingua che preferisci."
};
