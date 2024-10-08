import DiscordJS, { Intents } from 'discord.js'
import WOKCommands from 'wokcommands'
import path from 'path'
import dotenv from 'dotenv'
import keyFileStorage from 'key-file-storage'
import { uploadmap } from './helpers/global'
const kfs = keyFileStorage('./config')
dotenv.config()

function handleNewLine(newLine: string): void {
    // Send the line as a message to Discord
    const channelId = kfs["auto_log_channel_id"];
    if (channelId == "") {
        return
    }
    const channel = client.channels.cache.get(channelId);
    if (channel?.isText()) {
        channel.send(newLine);
    }
}

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.MESSAGE_CONTENT
    ],
})

client.on('ready', async () => {
    // create commands
    new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        typeScript: true,
        botOwners: JSON.parse(process.env.BOTOWNER as string),
        testServers: JSON.parse(process.env.TESTSERVER as string),
        mongoUri: process.env.MONGO_URI,
        disabledDefaultCommands: [
            'help',
            'command',
            'language',
            'prefix',
            'requiredrole',
            'channelonly',
            'slash'
        ],
    })
})

// auto upload map when receive an announcement
client.on('messageCreate', message => {
    if (!message.author.bot) return;

    if (message.channelId === kfs["auto_follow_map_update_channel_id"]) {
        if (message.attachments.size > 0) {
            message.attachments.forEach(async attachment => {
                const url: string = attachment.url;
                // Split the URL by '/' to get parts of the URL
                const urlParts: string[] = url.split('/');

                // The last part of the URL may still contain query parameters, so we need to split it further
                const filenameWithQueryParams: string = urlParts[urlParts.length - 1];

                // Extract the filename by splitting at the '?' character
                const filenameArray: string[] = filenameWithQueryParams.split('?');
                const filename: string = filenameArray[0];
                // Check if the filename ends with "w3x"
                if (filename.endsWith(".w3x")) {
                    let replyMessage = await message.reply("uploading new map")
                    const config = kfs["auto_follow_map_update_config_name"]
                    const filesize = await uploadmap(url, filename!, config)

                    var result = `Map: ${filename} with ${filesize} MB\n` +
                        `Download: ${url}\n` +
                        `You can now enter the game and dm the bot !map ${filename} to host ${filename} with !priv/pub 'gamename'`

                    if (config != null && config != "null") {
                        result = `Configuration: ${config}\n` +
                            `Map: ${filename} with ${filesize} MB\n` +
                            `Download: ${url}\n` +
                            `You can now enter the game and dm the bot !load ${config} to host ${filename} with !priv/pub 'gamename'`
                    }

                    await replyMessage.edit(result)
                }
            });
        }
    }

})

if (process.env.NODE_ENV == "development") {
    client.login(process.env.TOKEN_DEV)
} else {
    client.login(process.env.TOKEN)
}
