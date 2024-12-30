
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";

const account_username = "Draqii#7933"
const discord_username = "Draqii"
const poe_sess_id = "POESESSID=bc56eab6ea18db2e331717cce9bfb63f"
const fetch_options = {
    method: 'GET',
    headers: {
        'Cookie': poe_sess_id
    }
}

interface CharacterProps  {
    name: string
    realm: string
    class: string
    league: string
    level: number
    pinnable: boolean
}
interface LeagueProps  {
    name?: string
    characters?: Array<CharacterProps>
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poe')
        .setDescription('Interacts with the PoE API!')
        .addStringOption((option: SlashCommandStringOption) => 
            option.setName('action')
                .setDescription('The action to do')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {

        const action = interaction.options.getString("action", true)

        const handleResponse = (response: Response) => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            return response.json()
        }

        const handleError = ((error: Error) => {
            console.error('Error:', error);
            interaction.reply("I'm sorry, an error has occured.")
        })

        const fetchResource = (path: string, executeFunction: (value: any) => any) => {
            fetch(`https://www.pathofexile.com/character-window/`+path, fetch_options)
                .then(handleResponse)
                .then(executeFunction)
                .catch(handleError);
        }

        const displayCharacter = (character: CharacterProps) => "(Level "+character.level+" "+character.class+") "+character.name



        const getCharacters = (account: string) => {
            fetchResource("get-characters?account="+account, (characters: Array<CharacterProps>) => {
                console.log('Response Data:', characters);
                let leagues: Array<LeagueProps> = []
                characters.map((character: CharacterProps) => {
                    if (leagues.map((league)=>league.name === character.league).includes(true) === false) leagues.push({
                        name: character.league,
                        characters: [character]
                    }) 
                    else leagues.map((league: any) => (league.name === character.league) ? league.characters.push(character) : null)
                })
                let characters_text = leagues.map((league)=> "\n"+league.name+" League:\n"+league.characters?.map((character)=>displayCharacter(character)).join("\n")).join("\n")
                console.log(characters_text)
                interaction.reply("Hai "+discord_username+"! You have "+characters.length+" characters.\n" + characters_text)
            })
        }



        const getCharacterPassiveSkills = () => {
            fetchResource("get-passive-skills?character=ShadowDraqi", (characterPassives: Array<JSON>) => {
                console.log('Response Data:', characterPassives);
                interaction.reply("Hai "+discord_username+"!")
            })
        }

        const getCharacterItems = () => {
            fetchResource("get-items?character=ShadowDraqi", (characterItems: Array<JSON>) => {
                console.log('Response Data:', characterItems);
                interaction.reply("Hai "+discord_username+"!")
            })
        }

        const iterateLeagueStash = () => {
            fetchResource("get-stash-items?accountName=Draqii%237933&realm=pc&league=HC+SSF+R+Settlers&tabs=1&tabIndex=0", (leagueStashTabs: Array<JSON>) => {
                console.log('Response Data:', leagueStashTabs);
                interaction.reply("Hai "+discord_username+"!")
            })
        }

        const getLeagueStashItems = () => {
            fetchResource("get-stash-items?accountName=Draqii%237933&realm=pc&league=HC+SSF+R+Settlers&tabs=0&tabIndex=0", (leagueStashItems: Array<JSON>) => {
                console.log('Response Data:', leagueStashItems);
                interaction.reply("Hai "+discord_username+"!")
            })
        }

        if (action === "characters") getCharacters(account_username)
    },
};