// Email notification system
// In production: connect to SendGrid, Resend, or Nodemailer with SMTP

import type { Order, Dispatch, ApprovalRequest } from '@/types';
import { formatCurrency, formatStatus, formatDateTime } from '@/lib/utils';

export type EmailTemplate =
  | 'order_confirmation'
  | 'order_dispatched'
  | 'order_delivered'
  | 'approval_requested'
  | 'approval_response'
  | 'rental_reminder'
  | 'welcome'
  | 'password_reset'
  | 'vendor_approved'
  | 'driver_assigned';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f3f4f6; }
    .container { max-width: 600px; margin: 0 auto; padding: 24px; }
    .card { background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 24px; }
    .logo { display: inline-flex; align-items: center; gap: 8px; font-size: 24px; font-weight: 800; color: #111; text-decoration: none; }
    .logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #f97316, #dc2626); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
    .btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #f97316, #dc2626); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px; }
    .footer { text-align: center; margin-top: 24px; color: #9ca3af; font-size: 12px; }
    h1 { font-size: 22px; color: #111827; margin: 0 0 8px; }
    p { color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 16px; }
    .highlight { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; padding: 16px; margin: 16px 0; }
    .item-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
    .total-row { display: flex; justify-content: space-between; padding: 12px 0; font-weight: 700; font-size: 16px; color: #111; border-top: 2px solid #e5e7eb; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <a href="#" class="logo">
          <span class="logo-icon">⚡</span>
          Dreams
        </a>
      </div>
      ${content}
    </div>
    <div class="footer">
      <p>© 2026 Dreams. All rights reserved.</p>
      <p><a href="#" style="color: #f97316;">Unsubscribe</a> | <a href="#" style="color: #f97316;">Settings</a></p>
    </div>
  </div>
</body>
</html>`;
}

export function buildOrderConfirmationEmail(order: Order): EmailPayload {
  const itemsHtml = order.items.map((item) =>
    `<div class="item-row">
      <span>${item.quantity}x ${item.product_name}</span>
      <span style="font-weight:600">${formatCurrency(item.total_price)}</span>
    </div>`
  ).join('');

  return {
    to: '',
    subject: `Order Confirmed — ${order.order_number}`,
    html: baseTemplate(`
      <h1>Order Confirmed! 🎉</h1>
      <p>Your order <strong>${order.order_number}</strong> has been placed successfully.</p>
      <div class="highlight">
        <p style="margin:0;font-weight:600;color:#c2410c;">Estimated Delivery</p>
        <p style="margin:4px 0 0;font-size:24px;font-weight:800;color:#111;">
          ${order.priority === 'critical' ? '15-25 min' : order.priority === 'urgent' ? '25-45 min' : '45-90 min'}
        </p>
      </div>
      <h3 style="font-size:14px;color:#111;margin:20px 0 8px;">Order Items</h3>
      ${itemsHtml}
      <div class="item-row"><span>Subtotal</span><span>${formatCurrency(order.subtotal)}</span></div>
      <div class="item-row"><span>Tax</span><span>${formatCurrency(order.tax)}</span></div>
      <div class="item-row"><span>Delivery</span><span>${formatCurrency(order.delivery_fee)}</span></div>
      ${order.urgent_fee > 0 ? `<div class="item-row"><span style="color:#f97316">Priority Fee</span><span style="color:#f97316">${formatCurrency(order.urgent_fee)}</span></div>` : ''}
      <div class="total-row"><span>Total</span><span>${formatCurrency(order.total)}</span></div>
      <div style="text-align:center;margin-top:24px;">
        <a href="#" class="btn">Track Your Order</a>
      </div>
    `),
  };
}

export function buildDispatchedEmail(order: Order, dispatch: Dispatch): EmailPayload {
  return {
    to: '',
    subject: `Your order is on its way — ${order.order_number}`,
    html: baseTemplate(`
      <h1>Your Order is On Its Way! 🚚</h1>
      <p>Driver <strong>${dispatch.driver_name}</strong> has picked up your order and is heading to your location.</p>
      <div class="highlight">
        <p style="margin:0;font-weight:600;color:#c2410c;">ETA</p>
        <p style="margin:4px 0 0;font-size:24px;font-weight:800;color:#111;">${dispatch.delivery_eta_minutes} minutes</p>
        <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">
          ${dispatch.vehicle_type} — ${dispatch.vehicle_plate}
        </p>
      </div>
      <div style="text-align:center;margin-top:24px;">
        <a href="#" class="btn">Track Live</a>
      </div>
    `),
  };
}

export function buildDeliveredEmail(order: Order): EmailPayload {
  return {
    to: '',
    subject: `Order Delivered — ${order.order_number}`,
    html: baseTemplate(`
      <h1>Order Delivered! ✅</h1>
      <p>Your order <strong>${order.order_number}</strong> has been delivered successfully.</p>
      <p>If everything looks good, no action is needed. If there are any issues, please contact us within 24 hours.</p>
      <div style="text-align:center;margin-top:24px;">
        <a href="#" class="btn">Rate Your Experience</a>
      </div>
    `),
  };
}

export function buildApprovalRequestEmail(approval: ApprovalRequest): EmailPayload {
  return {
    to: '',
    subject: `Approval Needed — ${formatCurrency(approval.amount)} order from ${approval.requested_by_name}`,
    html: baseTemplate(`
      <h1>Approval Required ⚠️</h1>
      <p><strong>${approval.requested_by_name}</strong> has submitted an order that requires your approval.</p>
      <div class="highlight">
        <p style="margin:0;font-weight:600;color:#111;">Amount: ${formatCurrency(approval.amount)}</p>
        <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">${approval.items_summary}</p>
        <p style="margin:8px 0 0;font-size:13px;color:#6b7280;">${approval.reason}</p>
      </div>
      <div style="text-align:center;margin-top:24px;">
        <a href="#" class="btn" style="margin-right:8px;">Approve</a>
        <a href="#" class="btn" style="background:#6b7280;">Reject</a>
      </div>
    `),
  };
}

export function buildWelcomeEmail(name: string): EmailPayload {
  return {
    to: '',
    subject: 'Welcome to Dreams — Your Rescue Platform',
    html: baseTemplate(`
      <h1>Welcome to Dreams, ${name}! 👋</h1>
      <p>You have joined the fastest tool and material delivery platform. When a missing tool threatens to stop work, Dreams saves the day.</p>
      <h3 style="font-size:14px;color:#111;margin:20px 0 8px;">Get Started</h3>
      <p>1. Browse the <strong>Marketplace</strong> — 50,000+ tools and materials</p>
      <p>2. Search, buy or rent, and choose your delivery speed</p>
      <p>3. Track your delivery in real-time</p>
      <div style="text-align:center;margin-top:24px;">
        <a href="#" class="btn">Start Shopping</a>
      </div>
    `),
  };
}

// ---- Send email function ----
export async function sendEmail(template: EmailTemplate, data: Record<string, unknown>) {
  // In production: call your email service
  // const payload = buildEmailPayload(template, data);
  // await fetch('/api/email/send', { method: 'POST', body: JSON.stringify(payload) });
  console.log(`[Email] Would send ${template} email`, data);
}
