const { EmbedBuilder } = require('discord.js');

class ValorantService {
    constructor(valorantApiService) {
        this._valorantApiService = valorantApiService;
    }

    get valorantApiService() {
        return this._valorantApiService;
    }


    getPlayerEmbed(playerName) {
        let queriedPlayer = this.valorantApiService.players.find(p => p.name.toLowerCase().replace(' ', '') == playerName.toLowerCase().replace(' ', ''));
        if (!queriedPlayer) {
            return new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Valorant player not found!')
                .setDescription(`Could not find "${playerName}". Please check your spelling and try again.`);
        }

        return this.valorantApiService.getPlayer(queriedPlayer.id)
            .then(player => {
                const getPlayerNameAndNickname = (name, user) => {
                    let result = '';
                    let nameArr = name.split(' ');
                    for (let i = 0; i < nameArr.length; i++) {
                        if (i == nameArr.length - 1) {
                            result += `"${user}" `;
                        }
                        result += `${nameArr[i]} `;
                    }
                    return result.trim();
                }

                return new EmbedBuilder()
                    .setColor(0xBD3944)
                    .setTitle(getPlayerNameAndNickname(player.info.name, player.info.user))
                    .setURL(player.info.url)
                    .setAuthor({ name: 'vlr.gg', iconURL: this.valorantApiService.logoUrl, url: this.valorantApiService.siteUrl })
                    .setThumbnail(player.info.img)
                    .addFields(
                        { name: 'Country', value: `\:flag_${player.info.flag}:`, inline: true },
                        { name: 'Team', value: `[${player.team.name}](${player.team.url}) (${player.team.joined})`, inline: true },
                        { name: '** **', value: '** **' },
                        { name: 'Twitter', value: `[${player.socials.twitter}](${player.socials.twitter_url})`, inline: true },
                        { name: 'Twitch', value: `[${player.socials.twitch}](${player.socials.twitch_url})`, inline: true }
                    );
            })
    }

    getTeamEmbed(teamName) {
        let queriedTeam = this.valorantApiService.teams.find(t => t.name.toLowerCase().replace(' ', '') == teamName.toLowerCase().replace(' ', ''));
        if (!queriedTeam) {
            return new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Valorant team not found!')
                .setDescription(`Could not find "${teamName}". Please check your spelling and try again.`);
        }

        return this.valorantApiService.getTeam(queriedTeam.id)
            .then(team => {
                const getPlayerNameAndNickname = (name, user) => {
                    let result = '';
                    let nameArr = name.split(' ');
                    for (let i = 0; i < nameArr.length; i++) {
                        if (i == nameArr.length - 1) {
                            result += `"${user}" `;
                        }
                        result += `${nameArr[i]} `;
                    }
                    return result.trim();
                }

                const getStaffList = (person, isPlayers) => {
                    let result = '';
                    for (let i = 0; i < person.length; i++) {
                        result += `[\:flag_${person[i].country}: ${getPlayerNameAndNickname(person[i].name, person[i].user)}](${person[i].url})`;
                        if (!isPlayers) {
                            result += ` (${person[i].tag})`
                        }
                        if (i != person.length - 1) {
                            result += `\n`;
                        }
                    }
                    return result;
                }

                return new EmbedBuilder()
                    .setColor(0xBD3944)
                    .setTitle(team.info.name)
                    .setURL(queriedTeam.url)
                    .setAuthor({ name: 'vlr.gg', iconURL: this.valorantApiService.logoUrl, url: this.valorantApiService.siteUrl })
                    .setThumbnail(team.info.logo)
                    .addFields(
                        { name: 'Event', value: `${queriedTeam.country}`, inline: true },
                        { name: '** **', value: '** **' },
                        { name: 'Players', value: `${getStaffList(team.players, true)}`, inline: true },
                        { name: 'Staff', value: `${getStaffList(team.staff, false)}`, inline: true },
                        { name: '** **', value: '** **' },
                        {
                            name: 'Last Match', value: `${team.results.length > 0 ? '[' + team.results[0].event.name + ' (' + team.results[0].teams[0].name + ' ' + team.results[0].teams[0].points + ' - '
                                + team.results[0].teams[1].name + ' ' + team.results[0].teams[1].points + ')]' +
                                '(' + team.results[0].match.url + ')' : 'None'}`, inline: true
                        },
                        {
                            name: 'Next Match', value: `${team.upcoming.length > 0 ? '[' + team.upcoming[0].event.name + '(vs ' + team.upcoming[0].teams[1].name + ')]' +
                                '(' + team.upcoming[0].match.url + ')' : 'None'}`, inline: true
                        }
                    );
            })
    }

    getUpcomingMatchesEmbed(teamName) {
        let title = 'Upcoming matches';
        let matches = null;
        if (teamName) {
            matches = this.valorantApiService.matches.filter(m => m.teams[0].name.toLowerCase().replace(' ', '') == teamName.toLowerCase().replace(' ', '') || m.teams[1].name.toLowerCase().replace(' ', '') == teamName.toLowerCase().replace(' ', ''));
            title += ` for "${teamName}"`;
        } else {
            matches = this.valorantApiService.matches;
        }

        const getColumn = (match, colName) => {
            let result = '';
            for (let i = 0; i < match.length; i++) {
                if (colName == 'teams') {
                    result += match[i][colName][0] + " vs. " + match[i][colName][1];
                } else {
                    result += match[i][colName];
                }
            }
            result += "\n";
            return result;
        }

        if (matches.length == 0) {
            return new EmbedBuilder()
                .setColor(0xBD3944)
                .setTitle(title)
                .setAuthor({ name: 'vlr.gg', iconURL: this.valorantApiService.logoUrl, url: this.valorantApiService.siteUrl })
                .setDescription('No upcoming matches available.');
        }

        if (matches.length <= 5) {
            return new EmbedBuilder()
                .setColor(0xBD3944)
                .setTitle(title)
                .setAuthor({ name: 'vlr.gg', iconURL: this.valorantApiService.logoUrl, url: this.valorantApiService.siteUrl })
                .addFields(
                    { name: 'Match', value: `${getColumn(matches, 'teams')}`, inline: true },
                    { name: 'Event', value: `${getColumn(matches, 'event')}`, inline: true },
                    { name: 'Tournament', value: `${getColumn(matches, 'tournament')}`, inline: true },
                    { name: 'Countdown', value: `${getColumn(matches, 'in')}`, inline: true }
                );
        } else {

        }
    }
}

module.exports = ValorantService;