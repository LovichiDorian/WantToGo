# 💳 Stripe Integration Guide / Guide d'intégration Stripe

## 🇬🇧 English

### Overview

WantToGo has a prepared structure for Stripe subscription payments. Premium features are currently disabled with "Coming Soon" placeholders.

### When to Implement

Implement Stripe when you're ready to:
- Offer premium subscriptions ($4.99/month or $49 lifetime)
- Process real payments
- Manage subscription lifecycle

### Prerequisites

1. Create a [Stripe account](https://dashboard.stripe.com/register)
2. Get your API keys from the Stripe Dashboard
3. Set up webhooks

### Environment Variables

Add these to your backend `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs (create these in Stripe Dashboard)
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_LIFETIME=price_...
```

### Backend Implementation

1. Install Stripe SDK:
```bash
cd backend
npm install stripe
```

2. Update `premium.service.ts`:

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

async createCheckoutSession(userId: string, priceId: string) {
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
  // Create or get Stripe customer
  let customerId = user?.subscription?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId },
    });
    customerId = customer.id;
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: priceId.includes('lifetime') ? 'payment' : 'subscription',
    success_url: `${process.env.FRONTEND_URL}/settings?subscription=success`,
    cancel_url: `${process.env.FRONTEND_URL}/settings?subscription=cancelled`,
  });

  return { checkoutUrl: session.url };
}
```

3. Implement webhook handler:

```typescript
async handleStripeWebhook(rawBody: Buffer, signature: string) {
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case 'checkout.session.completed':
      await this.activateSubscription(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await this.cancelSubscription(event.data.object);
      break;
  }
}
```

### Frontend Implementation

1. Add Stripe publishable key to frontend `.env`:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

2. Enable checkout in `PremiumBanner.tsx`:

```typescript
const handleCheckout = async (priceId: string) => {
  const { checkoutUrl } = await premiumAPI.createCheckout(priceId);
  if (checkoutUrl) {
    window.location.href = checkoutUrl;
  }
};
```

### Webhook Setup

1. In Stripe Dashboard, go to Developers → Webhooks
2. Add endpoint: `https://your-api.com/premium/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

### Testing

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

### Security Checklist

- [ ] Webhook signature verification
- [ ] HTTPS only in production
- [ ] Price IDs validated server-side
- [ ] No secret keys in frontend code

---

## 🇫🇷 Français

### Vue d'ensemble

WantToGo dispose d'une structure préparée pour les paiements d'abonnement Stripe. Les fonctionnalités Premium sont actuellement désactivées avec des placeholders "Bientôt disponible".

### Quand implémenter

Implémentez Stripe quand vous êtes prêt à :
- Offrir des abonnements premium (4,99 €/mois ou 49 € à vie)
- Traiter de vrais paiements
- Gérer le cycle de vie des abonnements

### Prérequis

1. Créer un [compte Stripe](https://dashboard.stripe.com/register)
2. Obtenir vos clés API depuis le Dashboard Stripe
3. Configurer les webhooks

### Variables d'environnement

Ajoutez ceci à votre fichier `.env` backend :

```env
# Configuration Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# IDs de prix (créez-les dans le Dashboard Stripe)
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_LIFETIME=price_...
```

### Implémentation Backend

1. Installer le SDK Stripe :
```bash
cd backend
npm install stripe
```

2. Mettre à jour `premium.service.ts` (voir exemple anglais ci-dessus)

3. Implémenter le gestionnaire de webhook (voir exemple anglais ci-dessus)

### Implémentation Frontend

1. Ajouter la clé publique Stripe au `.env` frontend :
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

2. Activer le checkout dans `PremiumBanner.tsx` (voir exemple anglais ci-dessus)

### Configuration des Webhooks

1. Dans le Dashboard Stripe, allez dans Développeurs → Webhooks
2. Ajouter endpoint : `https://votre-api.com/premium/webhook`
3. Sélectionner les événements (voir liste anglaise)

### Tests

Utilisez les cartes de test Stripe :
- Succès : `4242 4242 4242 4242`
- Refus : `4000 0000 0000 0002`
- 3D Secure : `4000 0025 0000 3155`

### Checklist Sécurité

- [ ] Vérification de la signature du webhook
- [ ] HTTPS uniquement en production
- [ ] IDs de prix validés côté serveur
- [ ] Pas de clés secrètes dans le code frontend

---

## 📁 Files to Modify / Fichiers à modifier

- `backend/src/modules/premium/premium.service.ts`
- `backend/src/modules/premium/premium.controller.ts`
- `frontend/src/features/premium/components/PremiumBanner.tsx`
- `frontend/src/lib/api/premium.ts`
