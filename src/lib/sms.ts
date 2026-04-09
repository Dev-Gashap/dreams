// SMS notification system
// In production: connect to Twilio, MessageBird, or AWS SNS

import type { Order, Dispatch } from '@/types';
import { formatCurrency } from '@/lib/utils';

export type SMSTemplate =
  | 'order_confirmed'
  | 'driver_assigned'
  | 'driver_nearby'
  | 'order_delivered'
  | 'verification_code'
  | 'order_cancelled'
  | 'rental_due'
  | 'critical_alert';

interface SMSPayload {
  to: string;
  body: string;
}

export function buildOrderConfirmedSMS(order: Order): SMSPayload {
  return {
    to: '',
    body: `Dreams: Order ${order.order_number} confirmed! Total ${formatCurrency(order.total)}. ETA ${order.priority === 'critical' ? '15-25min' : order.priority === 'urgent' ? '25-45min' : '45-90min'}. Track: dreams.app/track`,
  };
}

export function buildDriverAssignedSMS(order: Order, dispatch: Dispatch): SMSPayload {
  return {
    to: '',
    body: `Dreams: Driver ${dispatch.driver_name} assigned to your order ${order.order_number}. ETA ${dispatch.delivery_eta_minutes} min. Track live: dreams.app/track`,
  };
}

export function buildDriverNearbySMS(dispatch: Dispatch): SMSPayload {
  return {
    to: '',
    body: `Dreams: Your driver ${dispatch.driver_name} is 5 min away! Vehicle: ${dispatch.vehicle_type} ${dispatch.vehicle_plate}. Reply HELP for support.`,
  };
}

export function buildOrderDeliveredSMS(order: Order): SMSPayload {
  return {
    to: '',
    body: `Dreams: Order ${order.order_number} delivered! Rate your experience: dreams.app/rate. Reply STOP to opt out.`,
  };
}

export function buildVerificationCodeSMS(code: string): SMSPayload {
  return {
    to: '',
    body: `Dreams verification code: ${code}. Valid for 10 minutes. Do not share this code with anyone.`,
  };
}

export function buildCriticalAlertSMS(message: string): SMSPayload {
  return {
    to: '',
    body: `Dreams URGENT: ${message}. Open app for details: dreams.app`,
  };
}

// ---- Send SMS function ----
export async function sendSMS(template: SMSTemplate, to: string, data: Record<string, unknown>) {
  // In production:
  // const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  // const payload = buildSMSPayload(template, data);
  // await twilio.messages.create({
  //   body: payload.body,
  //   from: process.env.TWILIO_FROM,
  //   to: payload.to,
  // });
  console.log(`[SMS] Would send ${template} to ${to}`, data);
}

// ---- Phone number validation ----
export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+1 (${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7)}`;
  }
  return phone;
}
