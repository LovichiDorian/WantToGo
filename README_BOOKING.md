# 🏨 Booking.com Affiliate Integration / Intégration Affilié Booking.com

## 🇬🇧 English

### Overview

WantToGo includes a Booking.com affiliate link component that displays on place detail pages. Users can find nearby hotels, and you earn commission on bookings.

### How It Works

1. User views a place detail page
2. A "Find hotels nearby" button appears
3. Clicking opens Booking.com with pre-filled location
4. If user books, you earn commission (typically 25-40%)

### Setup Instructions

#### 1. Join Booking.com Affiliate Partner Programme

1. Go to [Booking.com Affiliate Partner Programme](https://www.booking.com/affiliate-program/v2/index.html)
2. Sign up with your business information
3. Wait for approval (usually 1-3 business days)
4. Get your Affiliate ID (aid parameter)

#### 2. Configure Environment Variable

Add to your frontend `.env` file:

```env
# Booking.com Affiliate Configuration
VITE_BOOKING_AFFILIATE_ID=your_affiliate_id_here
```

#### 3. Verify Integration

The `BookingAffiliateLink` component automatically:
- Uses your affiliate ID from environment
- Passes place coordinates for accurate search
- Sets user language (FR/EN)
- Opens in new tab (PWA compatible)

### Component Usage

```tsx
import { BookingAffiliateLink } from '@/features/premium/components/BookingAffiliateLink';

// Button style
<BookingAffiliateLink
  placeName="Eiffel Tower"
  latitude={48.8584}
  longitude={2.2945}
  city="Paris"
/>

// Card style (more prominent)
<BookingAffiliateLink
  placeName="Eiffel Tower"
  latitude={48.8584}
  longitude={2.2945}
  city="Paris"
  variant="card"
/>
```

### URL Parameters

The component builds URLs like:
```
https://www.booking.com/searchresults.html
  ?ss=Paris
  &latitude=48.858400
  &longitude=2.294500
  &aid=YOUR_AFFILIATE_ID
  &lang=en-us
```

### Revenue Tracking

1. Log in to Booking.com Affiliate Dashboard
2. View clicks, bookings, and commission
3. Receive monthly payments via bank transfer

### Legal Requirements

- Affiliate link disclosure is included ("Affiliate link" text)
- Clearly marked as external link with icon
- No deceptive practices

### Best Practices

- Place links contextually (on place detail pages)
- Don't spam users with affiliate links
- Consider showing only for places with nearby accommodation

---

## 🇫🇷 Français

### Vue d'ensemble

WantToGo inclut un composant de lien affilié Booking.com qui s'affiche sur les pages de détail des lieux. Les utilisateurs peuvent trouver des hôtels à proximité, et vous gagnez une commission sur les réservations.

### Comment ça fonctionne

1. L'utilisateur consulte la page de détail d'un lieu
2. Un bouton "Trouver des hôtels" apparaît
3. Un clic ouvre Booking.com avec la localisation pré-remplie
4. Si l'utilisateur réserve, vous gagnez une commission (généralement 25-40%)

### Instructions de configuration

#### 1. Rejoindre le Programme Partenaire Affilié Booking.com

1. Allez sur [Programme Partenaire Affilié Booking.com](https://www.booking.com/affiliate-program/v2/index.html)
2. Inscrivez-vous avec vos informations professionnelles
3. Attendez l'approbation (généralement 1-3 jours ouvrés)
4. Obtenez votre ID Affilié (paramètre aid)

#### 2. Configurer la variable d'environnement

Ajoutez à votre fichier `.env` frontend :

```env
# Configuration Affilié Booking.com
VITE_BOOKING_AFFILIATE_ID=votre_id_affilié_ici
```

#### 3. Vérifier l'intégration

Le composant `BookingAffiliateLink` automatiquement :
- Utilise votre ID affilié depuis l'environnement
- Passe les coordonnées du lieu pour une recherche précise
- Définit la langue de l'utilisateur (FR/EN)
- Ouvre dans un nouvel onglet (compatible PWA)

### Utilisation du composant

```tsx
import { BookingAffiliateLink } from '@/features/premium/components/BookingAffiliateLink';

// Style bouton
<BookingAffiliateLink
  placeName="Tour Eiffel"
  latitude={48.8584}
  longitude={2.2945}
  city="Paris"
/>

// Style carte (plus visible)
<BookingAffiliateLink
  placeName="Tour Eiffel"
  latitude={48.8584}
  longitude={2.2945}
  city="Paris"
  variant="card"
/>
```

### Paramètres d'URL

Le composant construit des URLs comme :
```
https://www.booking.com/searchresults.html
  ?ss=Paris
  &latitude=48.858400
  &longitude=2.294500
  &aid=VOTRE_ID_AFFILIÉ
  &lang=fr
```

### Suivi des revenus

1. Connectez-vous au Dashboard Affilié Booking.com
2. Consultez les clics, réservations et commissions
3. Recevez des paiements mensuels par virement bancaire

### Exigences légales

- La mention de lien affilié est incluse ("Lien affilié")
- Clairement marqué comme lien externe avec icône
- Pas de pratiques trompeuses

### Bonnes pratiques

- Placez les liens de manière contextuelle (sur les pages de détail)
- Ne spammez pas les utilisateurs avec des liens affiliés
- Envisagez de n'afficher que pour les lieux avec hébergement à proximité

---

## 📁 Component Location / Emplacement du composant

`frontend/src/features/premium/components/BookingAffiliateLink.tsx`

## 🔗 Useful Links / Liens utiles

- [Booking.com Affiliate Programme](https://www.booking.com/affiliate-program/v2/index.html)
- [Affiliate Dashboard](https://join.booking.com/)
- [API Documentation](https://developers.booking.com/)
