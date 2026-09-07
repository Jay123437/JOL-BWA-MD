const config = require('../config');
const { cmd } = require('../jolibwa');

cmd({
    pattern: "owner",
    alias: ["ownernumber", "creator"],
    desc: "Shows the bot owner's contact.",
    category: "owner",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const ownerNumber = (config.OWNER_NUMBER || '').replace(/[^0-9]/g, '');

        if (!ownerNumber) {
            return reply("❌ Owner number is not configured.");
        }

        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${config.OWNER_NAME || 'Bot Owner'}\nORG:${config.BOT_NAME || ''};\nTEL;type=CELL;type=VOICE;waid=${ownerNumber}:${ownerNumber}\nEND:VCARD`;

        await conn.sendMessage(from, {
            contacts: {
                displayName: config.OWNER_NAME || 'Owner',
                contacts: [{ vcard }]
            }
        }, { quoted: mek });

        await reply(`👑 *Owner:* wa.me/${ownerNumber}`);
    } catch (error) {
        console.error("❌ Error in owner command:", error);
        reply("⚠️ An error occurred while fetching the owner info.");
    }
});
