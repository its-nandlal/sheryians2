import Razorpay from 'razorpay'
import { env } from '@/lib/env'
import crypto from 'crypto'


export const razorpayInstance = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET
})

// Signature Verification
export function verifyRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string,
): boolean {
    const text = `${orderId}|${paymentId}`
    const generated = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET!)
    .update(text)
    .digest('hex')

    return generated === signature
}

// Webhook Signature Verification
export function verifyWebhookSignature(
    payload: string,
    signature: string
) : boolean {
    const generated = crypto
    .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex')

    return generated === signature
}