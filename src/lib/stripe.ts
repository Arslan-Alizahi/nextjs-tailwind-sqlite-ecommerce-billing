import Stripe from 'stripe'

// Initialize Stripe with secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  console.warn('⚠️  STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia',
      typescript: true,
    })
  : null

/**
 * Create a Stripe product for an order
 */
export async function createStripeProduct(name: string, description?: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in .env.local')
  }

  const product = await stripe.products.create({
    name,
    description,
  })

  return product
}

/**
 * Create a Stripe price for a product
 */
export async function createStripePrice(
  productId: string,
  amountInCents: number,
  currency: string = 'usd'
) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in .env.local')
  }

  const price = await stripe.prices.create({
    product: productId,
    unit_amount: amountInCents,
    currency,
  })

  return price
}

/**
 * Create a Stripe payment link
 */
export async function createStripePaymentLink(
  priceId: string,
  quantity: number = 1,
  metadata?: Record<string, string>
) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in .env.local')
  }

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: priceId,
        quantity,
      },
    ],
    metadata,
    after_completion: {
      type: 'redirect',
      redirect: {
        // Pass orderId in URL for direct success page access
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/stripe/verify-payment?session_id={CHECKOUT_SESSION_ID}`,
      },
    },
  })

  return paymentLink
}

/**
 * Retrieve a payment intent by ID
 */
export async function getPaymentIntent(paymentIntentId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in .env.local')
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  return paymentIntent
}

/**
 * List payment intents for a customer
 */
export async function listPaymentIntents(customerId?: string, limit: number = 10) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in .env.local')
  }

  const paymentIntents = await stripe.paymentIntents.list({
    customer: customerId,
    limit,
  })

  return paymentIntents
}

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
  return stripe !== null
}

