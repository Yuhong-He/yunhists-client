import i18n from "@/lang";

export function getTitle(page) {
    return i18n.tc("title." + page) + i18n.tc("title.siteName");
}