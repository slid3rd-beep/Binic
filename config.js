/* Configuration du partage entre téléphones.
 *
 * Laisser SYNC_URL vide  → l'app marche quand même, mais chacun garde
 *                          ses commentaires et son planning sur son téléphone.
 * Renseigner SYNC_URL    → commentaires et planning partagés entre tous.
 *
 * Comment obtenir SYNC_URL en 3 minutes (Firebase Realtime Database, gratuit) :
 * voir la section « Partage entre téléphones » du README.md.
 * Format attendu :  https://mon-projet-default-rtdb.europe-west1.firebasedatabase.app
 */

const SYNC_URL = "";

/* Nom du "salon" partagé. Tous ceux qui ont la même valeur voient
   les mêmes commentaires. Changez-la si vous voulez repartir de zéro. */
const SYNC_ROOM = "bretagne-2026";
