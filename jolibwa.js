// Pont de compatibilité : les plugins font require('../jolibwa'),
// mais le module réel (cmd, commands, AddCommand, Function) vit dans inconnuboy.js.
// On réexporte exactement le même objet/tableau pour que toutes les commandes
// s'enregistrent dans le même registre partagé que celui utilisé par inconnu.js.
module.exports = require('./inconnuboy');
