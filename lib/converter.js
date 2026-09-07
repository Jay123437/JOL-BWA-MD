const fs = require('fs');
const path = require('path');
const { tmpdir } = require('os');
const crypto = require('crypto');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Converts an audio buffer into a WhatsApp-compatible PTT (voice note) buffer.
 * @param {Buffer} audioBuffer - The input audio buffer.
 * @param {string} inputExt - The extension/format of the input audio (e.g. 'mp3').
 * @returns {Promise<Buffer>} - The converted OGG/Opus buffer, ready to send as a PTT.
 */
async function toPTT(audioBuffer, inputExt = 'mp3') {
    const filename = crypto.randomBytes(6).toString('hex');
    const inputPath = path.join(tmpdir(), `${filename}.${inputExt}`);
    const outputPath = path.join(tmpdir(), `${filename}.ogg`);

    fs.writeFileSync(inputPath, audioBuffer);

    await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioCodec('libopus')
            .audioBitrate('128k')
            .audioChannels(1)
            .outputOptions(['-avoid_negative_ts make_zero'])
            .toFormat('ogg')
            .on('error', (err) => {
                console.error('❌ ffmpeg PTT conversion error:', err);
                reject(new Error('Could not convert audio to PTT.'));
            })
            .on('end', resolve)
            .save(outputPath);
    });

    const pttBuffer = fs.readFileSync(outputPath);
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    return pttBuffer;
}

module.exports = { toPTT };
