/* eslint-disable camelcase */
export type ListResponse<T> = {
  meta: {
    project_id: string;
    next_cursor: string;
    more: boolean;
  };
  results: T[];
};
