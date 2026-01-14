require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, AttachmentBuilder, GuildMember, } = require('discord.js');

const via = new Client ({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers
    ]
});

via.on('ready', (c) => {
    console.log(`${c.user.tag} is online master.`);
});

via.on('guildMemberAdd', (member) => {
    const welcomechannelID = process.env.WELCOME_CHANNEL_ID;
    const ruleschannelID = process.env.RULES_CHANNEL_ID;
    const roleschannelID = process.env.GETROLES_CHANNEL_ID;
    const lookbanner = new AttachmentBuilder(`./src/images/banner.jpg`);
    const shrek = new AttachmentBuilder(`./src/images/shrek.jpg`)
    const welcome_channel = member.guild.channels.cache.get(welcomechannelID);

    member.roles.add(process.env.LOCAL_ROLE_ID);

if (welcome_channel) {
    const welcomeEmbed = new EmbedBuilder()
    .setColor('DarkButNotBlack')
    .setThumbnail('attachment://shrek.jpg')
    .setDescription(`\u200b\nPlease check out these channels:\n<#${ruleschannelID}>\n<#${roleschannelID}>\n\u200b`)
    .setImage('attachment://banner.jpg')

welcome_channel.send({
    content: `**Welcome to the server** <@${member.id}>`,
    embeds: [welcomeEmbed],
    files: [lookbanner,shrek]
});
    console.log(`${member.user.username} has joined the server master`)
}
});

via.on('guildMemberRemove', (member) => {
    const welcomechannelID = process.env.WELCOME_CHANNEL_ID;
    const cryHamster = new AttachmentBuilder(`./src/images/hamster_cri.gif`);
    const welcome_channel = member.guild.channels.cache.get(welcomechannelID);

    if (welcome_channel) {
        const goodbyeEmbed = new EmbedBuilder()
        .setColor('DarkGrey')
        .setThumbnail('attachment://hamster_cri.gif')
        .setTitle(`${member.user.username} has left the server`)
        .setDescription('Thanks for hanging out with us!')

welcome_channel.send({
    embeds: [goodbyeEmbed],
    files: [cryHamster]
});
    console.log(`${member.user.username} has left the server`)
    }
});

via.login(process.env.TOKEN);