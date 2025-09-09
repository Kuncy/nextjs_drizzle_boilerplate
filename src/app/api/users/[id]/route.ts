import { db } from "@/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ApiUser } from "@/types/user";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const row = await db
    .select()
    .from(users)
    .where(eq(users.id, params.id))
    .limit(1);

  if (!row.length) {
    return new Response("User not found", { status: 404 });
  }

  const apiUser: ApiUser = {
    ...row[0],
    isAdmin: true,
  };

  return Response.json(apiUser);
}
