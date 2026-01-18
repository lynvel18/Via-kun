require('dotenv').config();
const {Client, IntentsBitField, EmbedBuilder, AttachmentBuilder, GuildMember, ActivityType, Partials} = require('discord.js');

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
        Partials.Reaction,
        Partials.User
    ]
});

via.on('clientReady', (c) => {
    console.log(`${c.user.tag} is online master.`);

    via.user.setActivity({
    name: '🎮 Strinova',
    type: ActivityType.Playing
});

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
        .setTitle(`\u200b\n${member.user.username} has left the server`)
        .setDescription('Thanks for hanging out with us!\n\u200b')

    welcome_channel.send({
        embeds: [goodbyeEmbed],
        files: [goodbye]
    });
    console.log(`${member.user.username} has left the server`)
    }
});









const mainRole = {
    mc: process.env.MC_ROLE,
    art: process.env.ART_ROLE
}

const rolesID = {
    [process.env.MC_EMOJI] : {
        roleID: mainRole.mc },

    [process.env.MC_ANNOUNCEMENTS_EMOJI]: {
        roleID: process.env.MC_ANNOUNCEMENTS_ROLE,
        reqRole: mainRole.mc },

    [process.env.MC_PATCH_NOTES_EMOJI]: {
        roleID: process.env.MC_PATCH_NOTES_ROLE,
        reqRole: mainRole.mc },

    [process.env.MC_IG_CHAT_EMOJI]: {
        roleID: process.env.MC_IG_CHAT_ROLE,
        reqRole: mainRole.mc },

    [process.env.MC_JAVA_EMOJI]: {
        roleID: process.env.MC_JAVA_ROLE,
        reqRole: mainRole.mc },

    [process.env.MC_BEDROCK_EMOJI]: {
        roleID: process.env.MC_BEDROCK_ROLE,
        reqRole: mainRole.mc },

    [process.env.ART_EMOJI] : {
        roleID: mainRole.art },

    [process.env.ART_YAPS_EMOJI]: {
        roleID: process.env.ART_YAPS_ROLE,
        reqRole: mainRole.art },

    [process.env.ART_BIBLE_EMOJI]: {
        roleID: process.env.ART_BIBLE_ROLE,
        reqRole: mainRole.art
    }
}


via.on('messageReactionAdd', async (reaction, user) => {
    const reactMessageID = process.env.ROLE_REACT_MESSAGE_ID;
    const check = rolesID[reaction.emoji.id];
    const member = await reaction.message.guild.members.fetch(user.id)

    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.log('failed to fetch user reaction id')
        }
    }

    if (reaction.message.id === reactMessageID) {

        if (check.reqRole && !member.roles.cache.has(check.reqRole)) {
            await reaction.users.remove(user);
            console.log(`${member.user.username} does not have the required role`)
            return;
        }
        await member.roles.add(check.roleID)
        console.log(`role has been added to ${member.user.username}`)
    }
});

/*const mainRemove = {
    [rolesID.MC_EMOJI] : [
        rolesID.MC_ROLE,
        rolesID.MC_ANNOUNCEMENTS_ROLE,
        rolesID.MC_PATCH_NOTES_ROLE,
        rolesID.MC_IG_CHAT_ROLE,
        rolesID.MC_JAVA_ROLE,
        rolesID.MC_BEDROCK_ROLE
    ],
    [rolesID.ART_EMOJI] : [
        rolesID.ART_ROLE,
        rolesID.ART_BIBLE_ROLE,
        rolesID.ART_YAPS_ROLE
    ]
}
*/

const mainRemove = {
    //Minecraft Main Role
    [process.env.MC_ROLE_EMOJI_ID] : [
        process.env.MC_ROLE, 
        process.env.MC_ANNOUNCEMENTS_ROLE, 
        process.env.MC_PATCH_NOTES_ROLE,
        process.env.MC_IG_CHAT_ROLE,
        process.env.MC_BEDROCK_ROLE,
        process.env.MC_JAVA_ROLE],
    //Art Main Role
    [process.env.ART_EMOJI] : [
        process.env.ART_ROLE,
        process.env.ART_YAPS_ROLE,
        process.env.ART_BIBLE_ROLE
    ]
}

via.on('messageReactionRemove', async (reaction, user) => {
    const reactMessageID = process.env.ROLE_REACT_MESSAGE_ID;
    const main = mainRemove[reaction.emoji.id];
    const subroles = rolesID[reaction.emoji.id];
    const member = await reaction.message.guild.members.fetch(user.id);

    if (user.bot) return;

    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.log('failed to fetch user reaction id')
        }
    }

    if (reaction.message.id === reactMessageID) {
         if (main) {
            await member.roles.remove(main)
            console.log('role has been removed')
        }
        if (subroles) {
            await member.roles.remove(subroles.roleID)
            console.log('role has been removed')
        }
    }
});

via.login(process.env.TOKEN);