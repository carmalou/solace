import db from "../../../db";
import { advocates } from "../../../db/schema";
import { count, ilike, or } from "drizzle-orm";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // pagination
  const numPerPage = 10;
  const page = searchParams.get("page");
  const numericPage = parseInt(page || "0");
  const offset = numericPage > 0 ? numericPage - 1 : 0;

  // search
  const rawSearch = searchParams.get("search");
  const searchTerm =
    rawSearch && rawSearch.trim() !== "" ? rawSearch.trim() : null;

  const whereClause = searchTerm
    ? or(
        ilike(advocates.firstName, `%${searchTerm}%`),
        ilike(advocates.lastName, `%${searchTerm}%`),
        ilike(advocates.city, `%${searchTerm}%`),
        ilike(advocates.degree, `%${searchTerm}%`)
      )
    : undefined;

  const [{ count: total }] = await db
    .select({ count: count() })
    .from(advocates)
    .where(whereClause);

  const numericTotal = Number(total);

  const data = await db
    .select()
    .from(advocates)
    .limit(numPerPage)
    .offset(offset * numPerPage)
    .where(whereClause);

  const paginatedResponse = {
    data,
    pagination: {
      totalRecords: numericTotal,
      totalPages: Math.ceil(numericTotal / numPerPage),
      currentPage: numericPage,
      perPage: numPerPage,
      hasPrevPage: numericPage > 1,
      hasNextPage: numericPage < Math.ceil(numericTotal / numPerPage),
    },
  };

  return Response.json(paginatedResponse);
}
