// @ts-nocheck
import {ROLE} from "./metadata"

export type RoleType = keyof typeof ROLE;

export type PayloadType = {
  sub: string;
  role: keyof typeof ROLE;
};

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    remaining: number;
  }
}
