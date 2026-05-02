import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TransferRequest {
  sender_id: string;
  receiver_id: string;
  amount: number;
  channel: string;
  hour: number;
  velocity: number;
}

// Simple AI fraud detection using rule-based heuristics
// (mirrors the Isolation Forest logic from the Python model)
function detectFraud(amount: number, hour: number, velocity: number): boolean {
  // High amount at unusual hours with high velocity = fraud
  if (amount > 100000 && (hour < 5 || hour > 23) && velocity > 10) return true;
  // Very high velocity regardless of amount
  if (velocity > 15) return true;
  // Very large amount at odd hours
  if (amount > 500000 && (hour < 6 || hour > 22)) return true;
  // Extreme amount
  if (amount > 900000) return true;
  return false;
}

// Simulate Paystack/Flutterwave gateway
async function simulateGateway(amount: number, receiver: string): Promise<{ status: boolean; message: string; reference?: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const rand = Math.random();
  if (rand < 0.8) {
    const ref = `TXL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    return { status: true, message: "Transfer successful", reference: ref };
  } else if (rand < 0.95) {
    return { status: false, message: "Gateway Error: Insufficient Funds" };
  } else {
    return { status: false, message: "Gateway Error: Destination Bank Timeout" };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: TransferRequest = await req.json();

    if (!body.sender_id || !body.receiver_id || !body.amount) {
      return new Response(
        JSON.stringify({ detail: "Missing required fields: sender_id, receiver_id, amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role for DB writes
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. AI Fraud Check
    const isFraud = detectFraud(body.amount, body.hour, body.velocity);

    if (isFraud) {
      // Log the blocked attempt
      await supabase.from("transactions").insert({
        sender_id: body.sender_id,
        receiver_id: body.receiver_id,
        amount: body.amount,
        channel: body.channel,
        is_fraud_flagged: true,
        gateway_success: false,
        error_message: "Blocked by AI",
      });

      return new Response(
        JSON.stringify({ detail: "Transaction blocked: Suspicious activity detected by AI." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Payment Gateway
    const gatewayResult = await simulateGateway(body.amount, body.receiver_id);

    if (!gatewayResult.status) {
      // Log the failed gateway attempt
      await supabase.from("transactions").insert({
        sender_id: body.sender_id,
        receiver_id: body.receiver_id,
        amount: body.amount,
        channel: body.channel,
        is_fraud_flagged: false,
        gateway_success: false,
        error_message: gatewayResult.message,
      });

      return new Response(
        JSON.stringify({ detail: gatewayResult.message }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Success
    await supabase.from("transactions").insert({
      sender_id: body.sender_id,
      receiver_id: body.receiver_id,
      amount: body.amount,
      channel: body.channel,
      is_fraud_flagged: false,
      gateway_success: true,
      gateway_receipt: gatewayResult.reference,
    });

    return new Response(
      JSON.stringify({
        status: "Success",
        message: `₦${body.amount.toLocaleString()} transferred to ${body.receiver_id}`,
        gateway_receipt: gatewayResult.reference,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ detail: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
