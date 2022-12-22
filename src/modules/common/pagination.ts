import { IPaginationMeta } from './interfaces';

export class Pagination<PaginationObject> {
  constructor(
    /**
     * a list of items to be returned
     */
    public readonly items: PaginationObject[],
    /**
     * associated meta information (e.g., counts)
     */
    public readonly meta: IPaginationMeta, // public readonly links: IPaginationLinks,
  ) /**
   * associated links
   */ {}
}
