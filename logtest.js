const { color, log } = require('console-log-colors');
const { red, green, cyan } = color;

let cmd = 'ah'

log.magenta('Comando recebido:', color.white(cmd), color.magenta('ChatID:'), color.white(cmd));