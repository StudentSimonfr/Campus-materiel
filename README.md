# Campus Matériel (React + TypeScript)

Application web monopage de réservation de matériel. **React 19 + TypeScript + Vite + React Router 6.**
Aucun backend : tout est stocké dans `localStorage`. La connexion est simulée.

## Installation et lancement
Le dossier `src/` fourni remplace celui de votre projet Vite (`atelier-api`).
```bash
npm install react-router-dom   # seule dépendance ajoutée
npm run dev                    # http://localhost:5173
npm run build                  # vérification TypeScript + build de production
npm run lint
```
Supprimer `src/App.css` (plus utilisé : les styles sont dans `src/index.css`).

## Comptes de démonstration
| id | Nom | Rôle |
|---|---|---|
| 1 | Alice Martin | Étudiant |
| 2 | Yanis Bernard | Étudiant |
| 3 | Camille Dupont | Responsable |

## Routes
| Route | Accès | Rôle |
|---|---|---|
| `/` | tous | Redirection selon la session (login / catalogue / gestion) |
| `/login` | public | Choix du compte |
| `/catalogue` | connecté | Liste, recherche par nom, filtre par catégorie |
| `/materiels/:id` | connecté | Fiche détaillée + réservation (étudiants) |
| `/mes-reservations` | étudiant | Réservations personnelles + annulation |
| `/gestion`, `/gestion/nouveau`, `/gestion/:id/modifier` | responsable | Administration (chargée à la demande) |
| `/acces-refuse` | public | Accès refusé |
| `*` | public | 404 |

## Structure
```
src/
├── main.tsx, App.tsx            Point d'entrée + routes (lazy loading de /gestion)
├── data/
│   ├── donnees-initiales.ts     Données fournies (types, comptes, équipements, réservations)
│   └── libelles.ts              Libellés des rôles
├── services/storage.ts          localStorage sécurisé (try/catch) + uuid
├── context/
│   ├── AppContext.ts            Types + objet Context
│   ├── AppProvider.tsx          État partagé + TOUTES les règles métier
│   └── useApp.ts                Hook d'accès au contexte
├── components/                  Layout, ProtectedRoute, EquipmentCard, EquipmentForm
├── hooks/useKeyboardNavigation.ts  Navigation aux flèches + espace
└── pages/                       Login, Catalogue, EquipmentDetail, MyReservations, AccessDenied, NotFound
    └── gestion/                 Gestion, EquipmentFormPage (lazy)
```

## Parcours d'une réservation
1. **Clic** sur « Réserver » (`EquipmentCard` appelle la prop `onReserve` du parent `Catalogue`, ou bouton de `EquipmentDetail`).
2. **Vérifications** dans `reserve()` (`AppProvider.tsx`) : rôle étudiant, équipement existant, équipement disponible.
3. **État** : `setRes([...reservations, { id: uuid, equipementId, etudiantId }])`.
4. **Sauvegarde** : `persist()` écrit dans `localStorage` via `services/storage.ts`.
5. **Interface** : React re-rend tous les composants liés au contexte (badge, bouton, « Mes réservations ») + message de confirmation.

## Règles métier
- **Pas de champ « disponible »** : `isAvailable(id)` = aucune réservation active avec cet `equipementId`.
- Annuler = retirer l'entrée de la liste des réservations ; l'équipement redevient disponible immédiatement.
- L'annulation vérifie que `etudiantId` correspond à l'utilisateur connecté.
- Suppression d'un équipement réservé : refusée avec un message explicite.
- Données initiales (copiées avec `structuredClone`) chargées **uniquement si la clé n'existe pas** dans `localStorage` ; un tableau vide enregistré est une donnée valide.
- Nouvel équipement : id = plus grand id existant + 1 (jamais `length + 1`). Réservation : `crypto.randomUUID()`.
- Catégories limitées à `CATEGORIES` (liste déroulante) : Informatique, Projection, Photo, Audio.

## Fonctionnalités réalisées
Connexion/déconnexion simulée avec session persistante · routes protégées par session et rôle (URL directe incluse) · accès refusé / 404 / équipement inexistant · catalogue avec recherche, filtre, disponibilité, fiche détaillée · messages « catalogue vide » et « aucun résultat » · réservation et annulation · « Mes réservations » · gestion complète (liste, création, modification, suppression avec confirmation) · un seul formulaire contrôlé avec validation (nom ≥ 3, description ≥ 10, champs obligatoires, valeurs conservées) · gestion des erreurs `localStorage` · lien actif surligné · responsive, thème clair/sombre, messages `aria-live`.

## Navigation au clavier
| Touche | Action |
|---|---|
| ↓ ↑ ← → | Déplace le focus vers l'élément cliquable le plus proche dans cette direction (cartes, tableau, menu, boutons) |
| Barre d'espace | Valide l'élément sélectionné (boutons et liens) |
| Échap | Ferme la fenêtre de confirmation |
| Tab / Maj+Tab | Navigation classique (toujours disponible) |

Dans un champ de saisie, ← → déplacent le curseur et ↑ ↓ quittent le champ ; dans une zone de texte ou une liste déroulante, les flèches gardent leur rôle habituel. Quand une fenêtre de confirmation est ouverte, la navigation reste à l'intérieur. Code : `src/hooks/useKeyboardNavigation.ts`, activé dans `Layout.tsx`.

## Limites connues
- Protections **uniquement frontend** (démonstration, pas de sécurité réelle).
- Données propres à chaque navigateur, pas de synchronisation entre onglets en direct.
- Pas d'historique des réservations annulées, pas de dates, pas d'images.
- Pas de tests automatisés ; extensions facultatives non réalisées.
- Ajouter une catégorie nécessite de modifier `CATEGORIES` dans `donnees-initiales.ts`.

## Scénario de contrôle
1. Ouvrir `/mes-reservations` sans être connecté → redirection vers `/login`.
2. Alice réserve l'équipement 101 ; il apparaît dans « Mes réservations » ; F5 : conservé.
3. Yanis : ne voit pas cette réservation, bouton « Réserver » désactivé sur le 101.
4. Camille : modifie une fiche ; tente de supprimer le 101 → refus explicite.
5. Alice annule → le 101 est de nouveau « Disponible ».
6. Tester `/nimporte-quoi` (404), `/materiels/999` (introuvable), `/gestion` en étudiant (accès refusé).
