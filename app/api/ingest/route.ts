import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { parseSms, SmsProvider } from "@/lib/sms";

export const runtime = "nodejs";

/** Comparaison à temps constant — évite qu'un attaquant déduise le secret octet par octet
 *  en mesurant les micro-différences de latence d'un `!==` classique (fuite de timing). */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Endpoint d'ingestion SMS MonCash/NatCash — reçoit le POST de l'app Android SMS-forwarder,
 * parse le SMS brut, renvoie le résultat structuré directement dans la réponse (visible dans
 * le journal de l'app elle-même — pas de stockage serveur, pas d'endpoint public exposant des
 * données de transaction réelles).
 *
 * Contrat attendu (identique à l'app forwarder) : { secret, provider, text, from }.
 *
 * SÉCURITÉ : protégé par un secret partagé (SMS_HOOK_SECRET). Ce service ne fait QUE parser —
 * il ne crédite aucun wallet ni ne déclenche d'action financière ; l'intégration avec un vrai
 * système de portefeuille (idempotence, direction du SMS, rapprochement txId+montant) reste la
 * responsabilité de l'application cliente, comme documenté dans le README.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SMS_HOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "SMS_HOOK_SECRET non configuré côté serveur" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.secret !== "string" || !safeEqual(body.secret, secret)) {
    return NextResponse.json({ ok: false, error: "secret invalide" }, { status: 401 });
  }

  const provider = body.provider as SmsProvider;
  if (provider !== "MonCash" && provider !== "NatCash") {
    return NextResponse.json({ ok: false, error: "provider doit être 'MonCash' ou 'NatCash'" }, { status: 400 });
  }

  const rawText = String(body.text ?? body.message ?? "");
  if (!rawText.trim()) {
    return NextResponse.json({ ok: false, error: "text (SMS) manquant" }, { status: 400 });
  }

  const parsed = parseSms(provider, rawText);

  return NextResponse.json({ ok: true, parsed });
}
