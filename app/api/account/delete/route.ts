import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminClient = createAdminClient()
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)

    if (deleteError) {
      return NextResponse.json({ error: "Failed to delete user account" }, { status: 500 })
    }

    await supabase.auth.signOut()

    return NextResponse.json({ success: true, message: "Account deleted successfully" })
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
