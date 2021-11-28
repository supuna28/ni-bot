const db = require('../database.json')


const menu = (number, botName) => {
    const users = db.users[number]
    let totalusers = Object.keys(db.users).length
    const more = String.fromCharCode(8206)
    const readMore = more.repeat(4001)

    return `  
┌─【 ${botName} 】
│ Olá, ${users.name}!
│
│ *${users.limit} Coins*
│ Patente: *${users.role}*
│ Nível *${users.level} (${users.exp})*
│ 
│ Usuários ativos: ${totalusers}
└────
${readMore}
┌─【 Principal 】
│↣ !menu
└────

┌─【 Jogos 】
│↣ 
└────

┌─【 EXP & Coins 】
│↣ 
└────

┌─【 Stickers 】
│↣ !f (legenda)
│↣ !ts (texto)
│↣ !ats (texto)
└────

┌─【 Hentai & Porn 】
│↣ 
└────

┌─【 Administrador 】
│↣ 
└────

┌─【 Grupos 】
│↣ 
└────

┌─【 Premium 】
│↣ 
└────

┌─【 Internet 】
│↣ 
└────

┌─【 Chat anônimo 】
│↣ 
└────

┌─【 Imagens 】
│↣ 
└────

┌─【 Downloads 】
│↣ 
└────

┌─【 Ferramentas 】
│↣ 
└────

┌─【 Diversão】
│↣ 
└────

┌─【 Database 】
│↣ 
└────

┌─【 Votação 】
│↣ 
└────

┌─【 Informações 】
│↣ 
└────

┌─【 Áudio 】
│↣ 
└────

┌─【 Sem categoria 】
│↣ 
└────
`
}


exports.menu = menu

