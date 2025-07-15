import { ParamsType } from "./types/filters";

export const queryToParam = (query: ParamsType) => {
  const params: Record<string, string> = {};
  for (const key in query) {
    if (query.hasOwnProperty(key)) {
      params[`filter[${key}]`] = query[key];
    }
  }
  return params;
}
