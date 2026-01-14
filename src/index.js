require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, AttachmentBuilder, GuildMember, ActivityType, Partials } = require('discord.js');

const via = new Client ({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessageReactions
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction
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
    const dance_bois = new AttachmentBuilder(`./src/images/dance_bois_welcome.gif`)
    const welcome_channel = member.guild.channels.cache.get(welcomechannelID);

    member.roles.add(process.env.LOCAL_ROLE_ID);

if (welcome_channel) {
    const welcomeEmbed = new EmbedBuilder()
    .setColor('DarkButNotBlack')
    .setThumbnail('attachment://dance_bois_welcome.gif')
    .setDescription(`\u200b\nPlease check out these channels:\n<#${ruleschannelID}>\n<#${roleschannelID}>\n\u200b`)
    .setImage('attachment://banner.jpg')

welcome_channel.send({
    content: `**Welcome to the server** <@${member.id}>`,
    embeds: [welcomeEmbed],
    files: [lookbanner, dance_bois]
});
    console.log(`${member.user.username} has joined the server master`)
}
});

via.on('guildMemberRemove', (member) => {
    const welcomechannelID = process.env.WELCOME_CHANNEL_ID;
    const goodbye = new AttachmentBuilder(`./src/images/perdo_goodbye.gif`);
    const welcome_channel = member.guild.channels.cache.get(welcomechannelID);

    if (welcome_channel) {
        const goodbyeEmbed = new EmbedBuilder()
        .setColor('DarkGrey')
        .setThumbnail('attachment://perdo_goodbye.gif')
        .setTitle(`\ub200\n${member.user.username} has left the server`)
        .setDescription('Thanks for hanging out with us!\n\ub200 ')

welcome_channel.send({
    embeds: [goodbyeEmbed],
    files: [goodbye]
});
    console.log(`${member.user.username} has left the server`)
    }
});

via.on('messageCreate', (message) => {
    if(message.author.bot) {
        return;
    }
    if (message.content === 'yes') {
        message.reply('yes');
    }
});

via.on('messageReactionAdd', async (reaction, user) => {

    const reactmessagelID = process.env.ROLE_REACT_MESSAGE_ID;
    const mcRoleID = process.env.MC_ROLE_ID;                            // MC role
    const mcAnnRoleID = process.env.MC_ANNOUNCEMENTS_ROLE_ID;           // MC announce
    const mcPanRoleID = process.env.MC_PATCH_NOTES_ROLE_ID;             // MC patch notes
    const mcChatRoleID = process.env.MC_IG_CHAT_ROLE_ID;                // Mc chat
    const mcRoleEmojiID = process.env.MC_ROLE_EMOJI_ID;
    const mcAnnEmojiID= process.env.MC_ANNOUNCEMENTS_ROLE_EMOJI_ID;
    const mcPanEmojiID= process.env.MC_PATCH_NOTES_ROLE_EMOJI_ID;
    const mcChatEmojiID= process.env.MC_IG_CHAT_ROLE_EMOJI_ID;
    
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went horibly wrong') }
        }

        const member = await reaction.message.guild.members.fetch(user.id);

        if (reaction.message.id === reactmessagelID) {

            if (reaction.emoji.id === mcRoleEmojiID) {
                member.roles.add(mcRoleID);
                console.log('role has been added')
            }
            if (reaction.emoji.id === mcAnnEmojiID) {
                member.roles.add(mcAnnRoleID);
                console.log('role has been added')
            }
            if (reaction.emoji.id === mcPanEmojiID) {
                member.roles.add(mcPanRoleID)
                console.log('role has been added')
            }
            if (reaction.emoji.id === mcChatEmojiID) {
                member.roles.add(mcChatRoleID)
                console.log('role has been added')
            }

        }

    });

via.login(process.env.TOKEN);