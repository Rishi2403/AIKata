import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { jwtDecode } from "npm:jwt-decode@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const pathname = url.pathname;

    if (pathname.match(/^\/functions\/v1\/sweets\/[a-f0-9-]+\/purchase$/) && req.method === "POST") {
      const id = pathname.split("/")[4];
      return await handlePurchase(req, id);
    } else if (pathname.match(/^\/functions\/v1\/sweets\/[a-f0-9-]+\/restock$/) && req.method === "POST") {
      const id = pathname.split("/")[4];
      return await handleRestock(req, id);
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function handlePurchase(req: Request, sweetId: string) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const token = authHeader.replace("Bearer ", "");
  const decoded = jwtDecode(token) as any;
  const userId = decoded.sub;

  const { quantity } = await req.json();

  if (!quantity || quantity <= 0) {
    return new Response(JSON.stringify({ error: "Valid quantity required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRole);

  try {
    const { data: sweet } = await supabase.from("sweets").select("*").eq("id", sweetId).maybeSingle();

    if (!sweet) {
      return new Response(JSON.stringify({ error: "Sweet not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (sweet.quantity < quantity) {
      return new Response(JSON.stringify({ error: "Insufficient stock" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const totalPrice = sweet.price * quantity;

    const { error: purchaseError } = await supabase.from("purchases").insert([
      {
        user_id: userId,
        sweet_id: sweetId,
        quantity,
        total_price: totalPrice,
      },
    ]);

    if (purchaseError) {
      return new Response(JSON.stringify({ error: purchaseError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: updateError } = await supabase
      .from("sweets")
      .update({ quantity: sweet.quantity - quantity })
      .eq("id", sweetId);

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        message: "Purchase successful",
        sweetName: sweet.name,
        quantity,
        totalPrice,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Purchase failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

async function handleRestock(req: Request, sweetId: string) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const token = authHeader.replace("Bearer ", "");
  const decoded = jwtDecode(token) as any;
  const userId = decoded.sub;

  const { quantity } = await req.json();

  if (!quantity || quantity <= 0) {
    return new Response(JSON.stringify({ error: "Valid quantity required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRole);

  try {
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", userId).maybeSingle();

    if (!profile?.is_admin) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: sweet } = await supabase.from("sweets").select("*").eq("id", sweetId).maybeSingle();

    if (!sweet) {
      return new Response(JSON.stringify({ error: "Sweet not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error } = await supabase
      .from("sweets")
      .update({ quantity: sweet.quantity + quantity })
      .eq("id", sweetId);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        message: "Restock successful",
        sweetName: sweet.name,
        addedQuantity: quantity,
        newQuantity: sweet.quantity + quantity,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Restock failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}
