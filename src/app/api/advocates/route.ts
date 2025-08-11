import db from "../../../db";
import { advocates } from "../../../db/schema";
import { count } from "drizzle-orm";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const numPerPage = 10;

  const page = searchParams.get("page");

  console.log(
    `
    
    page
    
    `,
    page
  );

  const numericPage = parseInt(page || "0");

  const offset = numericPage > 0 ? numericPage - 1 : 0;

  const [{ count: total }] = await db
    .select({ count: count() })
    .from(advocates);

  const numericTotal = Number(total);

  const data = await db
    .select()
    .from(advocates)
    .limit(numPerPage)
    .offset(offset * numPerPage);

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
