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
 * @file Searches ImageCommand - Gets an image through Google Images  
 * **Aliases**: `img`, `i`
 * @module
 * @category searches
 * @name image
 * @example image Pyrrha Nikos
 * @param {StringResolvable} ImageQuery Image to find on google images
 * @returns {MessageEmbed} Embedded image and search query
 */

const cheerio = require('cheerio'),
  request = require('snekfetch'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class ImageCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'image',
      memberName: 'image',
      group: 'searches',
      aliases: ['img', 'i'],
      description: 'Finds an image through google',
      format: 'ImageQuery',
      examples: ['image Pyrrha Nikos'],
      guildOnly: false,
      args: [
        {
          key: 'query',
          prompt: 'What do you want to find images of?',
          type: 'string'
        }
      ]
    });
  }

  async run (msg, {query}) {
    const embed = new MessageEmbed();

    let res = await request.get('https://www.googleapis.com/customsearch/v1')
      .query('cx', process.env.imagekey)
      .query('key', process.env.googleapikey)
      .query('safe', msg.guild ? msg.channel.nsfw ? 'off' : 'medium' : 'high') // eslint-disable-line no-nested-ternary
      .query('searchType', 'image')
      .query('q', query);

    if (res && res.body.items) {
      embed
        .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
        .setImage(res.body.items[0].link)
        .setFooter(`Search query: "${query.replace(/\+/g, ' ')}"`);

      deleteCommandMessages(msg, this.client);

      return msg.embed(embed);
    }

    if (!res) {
      res = await request.get('https://www.google.com/search')
        .query('tbm', 'isch')
        .query('gs_l', 'img')
        .query('safe', msg.guild ? msg.channel.nsfw ? 'off' : 'medium' : 'high') // eslint-disable-line no-nested-ternary
        .query('q', query);

      const $ = cheerio.load(res.text),
        result = $('.images_table').find('img')
          .first()
          .attr('src');

      embed
        .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
        .setImage(result)
        .setFooter(`Search query: "${query}"`);

      deleteCommandMessages(msg, this.client);

      return msg.embed(embed);
    }
    deleteCommandMessages(msg, this.client);

    return msg.reply(`nothing found for \`${query}\``);
  }
};