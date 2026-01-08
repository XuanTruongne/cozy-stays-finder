import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://lovable.dev',
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin.endsWith('.lovable.app')) return true;
  return false;
}

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin!,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface ContactEmailRequest {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

async function sendEmail(to: string[], subject: string, html: string): Promise<any> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "VungTauStay <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { name, email, phone, subject, message }: ContactEmailRequest = await req.json();

    // Validate input
    if (!name || !email || !phone || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Security logging
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    console.log(`Contact form submission from IP: ${clientIP}, email: ${email}`);

    // Send email to admin
    const adminEmailResponse = await sendEmail(
      ["truongnguyen6560@gmail.com"],
      `[Liên hệ] ${escapeHtml(subject)}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1a5f7a; border-bottom: 2px solid #1a5f7a; padding-bottom: 10px;">
            Tin nhắn mới từ khách hàng
          </h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Họ tên:</strong> ${escapeHtml(name)}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p style="margin: 10px 0;"><strong>Điện thoại:</strong> ${escapeHtml(phone)}</p>
            <p style="margin: 10px 0;"><strong>Tiêu đề:</strong> ${escapeHtml(subject)}</p>
          </div>
          
          <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Nội dung:</h3>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
          
          <p style="color: #888; font-size: 12px; margin-top: 20px; text-align: center;">
            Email được gửi từ hệ thống VungTauStay
          </p>
        </div>
      `
    );

    console.log("Admin email sent successfully:", adminEmailResponse);

    // Send confirmation email to customer
    const customerEmailResponse = await sendEmail(
      [email],
      "Cảm ơn bạn đã liên hệ với VungTauStay!",
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1a5f7a; text-align: center;">
            Cảm ơn bạn đã liên hệ!
          </h2>
          
          <p style="color: #555; line-height: 1.6;">
            Xin chào <strong>${escapeHtml(name)}</strong>,
          </p>
          
          <p style="color: #555; line-height: 1.6;">
            Chúng tôi đã nhận được tin nhắn của bạn với tiêu đề "<strong>${escapeHtml(subject)}</strong>".
          </p>
          
          <p style="color: #555; line-height: 1.6;">
            Đội ngũ VungTauStay sẽ phản hồi bạn trong thời gian sớm nhất (thường trong vòng 24 giờ).
          </p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #666;">
              <strong>Nội dung bạn đã gửi:</strong><br>
              <span style="white-space: pre-wrap;">${escapeHtml(message)}</span>
            </p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            Trân trọng,<br>
            <strong>Đội ngũ VungTauStay</strong>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          
          <p style="color: #888; font-size: 12px; text-align: center;">
            Nếu bạn cần hỗ trợ gấp, vui lòng gọi: 0254 123 4567
          </p>
        </div>
      `
    );

    console.log("Customer confirmation email sent:", customerEmailResponse);

    return new Response(
      JSON.stringify({ success: true, message: "Emails sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
