# CloudFish Merge Notes

CloudFish marketing content has been merged into slpwebsite (slpmicrosystems.com).

## What was added

- **Pricing section** on `/products/cloudfish` (Silver, Gold, Gold-Yearly, Enterprise)
- **Login** at `/cloudfish/login` – uses CloudFish backend API
- **Purchase** at `/cloudfish/purchase` – Stripe checkout flow
- **Thank you** at `/cloudfish/thank-you` – post-payment page
- **Redirects** for old URLs: `/thank-you.html`, `/purchase.html`, `/login.html` → new paths

## Environment variables

Add to Vercel (or `.env.local` for local dev):

```
NEXT_PUBLIC_CLOUDFISH_API_URL=https://cloudfish-backend-9d54cbd015c1.herokuapp.com/api
```

## Backend (Heroku) updates

When slpmicrosystems.com is the main site, set:

```
WEBSITE_URL=https://www.slpmicrosystems.com
STRIPE_SUCCESS_PATH=/cloudfish/thank-you
STRIPE_CANCEL_PATH=/cloudfish/purchase
```

(Defaults already use these paths if not set.)

## CloudFish app links

Product page links now point to:
- Login: `https://cloudfish.slpmicrosystems.com/login`
- App: `https://cloudfish.slpmicrosystems.com/`

## DNS / Vercel

1. Point `slpmicrosystems.com` and `www.slpmicrosystems.com` to the slpwebsite Vercel project
2. `cloudfish.slpmicrosystems.com` can redirect to `www.slpmicrosystems.com/products/cloudfish` or stay as a separate subdomain if needed
