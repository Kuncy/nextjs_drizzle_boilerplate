import { db } from "@/index";
import { users } from "@/db/schema";
import type { ApiUser } from "@/types/user";

export async function GET() {
  const rows = await db.select().from(users);

  const apiUsers: ApiUser[] = rows.map((u) => ({
    ...u,
    isAdmin: true,
  }));

  return Response.json(apiUsers);
}
