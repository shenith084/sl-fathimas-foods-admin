export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  emoji?: string;
  vacuum?: boolean;
}

export interface OrderEmailDetails {
  id: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  shippingDetails: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    district: string;
    email: string;
  };
}

const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
const DEFAULT_BUSINESS_EMAIL = "slfathimasfoods@gmail.com";
const FROM_NAME = "SL Fathima's Foods";

import { adminDb } from "@/lib/firebase/admin";

/**
 * Fetches the dynamic business email from Firestore settings.
 */
async function getDynamicBusinessEmail(): Promise<string> {
  try {
    const doc = await adminDb.collection("settings").doc("business").get();
    if (doc.exists) {
      const data = doc.data();
      return data?.businessEmail || DEFAULT_BUSINESS_EMAIL;
    }
  } catch (err) {
    console.error("Failed to fetch settings for emailService:", err);
  }
  return DEFAULT_BUSINESS_EMAIL;
}

/**
 * Helper to send email via Brevo REST API
 */
async function sendBrevoEmail(to: { email: string; name: string }[], subject: string, htmlContent: string) {
  if (!BREVO_API_KEY) {
    console.warn("BREVO_API_KEY is not set. Email not sent.");
    return false;
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { email: await getDynamicBusinessEmail(), name: FROM_NAME },
        to,
        subject,
        htmlContent
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo API error:", errorData);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to send email via Brevo:", err);
    return false;
  }
}

function formatItemsHtml(items: OrderItem[]) {
  return items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #E8DFCC;">
        ${item.emoji ? item.emoji + ' ' : ''}<strong>${item.name}</strong>
        ${item.vacuum ? '<br><small style="color: #D98C1F;">+ Vacuum packaged</small>' : ''}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #E8DFCC; text-align: center;">x${item.qty}</td>
      <td style="padding: 10px; border-bottom: 1px solid #E8DFCC; text-align: right;">LKR ${((item.price + (item.vacuum ? 50 : 0)) * item.qty).toLocaleString()}</td>
    </tr>
  `).join("");
}

export async function sendOrderConfirmationEmail(order: OrderEmailDetails) {
  const customerName = `${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`;
  const subject = `Order Confirmation - SL Fathima's Foods (#${order.id.substring(0, 8)})`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
      <div style="text-align: center; padding: 20px; background-color: #FAF7F2; border-bottom: 3px solid #D98C1F;">
        <h1 style="color: #2C4631; margin: 0;">SL Fathima's Foods</h1>
      </div>
      <div style="padding: 20px;">
        <h2>Thank you for your order, ${order.shippingDetails.firstName}!</h2>
        <p>We've received your order <strong>#${order.id.substring(0, 8)}</strong> and are getting it ready.</p>
        
        <h3 style="color: #D98C1F; border-bottom: 1px solid #E8DFCC; padding-bottom: 5px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          ${formatItemsHtml(order.items)}
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; color: #666;">Subtotal</td>
            <td style="padding: 10px; text-align: right;">LKR ${order.subtotal.toLocaleString()}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; color: #666;">Delivery</td>
            <td style="padding: 10px; text-align: right;">LKR ${order.deliveryCharge.toLocaleString()}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px;">Total</td>
            <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px; color: #D98C1F;">LKR ${order.total.toLocaleString()}</td>
          </tr>
        </table>

        <div style="background-color: #F4EFE6; padding: 15px; border-radius: 8px;">
          <h4 style="margin-top: 0; color: #2C4631;">Shipping Details</h4>
          <p style="margin: 0; color: #555;">
            ${customerName}<br>
            ${order.shippingDetails.address}<br>
            ${order.shippingDetails.city}, ${order.shippingDetails.district}
          </p>
          <h4 style="margin-top: 15px; margin-bottom: 5px; color: #2C4631;">Payment Method</h4>
          <p style="margin: 0; color: #555; text-transform: capitalize;">${order.paymentMethod === 'bank' ? 'Bank Transfer' : order.paymentMethod}</p>
        </div>
        
        <p style="margin-top: 20px; color: #888; font-size: 12px; text-align: center;">
          If you have any questions, please reply to this email or contact us via WhatsApp.
        </p>
      </div>
    </div>
  `;

  return sendBrevoEmail([{ email: order.shippingDetails.email, name: customerName }], subject, htmlContent);
}

export async function sendNewOrderAdminAlert(order: OrderEmailDetails) {
  const adminEmail = await getDynamicBusinessEmail();
  const subject = `🔥 New Order Received: #${order.id.substring(0, 8)} - LKR ${order.total.toLocaleString()}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <h2>New Order Received!</h2>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Customer:</strong> ${order.shippingDetails.firstName} ${order.shippingDetails.lastName} (${order.shippingDetails.email})</p>
      <p><strong>Total:</strong> LKR ${order.total.toLocaleString()}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod}</p>
      <p><a href="https://slfathimasfoods.com/admin/orders/${order.id}" style="background-color: #D98C1F; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">View Order in Admin</a></p>
    </div>
  `;

  return sendBrevoEmail([{ email: adminEmail, name: "Admin" }], subject, htmlContent);
}

export async function sendStatusUpdateEmail(customerEmail: string, customerName: string, orderId: string, status: string, note?: string) {
  const statusFormatted = status.charAt(0).toUpperCase() + status.slice(1);
  const subject = `Order Update: Your order is now ${statusFormatted}`;
  
  let customMessage = "";
  if (status === "preparing") {
    customMessage = "We have started preparing your delicious order! It will be packed and dispatched soon.";
  } else if (status === "dispatched") {
    customMessage = "Great news! Your order has been dispatched and is on its way to you.";
  }
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
      <div style="text-align: center; padding: 20px; background-color: #FAF7F2; border-bottom: 3px solid #D98C1F;">
        <h1 style="color: #2C4631; margin: 0;">Order Update</h1>
      </div>
      <div style="padding: 20px;">
        <h2>Hi ${customerName},</h2>
        <p>The status of your order <strong>#${orderId.substring(0, 8)}</strong> has been updated to: <strong>${statusFormatted}</strong>.</p>
        
        ${customMessage ? `<p style="font-size: 16px; color: #444;">${customMessage}</p>` : ''}
        
        ${note ? `
          <div style="background-color: #F8FAFC; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #1E293B;"><strong>Tracking Note:</strong><br>${note}</p>
          </div>
        ` : ''}
        
        <p style="margin-top: 30px;">
          <a href="https://slfathimasfoods.com/account/orders" style="background-color: #2C4631; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Track Your Order</a>
        </p>
      </div>
    </div>
  `;

  return sendBrevoEmail([{ email: customerEmail, name: customerName }], subject, htmlContent);
}
