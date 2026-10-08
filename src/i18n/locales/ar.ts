import { en } from "./en";
import type { TranslationKey } from "../types";

export const ar: Record<TranslationKey, string> = {
  ...en,
  filter_room_all: "نوع الغرفة",
  filter_kind_all: "نوع العقار",
  filter_condition_all: "الحالة",
  filter_search: "بحث",
  language_modal_title: "اختر اللغة",
  language_modal_desc: "يرجى اختيار لغتك المفضلة."
};
