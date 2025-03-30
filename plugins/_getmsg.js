export async function all(m) {    
    try {
        let chat = global.db.data.chats[m.chat]
        let user = global.db.data.users[m.sender]
        if (!m.isGroup || m.chat.endsWith('broadcast') || chat.isBanned || user.banned || m.isBaileys) return
        let msgs = chat.listStr
        if (!msgs || !(m.text.toLowerCase() in msgs)) return
        
        let _m = await this.serializeM(JSON.parse(JSON.stringify(msgs[m.text.toLowerCase()]), (_, v) => {
            if (
                v !== null &&
                typeof v === 'object' &&
                'type' in v &&
                Array.isArray(v.data)) {
                return Buffer.from(v.data)
            }
            return v
        }))
        
        if (!_m) return
        
        await this.sendMessage(m.chat, { forward: _m }, { quoted: m }).catch(() => {
            return this.sendMessage(m.chat, _m.message, { quoted: m })
        })
    } catch (error) {
        console.error('Error in _getmsg:', error)
    }
}