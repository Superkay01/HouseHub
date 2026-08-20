import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { reference, property_id } = await req.json()

    if (!reference || !property_id) {
      return new Response(
        JSON.stringify({ error: "reference and property_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // 1. Verify with Paystack
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get("PAYSTACK_SECRET_KEY")}`,
          "Content-Type": "application/json",
        },
      }
    )

    const paystackData = await paystackRes.json()

    if (!paystackData.status || paystackData.data.status !== "success") {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Payment verification failed",
          data: paystackData 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const transaction = paystackData.data

    // 2. Create Supabase client with service role (or user JWT)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    // Get the authenticated user from the request
    const authHeader = req.headers.get("Authorization")
    const token = authHeader?.replace("Bearer ", "")
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // 3. Save / upsert the payment in Supabase
    const { data: payment, error: insertError } = await supabase
      .from("payments")
      .upsert({
        reference: transaction.reference,
        customer_id: user.id,
        property_id: property_id,
        amount: transaction.amount / 100, // convert from kobo
        currency: transaction.currency,
        status: "success",
        payment_type: "inspection_fee",
        paystack_response: transaction,
        paid_at: new Date(transaction.paid_at).toISOString(),
      }, { onConflict: "reference" })
      .select()
      .single()

    if (insertError) {
      console.error("Insert error:", insertError)
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment verified and saved",
        payment,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})