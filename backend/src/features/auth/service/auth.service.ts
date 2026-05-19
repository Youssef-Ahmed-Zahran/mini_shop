import { supabase } from "../../../lib/supabase.js";
import { query } from "../../../lib/db.js";
import { ApiError } from "../../../utils/ApiError.js";
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../schema/auth.schema.js";

export const authService = {
  async register(input: RegisterInput) {
    // 1. Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: { data: { name: input.name } },
    });

    if (error) throw new ApiError(400, error.message);
    if (!data.user) throw new ApiError(500, "Registration failed");

    // 2. Upsert profile in Neon (includes email for getProfile)
    await query(
      `INSERT INTO profiles (id, name, email, role)
      VALUES ($1, $2, $3, 'customer')
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email`,
      [data.user.id, input.name, input.email]
    );

    return {
      message: "Registration successful. Please check your email to confirm your account.",
    };
  },

  async login(input: LoginInput, jwtSign: (payload: object) => string) {
    // 1. Authenticate with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error || !data.user) throw new ApiError(401, "Invalid email or password");

    // 2. Fetch profile from Neon, upsert email if missing
    await query(
      `INSERT INTO profiles (id, email, name, role)
      VALUES ($1, $2, $2, 'customer')
      ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email`,
      [data.user.id, data.user.email]
    );

    const result = await query<{ name: string; role: string; email: string | null }>(
      `SELECT name, role, email FROM profiles WHERE id = $1`,
      [data.user.id]
    );

    const profile = result.rows[0];
    if (!profile) throw new ApiError(404, "Profile not found");

    // 3. Sign JWT with role included
    const token = jwtSign({
      id: data.user.id,
      email: data.user.email,
      name: profile.name,
      role: profile.role,
    });

    return {
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile.name,
        role: profile.role,
      },
    };
  },

  async forgotPassword(input: ForgotPasswordInput) {
    const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
      redirectTo: `${process.env.FRONTEND_URL ?? "http://localhost:5173"}/reset-password`,
    });
    if (error) throw new ApiError(400, error.message);
    return { message: "Password reset email sent if the account exists" };
  },

  async getProfile(userId: string) {
    const result = await query<{
      id: string;
      name: string;
      email: string | null;
      role: string;
      created_at: string;
    }>(
      `SELECT id, name, email, role, created_at FROM profiles WHERE id = $1`,
      [userId]
    );

    if (!result.rows[0]) throw new ApiError(404, "Profile not found");
    return result.rows[0];
  },

  async resetPassword(input: ResetPasswordInput) {
    const { data, error: userError } = await supabase.auth.getUser(input.access_token);
    if (userError || !data.user) throw new ApiError(401, "Invalid or expired token");

    const { error: updateError } = await supabase.auth.admin.updateUserById(data.user.id, {
      password: input.password
    });
    if (updateError) throw new ApiError(400, updateError.message);

    return { message: "Password updated successfully" };
  },
};
