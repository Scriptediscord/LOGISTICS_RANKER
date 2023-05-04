const noblox = require('noblox.js');
const { Client, Events, GatewayIntentBits, Partials, ActivityType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { Guilds, GuildMembers, GuildMessages, GuildMessageReactions, GuildEmojisAndStickers } = GatewayIntentBits;
const { GuildMember, Message, Channel, Reaction } = Partials;
require('dotenv').config()




const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});



 client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
   client.user.setActivity('reactions', { type: ActivityType.Listening });
});




client.on(Events.MessageReactionAdd,  async  (reaction, user) => {

  const comfirmationMssg = new EmbedBuilder()
  .setColor(0x0099FF)
  .setTitle("Comfirmation Message")
  .setDescription("Are you sure you want to update this user?")
  reaction.message.channel.send({embeds: comfirmationMssg});

  const comfirmBtn = new ButtonBuilder()
  .setLabel("Comfirm")
  .setCustomId("comfirmBtn")
  .setStyle(ButtonStyle.Primary)

  const denyBtn = new ButtonBuilder()
  .setLabel("Deny")
  .setCustomId("denyBtn")
  .setStyle(ButtonStyle.Danger)

  const comfirmaionRow = new ActionRowBuilder()
  .addComponents(comfirmBtn, denyBtn)

  reaction.message.channel.send({
    embeds: comfirmationMssg,
  components: [comfirmaionRow]})

	if (reaction.partial) {	 
    await reaction.fetch()
    
    await reaction.message.guild.members.fetch(reaction.message.author.id) 


  }
  const reactionMember = await reaction.message.guild.members.fetch(user)
  const messageGuildId =  reaction.message.guildId

  if(messageGuildId == "864095007672762380") {
    var config = require('./config.json')
  } else {
    var config = require('./config2.json')
  }

  const reactionEmoji =  reaction.message.guild.emojis.cache.get(config.logisticsEmoji);
  
  if(reactionMember.roles.cache.some(role => role.id=== config.logisticsRole) && 
    reactionEmoji.id === reaction.emoji.id  &&
  reaction.message.member.nickname !== reactionMember.nickname) {
      
const auditChannel = await reaction.message.guild.channels.fetch(config.auditLogsId)
     
	console.log(reaction.message.member.nickname)


      const rblxID = await noblox.getIdFromUsername(reaction.message.member.nickname)
      console.log(rblxID)

    //await noblox.changeRank(config.groupID, rblxID, 1)
     const newRank = await noblox.getRankNameInGroup(config.groupID, rblxID)

     const auditEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`Bot promoted ${reaction.message.member.nickname}`)
    .setDescription(`${reactionMember.nickname} promoted ${reaction.message.member.nickname} to ${newRank}`)
    .setFooter({text: "Sent Automatically!"})

auditChannel.send({embeds: [auditEmbed]})
    
   await reaction.message.delete()
    
  }else {
    const errEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle("Safegaurds triggered. Cannot change rank of the user.")
    .setDescription("One of the safeguards in place was voilated. To protect the bot from abuse. This bot is unable to chnage this user's rank.")
    
    reaction.message.channel.send({embeds: [errEmbed]}).then(message => {
      setTimeout(() => {
        message.delete();
      }, 10000)});
  }})

   

client.login(process.env.TOKEN);

noblox.setCookie(process.env.COOKIE).then(function() { 
  console.log("Logged in!")
}).catch(function(err) {
    console.log("Unable to log in!", err)
})
