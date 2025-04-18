
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const handler = async (m, { conn, text, command, prefix }) => {
    if (!m.quoted) {
        return m.reply(`Please send/reply to an image with the caption *${prefix + command} (background name)*`);
    }

    let mime = m.quoted.mimetype || "";
    let backgroundName = text || "natural background";
    let promptText = `Replace the background of this image with a ${backgroundName} setting while keeping the main object intact.`;

    if (!/image\/(jpe?g|png)/.test(mime)) {
        return m.reply(`Format ${mime} is not supported! Only jpeg/jpg/png formats are allowed.`);
    }

    m.reply(`Replacing the background with ${backgroundName}...`);

    try {
        let imgData = await m.quoted.download();
        const base64Image = imgData.toString("base64");

        let genAI = new GoogleGenerativeAI("AIzaSyD8jXcTKeGCTens8beHre0r8N2IKhb43ns");

        const contents = [
            { text: promptText },
            {
                inlineData: {
                    mimeType: mime,
                    data: base64Image,
                },
            },
        ];

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp-image-generation",
            generationConfig: {
                responseModalities: ["Text", "Image"],
            },
        });

        const response = await model.generateContent(contents);

        let resultImage;
        let resultText = "";

        for (const part of response.response.candidates[0].content.parts) {
            if (part.text) {
                resultText += part.text;
            } else if (part.inlineData) {
                const imageData = part.inlineData.data;
                resultImage = Buffer.from(imageData, "base64");
            }
        }

        if (resultImage) {
            const tempPath = path.join(process.cwd(), `background_${Date.now()}.png`);
            fs.writeFileSync(tempPath, resultImage);

            await conn.sendMessage(m.chat, {
                image: { url: tempPath },
                caption: `*Background successfully changed to ${backgroundName}*`,
            }, { quoted: m });

            setTimeout(() => {
                try {
                    fs.unlinkSync(tempPath);
                } catch {}
            }, 30000);
        } else {
            m.reply("Failed to change the background.");
        }
    } catch (error) {
        console.error(error);
        m.reply(`Error: ${error.message}`);
    }
};

handler.command = ["background"];
handler.tags = ["ai"];
handler.help = ["background"].map(a => a + " [text]");

export default handler;