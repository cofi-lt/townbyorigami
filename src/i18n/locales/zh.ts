import { en } from "./en";
import type { TranslationKey } from "../types";

export const zh: Record<TranslationKey, string> = {
  ...en,
  filter_room_all: "房间类型",
  filter_kind_all: "房产类型",
  filter_condition_all: "状况",
  filter_search: "搜索",
  language_modal_title: "选择语言",
  language_modal_desc: "请选择您的首选语言。"
};
