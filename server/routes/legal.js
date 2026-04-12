import express from "express";

const router = express.Router();

/*
=====================
LEGAL CONTENT
=====================
*/

const legalData = {
  privacy: `
Privacy Policy

We collect basic user information to operate the platform.
Payments are securely processed through Stripe.
We do not store full card details.

Contact: omnera68@gmail.com
`,

  terms: `
Terms & Conditions

By using this website you agree to comply with all rules.
Unauthorized or illegal activity is prohibited.
Payments are handled securely via Stripe.
`,

  refund: `
Refund Policy

Refunds may be requested within 7 days of purchase.
Contact support with your order details.
`,

  cookies: `
Cookie Policy

We use cookies to improve user experience and analytics.
You may disable cookies in browser settings.
`
};

/*
=====================
ROUTES
=====================
*/

router.get("/:type", (req, res) => {
  const { type } = req.params;

  if (!legalData[type]) {
    return res.status(404).json({ error: "Policy not found" });
  }

  res.json({
    type,
    content: legalData[type]
  });
});

export default router;