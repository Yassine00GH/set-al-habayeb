mixin () {
  public query func getApiDoc() : async Text {
    "## API du restaurant — Restaurant Set Al Habayeb\n" #
    "\n" #
    "Ce backend expose le menu du restaurant (plats populaires avec descriptions, catégories et prix en dinars tunisiens) ainsi qu'un formulaire de réservation de table. Il est entièrement en français.\n" #
    "\n" #
    "## Méthodes publiques\n" #
    "\n" #
    "### Menu\n" #
    "- `getDishes() : async [Dish]` — renvoie la liste complète des plats du menu. Chaque `Dish` contient : `id` (Nat), `name` (Text), `description` (Text), `category` (variante `#plats` | `#boissons` | `#desserts`), `priceDt` (Nat, prix en dinars tunisiens), `imageRef` (Text), `popular` (Bool), `tags` ([Text]).\n" #
    "- `getDish(id : Nat) : async ?Dish` — renvoie le plat correspondant à l'identifiant, ou `null` s'il n'existe pas.\n" #
    "\n" #
    "### Réservation\n" #
    "- `createReservation(name : Text, date : Text, time : Text, partySize : Nat, message : Text) : async Reservation` — enregistre une demande de réservation et renvoie la réservation créée. Chaque `Reservation` contient : `id` (Nat), `name` (Text), `date` (Text), `time` (Text), `partySize` (Nat), `message` (Text), `createdAt` (Int, horodatage en nanosecondes).\n" #
    "- `getReservations() : async [Reservation]` — renvoie la liste de toutes les réservations enregistrées.\n" #
    "\n" #
    "### Galerie\n" #
    "- `getGalleryImages() : async [GalleryImage]` — renvoie la liste des photos de la galerie. Chaque `GalleryImage` contient : `id` (Nat), `name` (Text, nom du fichier d'origine), `blob` (ExternalBlob, référence vers le fichier stocké hors chaîne), `createdAt` (Int, horodatage en nanosecondes).\n" #
    "- `uploadGalleryImage(name : Text, blob : ExternalBlob) : async GalleryImage` — téléverse une photo dans la galerie et renvoie l'image créée. Le contenu binaire est stocké hors chaîne via le stockage de fichiers de la plateforme ; le backend ne conserve que la référence (`blob`). Le frontend effectue le téléversement réel avec suivi de progression (`ExternalBlob.fromBytes` + `withUploadProgress`).\n" #
    "\n" #
    "### OQL (requêtes structurées)\n" #
    "- `schema() : async Text` — décrit les entités interrogeables (`dish`, `reservation`).\n" #
    "- `execute(query : Text) : async Text` — exécute une requête JSON OQL sur les entités exposées.\n" #
    "\n" #
    "### Authentification (fournie par le mixin d'autorisation)\n" #
    "- `_initialize_access_control()` — initialise le contrôle d'accès ; le premier appelant connecté devient administrateur.\n" #
    "- `_internet_identity_sign_in_start()` / `_internet_identity_sign_in_finish(...)` — flux de connexion Internet Identity.\n" #
    "- `assignCallerUserRole(role)` / `getCallerUserRole()` / `isCallerAdmin()` — gestion des rôles de l'appelant.\n" #
    "\n" #
    "## Authentification et autorisation\n" #
    "\n" #
    "L'application utilise Internet Identity via le mixin d'autorisation. La plupart des méthodes du menu (`getDishes`, `getDish`) sont publiques et accessibles sans connexion. La création de réservation (`createReservation`) et la lecture des réservations (`getReservations`) sont des méthodes partagées accessibles à tout appelant connecté ou non ; aucune garde de rôle n'est appliquée sur ces méthodes dans la source actuelle.\n" #
    "\n" #
    "Les méthodes de gestion des rôles (`assignCallerUserRole`, `getCallerUserRole`, `isCallerAdmin`) et l'initialisation du contrôle d'accès exigent un appelant connecté (non anonyme). Le premier utilisateur connecté via l'interface de l'application devient automatiquement administrateur ; les appelants suivants reçoivent le rôle `#user` (ou `#guest` s'ils sont anonymes).\n" #
    "\n" #
    "### Dérivation d'identité\n" #
    "Le frontend épingle une origine de dérivation Internet Identity, publiée à `/.well-known/ii-derivation-origin` lorsqu'elle est disponible. Un agent détenant déjà l'autorisation Internet Identity de l'utilisateur dérive le principal propre à l'application contre cette origine (par exemple `icp identity link web <nom> --app <hôte>`). Une telle délégation agit avec la pleine autorité de l'utilisateur dans cette application jusqu'à son expiration.\n" #
    "\n" #
    "L'enregistrement d'un appelant se produit uniquement lorsqu'il se connecte via le frontend de l'application. Un principal qui ne s'est jamais connecté via ce frontend est donc non enregistré, même s'il appartient au propriétaire de l'application ; et un appelant connecté dérivé contre une autre origine est un principal différent de celui enregistré par le frontend.\n" #
    "\n" #
    "## Unités et encodages\n" #
    "\n" #
    "- **Prix** : `priceDt` est exprimé en dinars tunisiens (DT), entier `Nat` dans la fourchette 20–70 DT.\n" #
    "- **Horodatage** : `createdAt` est un entier `Int` en nanosecondes depuis l'époque Unix (valeur de `Time.now()`).\n" #
    "- **Identifiants** : `id` des plats et réservations sont des entiers `Nat`.\n" #
    "- **Catégorie** : variante Motoko `#plats` | `#boissons` | `#desserts`.\n" #
    "- **Dates/heures** : `date` et `time` sont des chaînes de caractères libres (par exemple `date` = \"2026-09-10\", `time` = \"20:30\").\n" #
    "- **Valeurs optionnelles** : `getDish` renvoie `null` quand le plat n'existe pas.\n" #
    "- **Fichiers** : le champ `blob` d'une `GalleryImage` est un `ExternalBlob` (référence binaire opaque vers un fichier stocké hors chaîne). Il ne faut jamais inspecter l'URL de téléversement pour déterminer le type de fichier ; utiliser le champ `name` (nom de fichier d'origine) à la place.\n" #
    "\n" #
    "## Cycle de vie et interrogation\n" #
    "\n" #
    "Les plats sont initialisés au déploiement (données de menu pré-remplies) et ne changent pas au fil du temps. Les réservations sont ajoutées de manière incrémentale via `createReservation`. Les photos de la galerie sont ajoutées via `uploadGalleryImage`. Il n'y a pas de tâche asynchrone ni de sondage requis : les lectures (`getDishes`, `getDish`, `getReservations`, `getGalleryImages`) sont des requêtes instantanées.\n" #
    "\n" #
    "## Sécurité de relance des mutations\n" #
    "\n" #
    "`createReservation` est idempotente par appel : chaque appel ajoute exactement une réservation avec un nouvel `id` incrémental. Un double-clic ou une relance d'un même appel crée deux réservations distinctes. Il n'y a pas de clé de déduplication ; le frontend doit éviter d'envoyer deux fois la même demande.\n" #
    "\n" #
    "`uploadGalleryImage` est également idempotente par appel : chaque appel ajoute une nouvelle `GalleryImage` avec un `id` incrémental. Une relance du même appel crée une entrée de galerie supplémentaire (et un téléversement hors chaîne correspondant).\n" #
    "\n" #
    "## Erreurs, limites et pièges\n" #
    "\n" #
    "- `getDish` ne piège jamais : il renvoie `null` pour un identifiant inconnu.\n" #
    "- `createReservation` ne valide pas les champs (nom vide, date/heure, taille de groupe) ; les valeurs sont stockées telles quelles.\n" #
    "- Les méthodes de gestion des rôles piègent (`Runtime.trap`) si l'appelant n'est pas autorisé.\n" #
    "- Les prix sont des entiers ; il n'y a pas de décimale (pas de millimes).\n" #
    "- Les réservations ne sont pas connectées à un agenda ni à une commande à emporter (hors périmètre).\n" #
    "- `uploadGalleryImage` ne valide pas le type de fichier côté backend ; le frontend restreint le choix aux images. Le téléversement réel est effectué par le frontend via le stockage de fichiers de la plateforme ; un échec de téléversement (par exemple `403 Forbidden: Invalid payload`) survient si le mixin de stockage d'objets n'est pas correctement câblé côté backend.\n" #
    "- Les entités OQL `dish` et `reservation` sont interrogeables ; `dish` est public, `reservation` est réservé au contrôleur."
  };
};
