/*
 *   This file is part of discord-self-bot
 *   Copyright (C) 2017-2018 Favna
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, version 3 of the License
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @file Searches MangaCommand - Gets information about any manga from MyAnimeList  
 * **Aliases**: `cartoon`, `man`
 * @module
 * @category searches
 * @name manga
 * @example manga Yu-Gi-Oh
 * @param {StringResolvable} AnyManga manga to look up
 * @returns {MessageEmbed} Information about the requested manga
 */

const maljs = require('maljs'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class mangaCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'manga',
      memberName: 'manga',
      group: 'searches',
      aliases: ['cartoon', 'man'],
      description: 'Finds manga on MyAnimeList',
      format: 'MangaName',
      examples: ['manga Pokemon'],
      guildOnly: false,
      args: [
        {
          key: 'manga',
          prompt: 'What manga do you want to find?',
          type: 'string'
        }
      ]
    });
  }

  async run (msg, {manga}) {
    try {
      const manEmbed = new MessageEmbed(),
        search = await maljs.quickSearch(manga, 'manga'),
        searchDetails = await search.manga[0].fetch();

      manEmbed
        .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
        .setTitle(searchDetails.title)
        .setImage(searchDetails.cover)
        .setDescription(searchDetails.description)
        .setURL(`${searchDetails.mal.url}${searchDetails.path}`)
        .addField('Score', searchDetails.score, true)
        .addField('Popularity', searchDetails.popularity, true)
        .addField('Rank', searchDetails.ranked, true);

      deleteCommandMessages(msg, this.client);

      return msg.embed(manEmbed, `${searchDetails.mal.url}${searchDetails.path}`);
    } catch (err) {
      deleteCommandMessages(msg, this.client);

      return msg.reply(`no manga found for \`${manga}\` `);
    }
  }
};