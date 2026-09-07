# D-UNDER mobile

## Mise à jour immersive — 31 août 2026

- Playlist placée dans la partie haute et « Nous sommes D-UNDER » déplacé en conclusion du site.
- Toutes les cartes musicales visibles disposent d'une destination d'écoute.
- Candidature artiste compatible Netlify Forms avec états envoi/succès/erreur.
- ALIEN XP de Kemi2Vinci présenté comme disponible avec son lien Untitled officiel.
- Thème Black neutralisé en noir, anthracite, gris et argent, logo compris.
- Motion design CSS/JavaScript léger, responsive et compatible `prefers-reduced-motion`.
- Explore The Scene conserve 4 colonnes × 2 rangées sur desktop et le swipe mobile.

Spotify Redirect URIs : `http://localhost:8888/.netlify/functions/spotify-callback` et `https://VOTRE-SITE.netlify.app/.netlify/functions/spotify-callback`. Dans Netlify, créez `SPOTIFY_CLIENT_ID` et `SPOTIFY_REDIRECT_URI`. Le flux utilise Authorization Code avec PKCE.

Répartissez les artistes dans `SCENE.newWave`, `SCENE.established` et `SCENE.legacy`. Ajoutez uniquement de vraies URLs autorisées dans `TRACKS[].preview`. Complétez KRIBI uniquement après validation des informations officielles.

## Mise à jour stabilité — septembre 2026

- recherche globale sur l'ensemble de la base artistes, morceaux et projets ;
- Focus dynamique sur le catalogue complet ;
- onglets Musique et Charts fonctionnels avec états neutres sans données fictives ;
- ALIEN XP au-dessus de KRIBI, avec tracklists accessibles et états vérifiés ;
- thème Mboko renommé côté interface, préférence historique migrée et logo isolé du Bleu Nuit ;
- structure du Lexique Mboko prête, sans mots ni définitions inventés ;
- correctifs responsive, réduction des animations et suppression du scroll horizontal.

Les données évolutives sont centralisées dans `maintenance.js`. Tant qu'une tracklist, une URL ou une statistique n'est pas officiellement vérifiée, conserver l'état neutre prévu au lieu d'ajouter une valeur estimée.
