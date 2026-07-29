import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

import { env } from "../../config/index.js";

export class SupabaseProvider {

  public readonly admin: SupabaseClient;

  public readonly client: SupabaseClient;

  constructor() {
    this.admin = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
    );

    this.client = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_PUBLISHABLE_KEY,
    );
    
  }

}

export const supabase =
  new SupabaseProvider();