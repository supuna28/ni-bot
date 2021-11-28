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
    downloadContentFromMessage
} = require('@adiwajshing/baileys-md')
var pino = require("pino");
var baileys = require("@adiwajshing/baileys-md");
const axios = require('axios').default
const fs = require('fs')
const moment = require('moment-timezone')
const chalk = require('chalk')
const CFonts  = require('cfonts')
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')
const { color, log } = require('console-log-colors');
const { red, green, cyan } = color;
const db = require('./database/database.json')


const { help } = require('./database/menu/help')
const { criador } = require('./database/menu/criador')
const { faq } = require('./database/menu/faq')
const { pix_txt } = require('./database/menu/pix')
const option = JSON.parse(fs.readFileSync('./options/option.json'))

const footerText = 'Ni-Bot - Nify Tech'

const {
    botName,
    ownerName,
    ownerNumber
} = option

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
                function makeSticker(buffer){

                    const sticker = new Sticker(buffer, {
                        pack: 'Ni-Bot', // The pack name
                        author: 'Me', // The author name
                        type: StickerTypes.FULL, // The sticker type
                        categories: ['🤩', '🎉'], // The sticker category
                        id: '12345', // The sticker id
                        quality: 50, // The quality of the output file
                       // background: '#000000' // The sticker background color (only for full stickers)
                    })

                    return sticker;
                }
                function cmdLog(cmd, chatId){
                    log.magenta('Comando recebido:', color.white(cmd), color.magenta('ChatID:'), color.white(chatId));
                }
                
                const reply = (mensagem) => {
                    client.sendMessage(from, { text: mensagem });
                }
                if(command){
                    cmdLog(command, msg.key.remoteJid)
                    
                }
				
                switch (command) {
                	
                        case 'menu':
                            const { menu } = require('./database/menu/commands')
                            let id = getNumber(msg.key)
                           
                            const buttons = [
                                {buttonId: '!suporte', buttonText: {displayText: 'Suporte'}, type: 1},
                              ]
                              
                              const buttonMessage = {
                                  text: menu(id, botName),
                                  footerText: footerText,
                                  buttons: buttons,
                                  headerType: 1
                              }
                            
                            
                            client.sendMessage(from, buttonMessage)

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
                            const stream = await downloadContentFromMessage(msg.message.imageMessage, 'image')
                            let buffer = Buffer.from([])
                            for await(const chunk of stream) {
                                buffer = Buffer.concat([buffer, chunk])
                            }
                            let sticker = makeSticker(buffer);
                            client.sendMessage(from, await sticker.toMessage())
                            break
						case 'nextpage':
				
							
							break
						
						case 'info':

							
							break
						
						case 'faq':
				
							
							break
						
						case 'doação':
					
							
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