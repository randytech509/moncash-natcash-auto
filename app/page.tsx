export default function Page() {
  return (
    <main className="card">
      <span className="badge">RandyTech Solutions</span>
      <h1>MonCash &amp; NatCash Auto</h1>
      <p>
        Service de vérification automatisée des dépôts MonCash et NatCash par lecture
        des SMS de confirmation reçus sur le téléphone marchand — sans intervention
        manuelle, sans intégration API opérateur.
      </p>
      <p>
        Une app Android légère lit les SMS entrants et les transmet à ce service, qui
        en extrait montant, référence de transaction, sens (reçu/envoyé) et expéditeur.
        Aucune donnée n&apos;est affichée publiquement sur cette page — le point
        d&apos;intégration est l&apos;endpoint <code>/api/ingest</code>, protégé par secret partagé.
      </p>
      <div className="status">
        Statut : <b>service actif</b> — voir le README du dépôt pour l&apos;intégration.
      </div>
    </main>
  );
}
