import { Icon } from "@raycast/api";
import { SearchResult } from "./types";

export const getIcon = (item: SearchResult) => {
  if (item.isNavigation) {
    return Icon.Link;
  } else if (item.isApiResult) {
    return Icon.Link;

  } else if (item.isFastGPT){
    return Icon.QuestionMark;
  }
  else {
    return Icon.MagnifyingGlass;
  }
};