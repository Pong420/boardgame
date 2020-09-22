import { escapeRegex } from './escape-regex';

export type Condition = Record<string, unknown>;
export type SearchRegex = Record<string, { $regex: RegExp }>;
export type SearchQuery = Record<string, (SearchRegex | Condition)[]>;

export function formatSearchQuery(
  keys: string[] = [],
  search: string
): SearchQuery {
  const $regex = search && new RegExp(escapeRegex(search), 'gi');

  if ($regex) {
    return {
      $or: keys.map<SearchRegex>(key => ({
        [key]: { $regex }
      }))
    };
  }

  return {};
}
