import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Bloom, a pregnancy nutrition assistant. You provide helpful, evidence-based nutrition guidance for pregnant women.

Your capabilities:
- Answer food safety questions (safe / avoid / limit) with clear reasoning
- Suggest nutrient-rich alternatives when a food is unsafe
- Recommend foods for specific symptoms (nausea, heartburn, fatigue, constipation)
- Explain why specific nutrients matter at different pregnancy stages
- Suggest iron-rich foods with vitamin C pairing for better absorption

Guidelines:
- Always be warm, supportive, and encouraging
- For food safety, classify clearly: SAFE, AVOID, or LIMIT with reasoning
- When suggesting substitutes, compare nutrient profiles
- Keep answers concise but thorough
- Use the user's gestational week/trimester context when relevant
- When the user's daily food log data is provided, reference their actual intake (e.g. "You've had 15mg of iron today, which is 56% of your 27mg target")

REFERENCES — CRITICAL:
- At the end of EVERY answer, include a "📚 Sources" section with 1-3 specific references from authoritative medical/nutrition organizations. Use real, verifiable sources such as:
  • NIH Office of Dietary Supplements (ods.od.nih.gov)
  • CDC (cdc.gov)
  • ACOG (acog.org)
  • WHO (who.int)
  • American Dietetic Association
  • FDA (fda.gov)
- Format each reference as: "[Organization] — [Topic/Page title]" with the URL on the next line
- Only cite sources that are real and relevant to the answer

CRITICAL: Always end safety-related answers with: "This is general information only. Please consult your healthcare provider for personalized advice."

Never provide medical diagnoses or treatment recommendations. You are a nutrition information companion, not a medical professional.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { messages, gestationalWeek, trimester, dailyTotals } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let contextNote = gestationalWeek
      ? `\n\nThe user is currently at week ${gestationalWeek} of pregnancy (trimester ${trimester}).`
      : "";

    if (dailyTotals) {
      contextNote += `\n\nUser's food log for today:\n`;
      for (const [key, value] of Object.entries(dailyTotals)) {
        contextNote += `- ${key}: ${value}\n`;
      }
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + contextNote },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("pregnancy-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
