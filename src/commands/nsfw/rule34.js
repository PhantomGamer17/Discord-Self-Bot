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
 * @file nsfw Rule34Command - Gets a NSFW image from rule34  
 * Can only be used in NSFW marked channels!  
 * **Aliases**: `r34`
 * @module
 * @category nsfw
 * @name rule34
 * @example rule34 pyrrha_nikos
 * @param {StringResolvable} Query Something you want to find
 * @returns {MessageEmbed} Score, Link and preview of the image
 */

const booru = require('booru'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {stripIndents} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class Rule34Command extends Command {
  constructor (client) {
    super(client, {
      name: 'rule34',
      memberName: 'rule34',
      group: 'nsfw',
      aliases: ['r34'],
      description: 'Find NSFW Content on Rule34',
      format: 'NSFWToLookUp',
      examples: ['rule34 Pyrrha Nikos'],
      guildOnly: false,
      nsfw: true,
      args: [
        {
          key: 'tags',
          prompt: 'What do you want to find NSFW for?',
          type: 'string',
          parse: p => p.split(' ')
        }
      ]
    });
  }

  async run (msg, {tags}) {
    try {
      /* eslint-disable sort-vars*/
      const search = await booru.search('r34', tags, {
          limit: 1,
          random: true
        }),
        common = await booru.commonfy(search),
        embed = new MessageEmbed(),
        imageTags = [];
      /* eslint-enable sort-vars*/

      for (const tag in common[0].common.tags) {
        imageTags.push(`[#${common[0].common.tags[tag]}](${common[0].common.file_url})`);
      }

      embed
        .setTitle(`Rule34 image for ${tags.join(', ')}`)
        .setURL(common[0].common.file_url)
        .setColor('#FFB6C1')
        .setDescription(stripIndents`${imageTags.slice(0, 5).join(' ')}
          
          **Score**: ${common[0].common.score}`)
        .setImage(common[0].common.file_url);

      deleteCommandMessages(msg, this.client);

      return msg.embed(embed);
    } catch (err) {
      console.log(err);
      deleteCommandMessages(msg, this.client);

      return msg.reply(`no juicy images found for \`${tags}\``);
    }
  }
};