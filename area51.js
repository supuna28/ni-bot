const axios = require('axios')
const fs = require('fs')
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')

let text = 'teste'
try {
    axios.get(`https://api.xteam.xyz/attp?file&text=${text}`, { responseType: 'arraybuffer' }).then(res => {
        const sticker = new Sticker(res.data, {
            pack: 'My Pack', // The pack name
            author: 'Me', // The author name
            type: StickerTypes.FULL, // The sticker type
            categories: ['🤩', '🎉'], // The sticker category
            id: '12345', // The sticker id
            quality: 50, // The quality of the output file
            background: '#000000' // The sticker background color (only for full stickers)
        })
        
        //const buffer = await sticker.toBuffer() // convert to buffer
        // or save to file
        sticker.toFile('sticker.webp')

    });
} catch (err) {
    console.log(err);
    throw(err);
};