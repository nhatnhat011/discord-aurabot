import { ICommand } from "wokcommands";
import { uploadmap } from "../helpers/global";

export default {
    name: 'uploadmap',
    category: 'Configuration',
    description: 'upload a map to bot (root admin only)',
    guildOnly: true,
    globalCooldown: '1m',
    options: [
        {
            name: 'url',
            description: 'direct download link. Example: Discord attachment, right click copy link',
            required: true,
            type: 3
        },
        {
            name: 'file_name',
            description: 'the name of the map. Example for twrpg: twrpgv0.53a_eng.w3x',
            required: true,
            type: 3
        },
        {
            name: 'config_name',
            description: 'the name of the config file. Example for twrpg: twre',
            required: false,
            type: 3
        },
        {
            name: 'visibility',
            description: '1 = hide terrain; 2 = explored; 3 = always visible; 4 = default',
            required: false,
            type: 3
        },
        {
            name: 'observers',
            description: '1 = none; 2 = on defeat; 3 = allowed; 4 = referees',
            required: false,
            type: 3
        }
    ],

    slash: true,
    testOnly: (process.env.NODE_ENV == "development") ? true:false,

    callback: async ({ interaction }) => {
        if (interaction) {
            await interaction.deferReply({
            })

            const url = interaction.options.getString('url')
            const filename = interaction.options.getString('file_name')
            const config = interaction.options.getString('config_name')
            const visibility = interaction.options.getString('visibility')
            const observers = interaction.options.getString('observers')

            //get filesize for user to double check if correct
            const filesize = await uploadmap(url!, filename!, config!, visibility!, observers!)

            //output
            var result = `Map: ${filename} with ${filesize} MB\n` +
            `Download: ${url}\n` +
            `You can now enter the game and dm the bot !map ${filename} to host ${filename} with !priv/pub 'gamename'`

            if (config) {
                result = `Configuration: ${config}\n` +
                `Map: ${filename} with ${filesize} MB\n` +
                `Download: ${url}\n` +
                `You can now enter the game and dm the bot !load ${config} to host ${filename} with !priv/pub 'gamename'`
            }

            await interaction.editReply({
                content: result,
            })
        }
    },
} as ICommand
