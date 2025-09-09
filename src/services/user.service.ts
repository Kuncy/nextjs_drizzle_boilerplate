import { ApiUser } from "@/types/user";

export const UserService = {
  async getUser(id: string): Promise<ApiUser> {
    const res = await fetch(`/api/users/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch user with id ${id}`);
    }

    return res.json() as Promise<ApiUser>;
  },

  async getUsers(): Promise<ApiUser[]> {
    const res = await fetch("/api/users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    return res.json() as Promise<ApiUser[]>;
  },
};
