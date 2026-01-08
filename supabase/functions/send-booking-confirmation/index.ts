import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Allowed origins for CORS - restrict to your domains
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://lovable.dev',
];

// Check if origin matches allowed patterns (supports wildcards for lovable.app)
const isAllowedOrigin = (origin: string | null): boolean => {
  if (!origin) return false;
  
  // Check exact matches
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  
  // Check lovable.app subdomains pattern
  if (/^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin)) return true;
  
  return false;
};

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin!,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
};

interface BookingEmailRequest {
  bookingId: string;
  paymentMethod: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// HTML escape function to prevent injection attacks
const escapeHtml = (unsafe: string): string => {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Get auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized - Missing authorization header" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create Supabase client with service role for database queries
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Create client with user token for auth verification
    const supabaseAuth = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized - Invalid token" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Log function invocation for security monitoring
    console.log(`Email send attempt: user=${user.id}, ip=${req.headers.get('x-forwarded-for') || 'unknown'}`);

    const requestData: BookingEmailRequest = await req.json();
    
    // Validate required fields
    if (!requestData.bookingId || typeof requestData.bookingId !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid booking ID" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Verify booking exists and belongs to the authenticated user
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, user_id, guest_email, guest_name, guest_phone, hotel_id, room_id, check_in, check_out, guests, total_price, status")
      .eq("id", requestData.bookingId)
      .eq("user_id", user.id)
      .single();

    if (bookingError || !booking) {
      console.error("Booking error:", bookingError);
      return new Response(
        JSON.stringify({ success: false, error: "Booking not found or unauthorized" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate booking status - don't send confirmation for cancelled bookings
    if (booking.status === 'cancelled') {
      return new Response(
        JSON.stringify({ success: false, error: "Cannot send confirmation for cancelled booking" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Fetch hotel details from database
    const { data: hotel, error: hotelError } = await supabase
      .from("hotels")
      .select("name, address")
      .eq("id", booking.hotel_id)
      .single();

    if (hotelError || !hotel) {
      console.error("Hotel error:", hotelError);
      return new Response(
        JSON.stringify({ success: false, error: "Hotel not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Fetch room details from database
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("name")
      .eq("id", booking.room_id)
      .single();

    if (roomError || !room) {
      console.error("Room error:", roomError);
      return new Response(
        JSON.stringify({ success: false, error: "Room not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Sanitize payment method from request (the only user-provided data now)
    const paymentMethod = escapeHtml(requestData.paymentMethod || "Thanh toán online");
    
    console.log(`Sending booking confirmation email: booking=${booking.id}, to=${booking.guest_email}`);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác nhận đặt phòng</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Đặt phòng thành công!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Xin chào <strong>${escapeHtml(booking.guest_name)}</strong>,
          </p>
          <p style="font-size: 16px; margin-bottom: 25px;">
            Cảm ơn bạn đã đặt phòng. Dưới đây là thông tin chi tiết đặt phòng của bạn:
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #667eea; margin-top: 0; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
              📋 Mã đặt phòng: <span style="color: #333;">${booking.id.slice(0, 8).toUpperCase()}</span>
            </h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">🏨 Khách sạn:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${escapeHtml(hotel.name)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">📍 Địa chỉ:</td>
                <td style="padding: 8px 0; text-align: right;">${escapeHtml(hotel.address)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">🛏️ Phòng:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${escapeHtml(room.name)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">📅 Nhận phòng:</td>
                <td style="padding: 8px 0; text-align: right;">${formatDate(booking.check_in)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">📅 Trả phòng:</td>
                <td style="padding: 8px 0; text-align: right;">${formatDate(booking.check_out)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">👥 Số khách:</td>
                <td style="padding: 8px 0; text-align: right;">${Number(booking.guests)} người</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">💳 Thanh toán:</td>
                <td style="padding: 8px 0; text-align: right;">${paymentMethod}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
            <p style="margin: 0; color: white; font-size: 14px;">Tổng thanh toán</p>
            <p style="margin: 5px 0 0 0; color: white; font-size: 28px; font-weight: bold;">${formatCurrency(Number(booking.total_price))}</p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; font-size: 14px;">
              <strong>⏰ Lưu ý:</strong> Thời gian nhận phòng từ 14:00 và trả phòng trước 12:00.
            </p>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
              Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
            </p>
            <p style="color: #667eea; font-weight: bold; font-size: 16px;">
              Chúc bạn có một kỳ nghỉ tuyệt vời! 🌟
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© 2024 Hotel Booking. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Hotel Booking <onboarding@resend.dev>",
        to: [booking.guest_email],
        subject: `✅ Xác nhận đặt phòng tại ${escapeHtml(hotel.name)}`,
        html: emailHtml,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending booking confirmation:", error);
    return new Response(
      JSON.stringify({ success: false, error: "An error occurred while sending the confirmation email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...getCorsHeaders(req.headers.get("origin")) },
      }
    );
  }
};

serve(handler);
