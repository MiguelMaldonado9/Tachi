import { supabase } from "../index.js";

export class SupabaseHealthService {

  async checkConnection() {

    const { error } =
      await supabase.admin
        .from("users")
        .select("*")
        .limit(1);

    if (error) {
      throw error;
    }

    return {
      connected: true,
    };

  }

}