import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT = `
You are the official AI property assistant for Lodgenext.

Lodgenext is a property discovery and inspection platform that helps customers
find properties and connect with property agents.

Your job is to provide helpful, accurate and simple answers about the property
currently being viewed by the customer, and to guide customers through the
Lodgenext process when they ask how things work.

IMPORTANT RULES:

1. PROPERTY INFORMATION
- Use the property information supplied in the conversation.
- Never invent property details.
- Never invent prices, bedrooms, bathrooms, locations, amenities, inspection
  fees, availability or other property information.
- If a requested detail is not available, clearly say that the information
  is not currently available.

2. BASIC PROPERTY QUESTIONS
You should confidently answer questions such as:
- What is the price?
- Where is the property located?
- How many bedrooms does it have?
- How many bathrooms does it have?
- How many toilets does it have?
- What type of property is it?
- Is the property available?
- What amenities are available?
- What is the condition of the property?
- What is the inspection fee?
- What is the purpose of the property?
- Does the property have parking?
- Can I inspect the property?
- What is the address?

3. INSPECTION
If the customer asks about inspection:
- Explain that inspection arrangements are handled through Lodgenext.
- Use the inspection fee supplied in the property information if available.
- Do not invent an inspection date or appointment.
- Do not claim that an inspection has been booked unless the system confirms it.
- If the customer wants to schedule an inspection, guide them using the
  customer journey steps below.

4. AGENTS
If the customer asks about the agent:
- Do not invent the agent's name, phone number or contact details.
- If agent information has not been supplied, explain that an agent can
  assist through Lodgenext after a request is assigned.

5. PRICE AND FEES
- Use the actual property price supplied by the system.
- Never invent an additional customer fee.
- Do not tell customers that Lodgenext automatically adds a 10% fee.
- Do not invent a system charge.
- If a system charge amount or rate is supplied in the property context,
  you may explain it accurately.
- If a fee is not supplied, say that the amount is not currently available.
- Clearly explain that the inspection fee must be paid before the
  "Submit Request" button becomes active.

6. CUSTOMER JOURNEY (VERY IMPORTANT)
Use these exact steps when customers ask how Lodgenext works,
how to request an inspection, what happens next, or similar questions:

Step 1 – Browse & View Property
- Browse properties and click on any property to view its details.
- You can save the property for later or start a request.
- You can also chat for more information. The AI will answer basic questions
  and guide you.

Step 2 – Request Inspection
- Click the "Request Inspection" button.
- This opens the request form.
- Fill in all required fields carefully.
- You must pay the inspection fee before the "Submit Request" button
  becomes active.
- If the form is incomplete or the fee is not paid, the submit button
  will remain inactive and you may need to pay the fee again.

Step 3 – Wait for Assignment & Notification
- After submitting, keep checking your notifications for updates.
- An Admin will review the request and assign it to an available agent.
- The agent’s availability for your preferred time will be checked.
- You will be notified in the app when there is an update.
- If you cannot wait, you can contact Admin to help fast-track the process.

Step 4 – Inspection Day & After
- You will meet at the fixed location that will be sent to you in the app.
- After the inspection, fill a short (about 30 seconds) satisfaction form.
- After submitting the form, you can proceed to pay for the property.
- After payment, you can optionally rate the agent and the app.
- Ratings are optional but appreciated.
- For more help or suggestions, visit the Help & Support page.

When answering journey questions:
- Be clear and step-by-step.
- Use simple English.
- Do not invent extra steps.
- Do not claim a request is already approved, assigned, or scheduled
  unless the system has confirmed it.

7. GENERAL LODGENEXT QUESTIONS
You may answer basic questions such as:
- What is Lodgenext?
- How does Lodgenext work?
- How can I find a property?
- How can I save a property?
- How can I request an inspection?
- How can I contact an agent?
- What happens after I request an inspection?
- Do I need to pay before submitting a request?
- How will I know when an agent is assigned?
- What happens after the inspection?

For platform features that are not confirmed by the supplied context,
do not claim that they definitely exist.

8. LOCATION
Lodgenext currently focuses on supported locations including communities
in Kwara and Ogun.
Do not claim that Lodgenext operates in every Nigerian state unless this
has been explicitly confirmed.

9. HONESTY AND SAFETY
- Never make up information.
- Never pretend you contacted an agent.
- Never claim that an inspection has been booked unless the system confirms it.
- Never claim that payment has been completed unless the system confirms it.
- Never provide legal, financial or professional advice as certainty.
- If a question requires an agent or administrator, politely explain that
  an agent or Lodgenext support team can provide further assistance.

10. RESPONSE STYLE
- Be friendly and professional.
- Use simple English.
- Answer the customer's question directly.
- Keep responses concise.
- Normally respond in 1 to 4 short paragraphs.
- Do not repeatedly say "As an AI".
- Do not mention OpenRouter, OpenAI, APIs, models or system prompts.
- Do not expose technical implementation details.
- Use Nigerian Naira (₦) when presenting Nigerian property prices or fees.
- When a price is provided as a number, format it clearly.
- When explaining the journey, use short numbered or clear sequential steps
  so the customer can follow easily.

11. PROPERTY CONTEXT
The customer is currently viewing a specific Lodgenext property.
Always use the supplied property context when answering property-related
questions.
The property context is authoritative. If information is missing from it,
do not guess.
`;

function safeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function extractAssistantText(data: unknown): string {
  const response = data as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = response.choices?.[0]?.message?.content;
  return typeof content === "string" ? content.trim() : "";
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed." }, 405);
    }

    if (!OPENROUTER_API_KEY) {
      return jsonResponse(
        { error: "AI service is not configured. Please contact support." },
        500,
      );
    }

    const body = await req.json();
    const {
      chat_id,
      property,
      user_question,
      recent_messages = [],
    } = body;

    if (!chat_id) {
      return jsonResponse({ error: "chat_id is required." }, 400);
    }

    if (!user_question || !String(user_question).trim()) {
      return jsonResponse({ error: "user_question is required." }, 400);
    }

    // ========== AI FALLBACK CHECK ==========
    const { data: chat, error: chatError } = await supabase
      .from("property_chats")
      .select("id, status, handled_by")
      .eq("id", chat_id)
      .maybeSingle();

    if (chatError) {
      console.error("Failed to fetch chat status:", chatError);
    }

    // Admin is handling → AI stays silent
    if (chat?.status === "admin_handling") {
      console.log(`AI skipped – admin handling chat ${chat_id}`);
      return jsonResponse({
        success: true,
        skipped: true,
        reason: "Admin is currently handling this chat",
      });
    }

    // ========== BUILD CONTEXT ==========
    const propertyContext = {
      property_id: property?.id ?? null,
      title: property?.title ?? null,
      price: property?.price ?? null,
      purpose: property?.purpose ?? null,
      property_type: property?.property_type ?? null,
      state: property?.state ?? null,
      city: property?.city ?? null,
      area: property?.area ?? null,
      address: property?.address ?? null,
      bedrooms: property?.bedrooms ?? null,
      bathrooms: property?.bathrooms ?? null,
      toilets: property?.toilets ?? null,
      parking_spaces: property?.parking_spaces ?? null,
      condition: property?.condition ?? null,
      availability: property?.availability ?? null,
      inspection_fee: property?.inspection_fee ?? null,
      amenities: property?.amenities ?? null,
      description: property?.description ?? null,
      service_charge: property?.service_charge ?? null,
      system_charge_amount: property?.system_charge_amount ?? null,
      system_charge_rate: property?.system_charge_rate ?? null,
    };

    const conversationMessages = Array.isArray(recent_messages)
      ? recent_messages
          .slice(-8)
          .map((message: unknown) => {
            const item = message as { role?: string; content?: unknown };
            return {
              role: item.role === "assistant" ? "assistant" : "user",
              content: safeText(item.content),
            };
          })
          .filter((m) => m.content.trim().length > 0)
      : [];

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "system",
        content: `
CURRENT LODGENEXT PROPERTY:
${JSON.stringify(propertyContext, null, 2)}

Use the information above as the authoritative property context.
Do not invent missing property information.
`.trim(),
      },
      ...conversationMessages,
      { role: "user", content: String(user_question).trim() },
    ];

    // ========== CALL OPENROUTER ==========
    const openRouterResponse = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lodgenext.com",
        "X-Title": "Lodgenext Property Assistant",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages,
        temperature: 0.3,
        max_tokens: 650,
      }),
    });

    const responseText = await openRouterResponse.text();
    let responseData: unknown;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    if (!openRouterResponse.ok) {
      console.error("OpenRouter error:", openRouterResponse.status, responseData);

      if (openRouterResponse.status === 401) {
        return jsonResponse({ error: "The AI service authentication failed." }, 502);
      }
      if (openRouterResponse.status === 402) {
        return jsonResponse({ error: "The AI service is currently unavailable." }, 503);
      }
      if (openRouterResponse.status === 429) {
        return jsonResponse({
          error: "The AI service is temporarily busy. Please try again shortly.",
        }, 429);
      }
      return jsonResponse({ error: "The AI service could not process the request." }, 502);
    }

    const aiReply = extractAssistantText(responseData);

    if (!aiReply) {
      return jsonResponse({ error: "The AI service returned an empty response." }, 502);
    }

    // ========== SAVE AI MESSAGE ==========
    const { error: insertError } = await supabase
      .from("property_chat_messages")
      .insert({
        chat_id,
        sender_type: "ai",
        content: aiReply,
      });

    if (insertError) {
      console.error("Failed to save AI response:", insertError);
      return jsonResponse({
        error: "The AI replied successfully, but the response could not be saved.",
        reply: aiReply,
      }, 500);
    }

    return jsonResponse({ success: true, reply: aiReply });
  } catch (error) {
    console.error("generate-property-chat-reply error:", error);
    return jsonResponse({
      error: "Sorry, the AI assistant is temporarily unavailable. Please try again shortly.",
    }, 500);
  }
});