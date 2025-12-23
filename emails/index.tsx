import { SENDER_EMAIL, SENDER_NAME } from '@/lib/constants'
import { IOrder } from '@/lib/db/models/order.model'
import { Resend } from 'resend'
import AskReviewOrderItemsEmail from './ask-review-order-items'
import PurchaseReceiptEmail from './purchase-receipt'

const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

export const sendPurchaseReceipt = async ({ order }: { order: IOrder }) => {
  await getResend().emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: (order.user as { email: string }).email,
    subject: 'Order Confirmation',
    react: <PurchaseReceiptEmail order={order} />,
  })
}

export const sendAskReviewOrderItems = async ({ order }: { order: IOrder }) => {
  const oneDayFromNow = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()

  await getResend().emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: (order.user as { email: string }).email,
    subject: 'Review your order items',
    react: <AskReviewOrderItemsEmail order={order} />,
    scheduledAt: oneDayFromNow,
  })
}
