const Discord = require("discord.js");
const disbut = require("discord-buttons");
const db = require('quick.db');
const ayar = require('../ayarlar.json')
exports.run = async (client, message, args) => { 
    message.delete()
	const basvurdata = await db.get(`basvurbilgi`);
	if(basvurdata) return message.reply(`Başvurular geçici olarak durdurulmuştur.`);
	
	const bandata = await db.get(`ban.${message.author.id}`)
	if(bandata) return message.reply("Başvurulardan banlısın");
		
  let category = message.guild.channels.cache.get(ayar.basvurkategori);
            
  message.guild.channels.create(`${message.author.username}-başvur`, {
    parent: category,
    permissionOverwrites: [
        {id: ayar.everyoneid, deny: [('VIEW_CHANNEL'), ('SEND_MESSAGES')]},
		{id: ayar.adminrol, allow: [('VIEW_CHANNEL'), ('SEND_MESSAGES')]},
        {id: message.author.id, allow: [('VIEW_CHANNEL'), ('SEND_MESSAGES')]}]
    }).then( async baschannel => {

    
  const sorular = [
    '**İsmini Ve Yaşını Oğrenebilirmiyim?** isim/yaş',
    '**Günde Kaç Saat Aktifsiniz?** 1/24 saat',
    '**Başka Sunucuda Yetkili Oldunuz Mu?** evet/hayır',
    '**Discord Platformunda Kaç Senedir Bulunuyorsunuz?** yıl',
    '**Üyelere hangi konuda destek vermeyi planlıyorunuz?** discord-destek / kod-destek',
    '**Neden RabeL?** <cevabınız>'
  ]
  let sayac = 0
  
  const filter = m => m.author.id === message.author.id
  const collector = new Discord.MessageCollector(baschannel, filter, {
    max: sorular.length,
    time: 2000 * 60
  })
  baschannel.send(`Merhaba ${message.author}, demek sunucumuzda yetkili olmak istiyorsun ama önce bazı soruları cevaplaman gerek başarılar\n:hourglass: Unutma!!! Tüm soruları cevaplaman için tam 2 Dakikan var hızlı ol :)`);
  baschannel.send(sorular[sayac++])
  collector.on('collect', m => {
    if(sayac < sorular.length){
      m.channel.send(sorular[sayac++])
    }
  })

  collector.on('end', collected => {
    if(!collected.size) return baschannel.send('**Süre Bitti!**\nBu kanal 5 saniye sonra silinecektir').then(
      setTimeout(function() {
        baschannel.delete();
         }, 5000));
    baschannel.send('**Başvurunuz Başarıyla iletilmiştir!**\nBu kanal 5 saniye sonra silinecektir').then(
      setTimeout(function() {
        baschannel.delete();
         }, 5000));
    let sayac = 0
    
    const onybuton = new disbut.MessageButton()
    .setLabel('Onayla')
    .setStyle('green')
    .setID('onay');
    const redbuton = new disbut.MessageButton()
    .setLabel('Reddet')
    .setStyle('red')
    .setID('red');
    let row = new disbut.MessageActionRow()
    .addComponents(onybuton, redbuton);

    const log = new Discord.MessageEmbed()
    .setAuthor(message.author.username + ` (${message.author.id})`, message.author.avatarURL({dynamic: true}))
	.setTitle('Yeni Başvuru Geldi!')
	.setDescription('Aşağıdaki butonlardan onay/red işlemlerini gercekleştirebilirsiniz')
    .setColor('BLUE')
    .addField('Başvuran Hakkında',[
      `**İsim ve Yaş: **\t\t${collected.map(m => m.content).slice(0,1)}`,
      `**Günlük Aktiflik: **\t\t${collected.map(m => m.content).slice(1,2)}`,
      `**Daha önceden Bilgisi var m?: **\t\t${collected.map(m => m.content).slice(2,3)}`,
      `**Kac Yıldır DC kullanıyor: **\t\t${collected.map(m => m.content).slice(3,4)}`,
	  `**Üyelere hangi konuda destek vermeyi planlıyor: **\t\t${collected.map(m => m.content).slice(4,5)}`,
      `**Neden RabeL: **\t\t${collected.map(m => m.content).slice(5,6)}`
    ])
    .setTimestamp()
    .setFooter('Developed by Gweep Creative', message.guild.iconURL());
    client.channels.cache.get(ayar.yetkililog).send({
		buttons: [onybuton, redbuton],
	    embed: log}).then(async m => {
      db.set(`basvur.${m.id}`, message.author.id);
    })

  })
  
})
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['başvuru']
}
exports.help = {
  name: 'başvur'
}