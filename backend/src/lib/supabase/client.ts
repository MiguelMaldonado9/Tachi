import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

import { env } from "../../config/index.js";

export class SupabaseProvider {

  public readonly admin: SupabaseClient;

  constructor() {
    this.admin = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
    );
  }

}

export const supabase =
  new SupabaseProvider();