import { signIn } from "next-auth/react";

export const AuthService = {
  async login(email: string, password: string, callbackUrl: string) {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      redirectTo: callbackUrl,
    });

    if (!res) throw new Error("No response from server");

    if (res.error) {
      throw new Error("Invalid email or password");
    }

    return res;
  },
};
