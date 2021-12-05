const Discord = require("discord.js");
const disbut = require("discord-buttons");
const db = require('quick.db');
const ayar = require('../ayarlar.json')
exports.run = async (client, message, args) => { 
    message.delete()
	if(!message.member.roles.cache.has(ayar.kurucu)) return message.channel.send('hayırdır goçum ne zamandır gurucusun sen');
	
	
	if(args[0] == 'kapat'){
		db.set(`basvurbilgi`,true);
		message.channel.send(`Başvuru Sistemi Başarıyla kapatıldı`)
	}
	if(args[0] == 'aç'){
		db.delete(`basvurbilgi`);
		message.channel.send(`Başvuru Sistemi Başarıyla Açıldı`)
	}
	
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['başvuru-durum']
}
exports.help = {
  name: 'başvur-durum'
}