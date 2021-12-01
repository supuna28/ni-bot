require('./config.js')
const {
    MessageType,
    WAMessage,
    ReconnectMode,
    WAProto,
    useSingleFileAuthState,
    MediaType,
    MessageOptions,
    Mimetype,
    DisconnectReason,
    downloadContentFromMessage,
    generateWAMessageFromContent,
    proto
} = require('@adiwajshing/baileys-md')
var pino = require("pino");
var baileys = require("@adiwajshing/baileys-md");
const axios = require('axios').default
const fs = require('fs')
const moment = require('moment-timezone')
const chalk = require('chalk')
const CFonts  = require('cfonts')
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')
const WSF = require('wa-sticker-tew')
const { color, log } = require('console-log-colors');
const { red, green, cyan } = color;
const db = require('./database/database.json')
//const { sticker } = require('./lib/sticker2')

const option = JSON.parse(fs.readFileSync('./options/option.json'))

const footerText = 'Ni-Bot - Nify Tech'

const {
    botName,
    ownerName,
    ownerNumber
} = option

const packname = 'Ni-Bot';
const author = 'Nify Tech';
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const { saveState, state } = useSingleFileAuthState('./database/auth.json');


(async () => {
	CFonts.say('Ni-bot', {
    font: 'block',
    align: 'center',
    gradient: ['green', 'magenta']
    })
    CFonts.say('New update', {
    font: 'block',
    align: 'center',
    gradient: ['green', 'magenta']
    })
    CFonts.say('By Nify Tech', {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']
    })
    CFonts.say('---------------------------- LOGS ----------------------------', {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']
    })
    prefix = [
        '!',
        '.',
        '$'
    ]
    var client = undefined;
	
    var startSock = () => {
        const client = baileys["default"]({
            printQRInTerminal: true,
            browser: ['Ni-Bot Multi-Device', "Safari", "3.0"],
            logger: pino({ level: 'warn' }),
            auth: state
        })


        client.ev.on('messages.upsert', async m => {
            
            try {
                const msg = m.messages[0]
                if (!msg.message) return
                msg.message = (Object.keys(msg.message)[0] === 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message
                if (!msg.message) return
                if (msg.key && msg.key.remoteJid == 'status@broadcast') return
                if (msg.key.fromMe) return

                const from = msg.key.remoteJid
                const type = Object.keys(msg.message)[0]
                const time = moment.tz('America/Sao_Paulo').format('HH:mm:ss')

                var body = (type === 'conversation') ? msg.message.conversation : (type == 'imageMessage') ?
                    msg.message.imageMessage.caption : (type == 'videoMessage') ?
                        msg.message.videoMessage.caption : (type == 'extendedTextMessage') ?
                            msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ?
                                msg.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ?
                                    msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''

                const isMedia = type.includes('videoMessage') || type.includes('imageMessage') || type.includes('stickerMessage') || type.includes('audioMessage') || type.includes('documentMessage')

                const isCmd = prefix.includes(body != '' && body.slice(0, 1)) && body.slice(1) != ''
                const command = isCmd ? body.slice(1).trim().split(' ')[0].toLowerCase() : ''
                const args = body.trim().split(/ +/).slice(1)
                const isGroup = from.endsWith('@g.us')
                const pushname = msg.pushName || "Sem Nome"

                const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
                const groupName = isGroup ? groupMetadata.subject : ''
                
                function getNumber(key){
                    
                    if(key.remoteJid.endsWith('@g.us')){
                        id = msg.key.participant;
                        return id;
                    }
                    else {
                        id = msg.key.remoteJid;
                        return id;
                    }
                }
                function makeSticker(buffer, animated, category){
                    let quality = false
                    let stype = StickerTypes.DEFAULT
                    let back = ''
                    let categ = ''
                    if(animated === true){
                        quality = 10
                        stype = StickerTypes.CROPPED
                        
                    } else if (animated === false){
                        quality = 50
                        stype = StickerTypes.FULL
                    
                    }
                    if(category === 'feliz'){
                        categ = '😀'
                    } else if(category === 'amor'){
                        categ = '😍'
                    } else if(category === 'triste'){
                        categ = '😣'
                    } else if(category === 'nervoso'){
                        categ = '😡'
                    } else if (category === 'saudar'){
                        categ = '👋'
                    } else if (category === 'celebrar'){
                        categ = '🎊'
                    }
                    const sticker = new Sticker(buffer, {

                        
                        pack: packname, // The pack name
                        author: author, // The author name
                        type: stype, // The sticker type
                        //categories: [`${categ}`], // The sticker category
                        id: '12345', // The sticker id
                        quality: quality, // The quality of the output file
                        //background: back // The sticker background color (only for full stickers)
                    })

                    return sticker;
                }
                function cmdLog(cmd, chatId, args){
                    console.log('------------------------------')
                    log.magenta('Comando recebido:', color.white(cmd), color.magenta('ChatID:'), color.white(chatId));
                    log.magenta('Args:', color.white(args))
                    console.log('------------------------------')
                }
                
                const reply = (mensagem) => {
                    client.sendMessage(from, { text: mensagem }, {quoted: msg});
                }
                if(command){
                    cmdLog(command, msg.key.remoteJid, args)
                    
                }
				
                switch (command) {
                	
                        case 'menu':
                            const { menu } = require('./database/menu/commands')
                            let id = getNumber(msg.key)
                           /*
                            const buttons = [
                                {buttonId: '!suporte', buttonText: {displayText: 'Suporte'}, type: 1},
                              ]
                              
                              const buttonMessage = {
                                  text: menu(id, botName),
                                  footerText: footerText,
                                  buttons: buttons,
                                  headerType: 1
                              }
👨‍💻
                              */
                              const templateButtons = [
                                {index: 1, urlButton: {displayText: 'Suporte 👨‍💻', url: 'https://wa.me/558381465775'}},
                                //{index: 2, callButton: {displayText: 'Call me!', phoneNumber: '+1 (234) 5678-901'}},
                                //{index: 3, quickReplyButton: {displayText: 'This is a reply, just like normal buttons!', id: 'id-like-buttons-message'}},
                              ]
                              
                              const templateMessage = {
                                  text: menu(id, botName),
                                  footer: 'Nify Tech',
                                  templateButtons: templateButtons
                              }
                              
                              const sendMsg = await client.sendMessage(from, templateMessage)
                            
                            
                           /// client.sendMessage(from, buttonMessage)

                            break
                        case 'suporte':
                            if(!args[1]) {
                                reply('_Por favor, nos diga em que necessita suporte._\n\n_Siga o formato:_ *!suporte Mensagem*\n\n_Exemplo:_ !suporte O comando *.f* não responde.')
                                return
                            }
                            let number = '551212121212'
                            let supMsg = `
_Suporte_

*Número:* https://wa.me/${number}
*Descrição:* ${args}`
                            client.sendMessage(ownerNumber + '@s.whatsapp.net', {text: supMsg})

                            break
						case 'f':
                            if(!isMedia){
                                reply('_Envie na legenda de uma imagem._');
                                return;
                            }
                            let category = args
                            reply(args)

                            if(type.includes('imageMessage')){
                                const stream = await downloadContentFromMessage(msg.message.imageMessage, 'image')
                                let buffer = Buffer.from([])
                                for await(const chunk of stream) {
                                    buffer = Buffer.concat([buffer, chunk])
                                }
                                let sticker = makeSticker(buffer, false, category);
                                client.sendMessage(from, await sticker.toMessage())
                            } else if (type.includes('videoMessage')){
                                const stream = await downloadContentFromMessage(msg.message.videoMessage, 'video')
                                let buffer = Buffer.from([])
                                for await(const chunk of stream) {
                                    buffer = Buffer.concat([buffer, chunk])
                                }
                                let sticker = makeSticker(buffer, true, category);
                                client.sendMessage(from, await sticker.toMessage())
                            }
                            
                            
                            break
                        case 'args':
                            reply(args)
                            break
						case 'ats':
                            if(!args) {
                                reply('Qual o texto?')
                                return 
                            }
                            let arg = args.toString()
                            let text = arg.replaceAll(',', ' ')
                            try {
                                axios.get(`https://api.xteam.xyz/attp?file&text=${encodeURIComponent(text)}`, {responseType: 'arraybuffer'}).then(res => {
                                //let ats = makeSticker(res.data)
                                fs.writeFileSync(`${args}.png`, res.data)
                                //client.sendMessage(from, await ats.toMessage())
                                
                                client.sendMessage(from, { sticker: (res.data), mimetype: 'image/webp' }, { quoted: msg })
                                })

                            } catch (err) {
                                console.log(err)
                                throw(err);
                            }
							break
						case 'ts':
                            if(!args) {
                                reply('Qual o texto?')
                                return 
                            }
                            try {
                                axios.get(`https://api.xteam.xyz/ttp?file&text=${encodeURIComponent(args)}`, {responseType: 'arraybuffer'}).then(res => {
                                //let ats = makeSticker(res.data)
                                //fs.writeFileSync('a.png', res.data)
                                //client.sendMessage(from, await ats.toMessage())
                                client.sendMessage(from, { sticker: (res.data), mimetype: 'image/webp' }, { quoted: msg })
                                })

                            } catch (err) {
                                console.log(err)
                                throw(err);
                            }
							break
						
						case 'hyd':
                            const template = generateWAMessageFromContent(from, proto.Message.fromObject({
                                templateMessage: {
                                    hydratedTemplate: {
                                        
                                        hydratedContentText: '*Apenas um teste*\n\nteste\n\nteste',
                                        hydratedButtons: [{
                                            urlButton: {
                                                displayText: 'Link',
                                                url: 'https://wa.me/5511973584242'
                                            }
                                        }, {
                                            callButton: {
                                                displayText: 'Ligar',
                                                phoneNumber: '+55 11 973584242'
                                            }
                                        },
                                        {
                                            quickReplyButton: {
                                                displayText: 'Btn 1',
                                                id: 'id1'
                                            }
                                        },
                                        {
                                            quickReplyButton: {
                                                displayText: 'Btn 2',
                                                id: 'id2'
                                            }
                                        },
                                        { 
                                            quickReplyButton: {
                                                displayText: 'Btn 3',
                                                id: 'id3'
                                            }  
                                        }]
                                    }
                                }
                            }), { userJid: from || from, quoted: msg });
                            return await client.relayMessage(
                                from,
                                template.message,
                                { messageId: template.key.id }
                            )

							break
						
						case 'teste':
                            reply('Teste atual: sticker animado.')

					
							
							break
						}
				
					
                

            } catch (err) {
                console.log(err)
            }
        })
        client.ev.on('group-participants.update', async (update) => {
	     try {
		console.log(update)
	     } catch (error) {
		console.log(error)
	     }
        })
        return client
    }

    client = startSock()
    client.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            // reconnect if not logged out
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if(shouldReconnect) {
                sock = startSock()
            }
        }
        console.log('Connection Update: ', update)
    })

    // auto save dos dados da sessão
    client.ev.on('auth-state.update', () => saveState)
})()