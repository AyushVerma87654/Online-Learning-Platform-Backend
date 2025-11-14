import { convertKeysToCamelCase } from "../services/normalizeData.js";
import { supabase } from "../services/supabase.js";

export const UserModel = {
  async createAuthUser(email, password) {
    return await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
  },

  async deleteAuthUser(id) {
    return await supabase.auth.admin.deleteUser(id);
  },

  async createUser(userData) {
    const { data, error } = await supabase
      .from("users")
      .insert(userData)
      .select();
    if (error) throw error;
    return { data: convertKeysToCamelCase(data) };
  },

  async deleteUser(id) {
    return await supabase.from("users").delete().eq("id", id);
  },

  async getUserById(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return { data: convertKeysToCamelCase(data) };
  },

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    if (error) throw error;
    return { data: convertKeysToCamelCase(data) };
  },

  async updateUser(email, user) {
    const { data, error } = await supabase
      .from("users")
      .update({ ...user })
      .eq("email", email)
      .select("*")
      .single();
    if (error) throw error;
    return { data: convertKeysToCamelCase(data) };
  },

  async setPremiumUser(email) {
    const now = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(now.getMonth() + 1);

    const { data, error } = await supabase
      .from("users")
      .update({
        is_premium_user: true,
        paid_at: now,
        plan_valid_till: oneMonthLater,
      })
      .eq("email", email)
      .select("*")
      .single();
    if (error) throw error;
    return { data: convertKeysToCamelCase(data) };
  },

  async loginUser(email, password) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  async getAllUsers() {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    const normalizedData = data.map((user) => convertKeysToCamelCase(user));
    return { data: normalizedData };
  },
};
