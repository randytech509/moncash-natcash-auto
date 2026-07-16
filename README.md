# MonCash & NatCash Auto — by RandyTech Solutions

Vérification automatisée des dépôts **MonCash** et **NatCash** par lecture des SMS de
confirmation reçus sur le téléphone marchand — sans intégration API opérateur (aucune
n'existe publiquement pour ces deux services en Haïti), sans validation manuelle.

> Ce dépôt est publié à titre de démonstration technique. Voir [LICENSE.md](LICENSE.md)
> — usage commercial soumis à licence.

## Principe

1. Une app Android légère (**SMS Forwarder**, dépôt séparé) tourne sur le téléphone
   marchand et écoute les SMS entrants via un `BroadcastReceiver` (ne nécessite pas
   le rôle « app SMS par défaut »).
2. Chaque SMS provenant d'un expéditeur MonCash/NatCash configuré est transmis en
   HTTPS à `POST /api/ingest` de ce service, avec un secret partagé.
3. Le service parse le texte brut : sens (reçu/envoyé/bruit), montant en centimes HTG,
   référence de transaction, expéditeur — et renvoie le résultat structuré.

Ce service est volontairement **sans état** : il ne stocke rien et ne déclenche aucune
action financière. L'intégration avec un vrai système de portefeuille (crédit
idempotent, rapprochement txId+montant, exclusion des SMS sortants) est la
responsabilité de l'application cliente qui consomme la réponse — voir l'exemple de
rapprochement complet dans [thie-thie-services](https://github.com/randytech509/thie-thie-services)
(`functions/src/lib/deposit-reconcile.ts`), qui utilise exactement ce moteur de parsing.

## API

```
POST /api/ingest
Content-Type: application/json

{
  "secret": "<SMS_HOOK_SECRET>",
  "provider": "MonCash" | "NatCash",
  "text": "<texte brut du SMS>",
  "from": "<numéro expéditeur>"
}
```

Réponse :

```json
{
  "ok": true,
  "parsed": {
    "provider": "NatCash",
    "direction": "in",
    "amountCents": 150000,
    "txId": "26070197494264",
    "sender": "43457660",
    "senderName": "Pavelus Kenel",
    "balanceCents": 449792,
    "raw": "Vous avez recu 1,500 HTG de Pavelus Kenel 43457660 ..."
  }
}
```

## Déploiement

```bash
npm install
vercel env add SMS_HOOK_SECRET production   # secret partagé (32+ octets aléatoires)
vercel --prod
```

## Développement local

```bash
npm install
cp .env.example .env.local   # renseigner SMS_HOOK_SECRET
npm run dev
```

---

Un projet [RandyTech Solutions](https://randytech-agency.com).
