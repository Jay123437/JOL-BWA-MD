const { cmd } = require('../jolibwa');

cmd({
    pattern: "bot",
    desc: "Shows who owns the bot.",
    category: "main",
    react: "🦎",
    filename: __filename
},
async (conn, mek, m, { reply }) => {
    try {
        await reply("HEYY JOLIBWA IS MY OWNER🦎✨");
    } catch (error) {
        console.error("❌ Error in bot command:", error);
        reply("⚠️ An error occurred while processing the command.");
    }
});
