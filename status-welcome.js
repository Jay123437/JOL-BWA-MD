// ===========================================================
// FONKSYON: Auto Status Save (Option A) + Kòmand .welcome
// Ajiste chemen require yo selon estrikti pwojè w la
// ===========================================================

const { cmd } = require('../command');       // ⚠️ ajiste chemen si bezwen
const config = require('../config');          // ⚠️ ajiste chemen si bezwen
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// -----------------------------------------------------------
// AUTO STATUS SAVE
// Chak fwa yon kontak poste yon estati (foto/videyo), bot la
// otomatikman voye l nan chat pwòp OWNER a san moun pa mande l
//
// ⚠️ ENPÒTAN: Kòd sa a dwe mete NAN fichye ki gen ekoutè prensipal
// mesaj yo (kote 'messages.upsert' deja rele), PA kòm yon plugin
// endepandan — anpil bot deja gen yon fichye konsa (souvan
// status.js oswa nan index.js). Si w mete l de fwa, li ka double.
// -----------------------------------------------------------
async function autoSaveStatus(conn, m) {
    try {
        if (config.AUTO_STATUS_SAVE !== 'true') return;

        const msg = m.messages[0];
        if (!msg?.key || msg.key.remoteJid !== 'status@broadcast') return;
        if (!msg.message) return;

        const ownerJid = config.OWNER_NUMBER + '@s.whatsapp.net';
        const posterJid = msg.key.participant;
        const posterName = "@" + posterJid.split('@')[0];

        const type = Object.keys(msg.message)[0];

        if (type === 'imageMessage') {
            const stream = await downloadContentFromMessage(msg.message.imageMessage, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            await conn.sendMessage(ownerJid, {
                image: buffer,
                caption: `📥 Estati sove otomatikman\n👤 Soti nan: ${posterName}\n📝 ${msg.message.imageMessage.caption || ''}`,
                mentions: [posterJid]
            });
        } else if (type === 'videoMessage') {
            const stream = await downloadContentFromMessage(msg.message.videoMessage, 'video');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            await conn.sendMessage(ownerJid, {
                video: buffer,
                caption: `📥 Estati sove otomatikman\n👤 Soti nan: ${posterName}\n📝 ${msg.message.videoMessage.caption || ''}`,
                mentions: [posterJid]
            });
        }
        // Estati ki se sèlman tèks pa gen medya pou telechaje — ka ajoute si bezwen

    } catch (e) {
        console.log("Erè AutoStatusSave:", e);
    }
}

module.exports = { autoSaveStatus };

// -----------------------------------------------------------
// .welcome on/off - aktive/dezaktive mesaj byenveni otomatik
// (config.js deja gen WELCOME_ENABLE / WELCOME_MSG / WELCOME_IMAGE,
// kòmand sa a sèlman pèmèt OWNER chanje l san touche fichye a)
// -----------------------------------------------------------
cmd({
    pattern: "welcome",
    desc: "Aktive/dezaktive mesaj byenveni nan gwoup",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { args, reply, isGroup, isAdmin, isOwner }) => {
    if (!isGroup) return reply("Kòmand sa a sèlman travay nan gwoup.");
    if (!isAdmin && !isOwner) return reply("Sèl Admin/Owner ka itilize kòmand sa a.");

    const option = args[0]?.toLowerCase();
    if (option === "on") {
        config.WELCOME_ENABLE = "true";
        reply("✅ Mesaj byenveni aktive pou gwoup sa a.");
    } else if (option === "off") {
        config.WELCOME_ENABLE = "false";
        reply("❌ Mesaj byenveni dezaktive pou gwoup sa a.");
    } else {
        reply("Itilize: .welcome on  oswa  .welcome off");
    }
});
