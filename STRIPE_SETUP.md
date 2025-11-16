# 🔐 Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payment integration for your e-commerce system.

---

## 📋 Prerequisites

- Stripe account (Test Mode)
- Node.js and npm installed
- Next.js application running

---

## 🚀 Step-by-Step Setup

### Step 1: Get Your Stripe API Keys

1. **Login to Stripe Dashboard**
   - Go to: https://dashboard.stripe.com/
   - Make sure you're in **TEST MODE** (toggle in top-right corner)

2. **Get Your API Keys**
   - Navigate to: **Developers** → **API keys**
   - You'll see two keys:
     - **Publishable key** (starts with `pk_test_`)
     - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"

3. **Copy Both Keys**
   - Copy the **Secret key** (sk_test_...)
   - Copy the **Publishable key** (pk_test_...)

---

### Step 2: Add Keys to Environment Variables

1. **Open `.env.local` file** in your project root

2. **Replace the placeholder values:**
   ```env
   # Stripe API Keys (Test Mode)
   STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE
   ```

3. **Save the file**

---

### Step 3: Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## ✅ Testing the Integration

### Test with Stripe Test Cards

Stripe provides test card numbers that you can use:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Payment declined |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |

**For all test cards:**
- Use any future expiration date (e.g., 12/25)
- Use any 3-digit CVC (e.g., 123)
- Use any ZIP code (e.g., 12345)

---

## 🧪 Complete Test Flow

1. **Place an Order:**
   - Go to http://localhost:3000/products
   - Add products to cart
   - Go to cart and fill in customer information
   - Click "Place Order & Pay"

2. **You'll Be Redirected to Stripe:**
   - Real Stripe checkout page will open
   - Enter test card: `4242 4242 4242 4242`
   - Enter any future date, CVC, and ZIP
   - Click "Pay"

3. **After Successful Payment:**
   - You'll be redirected back to success page
   - Order status will be updated to "paid"
   - Revenue will be recorded automatically

4. **Check Stripe Dashboard:**
   - Go to https://dashboard.stripe.com/test/payments
   - You'll see your test payment listed
   - Click on it to see full details

---

## 📊 What You'll See in Stripe Dashboard

### Products
- Location: **Products** tab
- Each order creates a product: "Order ORD-XXXXX"

### Payments
- Location: **Payments** tab
- Shows all completed test payments
- Status: Succeeded/Failed
- Amount, customer email, date

### Payment Links
- Location: **Payment links** tab
- Shows all generated payment links
- Status: Completed/Active

---

## 🔄 Payment Flow Diagram

```
Customer Places Order
        ↓
Order Created (payment_status = 'pending')
        ↓
Stripe Product Created
        ↓
Stripe Price Created
        ↓
Stripe Payment Link Generated
        ↓
Customer Redirected to Stripe
        ↓
Customer Enters Card Details
        ↓
Payment Processed by Stripe
        ↓
Customer Redirected Back
        ↓
Order Status Updated to 'paid'
        ↓
Revenue Recorded Automatically
```

---

## 🎯 Important Notes

### Test Mode vs Live Mode

- **Test Mode**: No real money, use test cards
- **Live Mode**: Real payments, real cards, real money

**Always test thoroughly in Test Mode before going live!**

### Security

- ✅ **Never commit `.env.local` to Git**
- ✅ **Keep your Secret Key private**
- ✅ **Only use Publishable Key in frontend**
- ✅ **Use HTTPS in production**

---

## 🐛 Troubleshooting

### "Stripe is not configured" Error
- Check if `STRIPE_SECRET_KEY` is set in `.env.local`
- Make sure you restarted the dev server after adding keys
- Verify the key starts with `sk_test_`

### Payment Link Not Created
- Check console for error messages
- Verify Stripe API keys are correct
- Check if you're in Test Mode in Stripe Dashboard

### Payment Not Updating Order Status
- Currently using manual verification
- Check `/order/success` page
- Admin can manually mark as paid in dashboard

---

## 📞 Support

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Test Cards**: https://stripe.com/docs/testing
- **Stripe Dashboard**: https://dashboard.stripe.com/

---

## 🎉 You're All Set!

Your Stripe payment integration is now ready to test!

Try placing a test order and see the magic happen! ✨

