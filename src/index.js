require('dotenv').config();
const {Client, IntentsBitField, EmbedBuilder, AttachmentBuilder, GuildMember, ActivityType, Partials } = require('discord.js');

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

const roleList = {
    // [emoji id] : role id
    [process.env.MC_ROLE_EMOJI_ID] : process.env.MC_ROLE_ID,
    [process.env.MC_ANNOUNCEMENTS_ROLE_EMOJI_ID] : process.env.MC_ANNOUNCEMENTS_ROLE_ID,
    [process.env.MC_PATCH_NOTES_ROLE_EMOJI_ID] : process.env.MC_PATCH_NOTES_ROLE_ID,
    [process.env.MC_IG_CHAT_ROLE_EMOJI_ID] : process.env.MC_IG_CHAT_ROLE_ID,
    [process.env.MC_JAVA_EMOJI_ID] : process.env.MC_JAVA_ROLE_ID,
    [process.env.MC_BEDROCK_EMOJI_ID] : process.env.MC_BEDROCK_ROLE_ID
}

via.on('messageReactionAdd', async (reaction, user) => {
    const rolemessageID = process.env.ROLE_REACT_MESSAGE_ID;
    const roleId = roleList[reaction.emoji.id];
    const member = await reaction.message.guild.members.fetch(user.id);

    if (reaction.partial) {
        try {
            await reaction.fetch() } 
        catch (error) {
            console.log('Something went wrong master') }
    }

    if (reaction.message.id === rolemessageID ) {
        if (roleId) {
            try {
                await member.roles.add(roleId)
            } catch (error) {
                console.log('failed to add role')
            }
        }
    }
});

via.login(process.env.TOKEN);