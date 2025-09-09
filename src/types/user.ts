import type { User } from "@/db/schema";

export interface ApiUser extends User {
    isAdmin: true
}
