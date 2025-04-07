import fetch from 'node-fetch'
var handler = async (m, { args, text, usedPrefix, command }) => {
    if (!text) throw `Example : ${usedPrefix + command} https://kahoot.it/challenge/1234567`;
    let id = text.replace("https://www.kahoot.com/it/challenge", "")
    const api = `https://kahoot.it/rest/challenges/${id}/answers`;
    const res = await fetch(api, {
        method: "GET",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Referer": "https://kahoot.it/",
            "DNT": 1,
            "TE": "Trailers"
        }
    })
    const json = await res.json()
    const listQestion = json.challenge.kahoot.questions
    const hasil = listQestion.map((v,i) => {
        const questions = v.question
        const answers = v.choices.filter((v) => v.correct).map((v) => v.answer)
        return `*Pertanyaan ${i + 1} :* ${questions}\n*Jawaban Benar :* ${answers.join(", ")}\n\n`
    }
    ).join("\n\n")

    m.reply(`*Kahoot Challenge*\n\n${hasil}`)
}

handler.help = ['kahootans'].map((v) => v + ' <link>')
handler.tags = ['internet']
handler.command = /^(kahootans)$/i
handler.limit = true
handler.register = true
handler.exp = 0

handler.fail = null

export default handler
