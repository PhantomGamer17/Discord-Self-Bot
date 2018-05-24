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
 * @file images MemesCommand - Sends a jpg image along with a message to easily share your favorite memes  
 * **Aliases**: `mem`, `maymay`
 * @module
 * @category images
 * @name memes
 * @example meme cry
 * @param {StringResolvable} MemeName Name of the meme to send
 * @param {StringResolvable} [Content] Optional content to send along with the meme
 * @returns {Message} Meme image and optional content
 */

const dym = require('didyoumean2'),
  fs = require('fs'),
  path = require('path'),
  {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require(path.join(__dirname, '../../util.js'));

module.exports = class MemesCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'memes',
      memberName: 'memes',
      group: 'images',
      aliases: ['mem', 'maymay'],
      description: 'Send a meme image',
      format: 'MemeName [MessageToSendWithMeme]',
      examples: ['meme cry'],
      guildOnly: false,
      args: [
        {
          key: 'meme',
          prompt: 'What meme do you want send?',
          type: 'string',
          parse: p => p.toLowerCase()
        }, {
          key: 'message',
          prompt: 'Content to send along with the meme?',
          type: 'string',
          default: ''
        }
      ]
    });
  }

  run (msg, {meme, message}) {
    if (fs.existsSync(path.join(__dirname, `../../data/images/memes/${meme}.jpg`))) {
      deleteCommandMessages(msg, this.client);

      return msg.say(message, {files: [path.join(__dirname, `../../data/images/memes/${meme}.jpg`)]});
    }
    const matchList = fs.readdirSync(path.join(__dirname, '../../data/images/memes/')).map(v => v.slice(0, 4)),
      maybe = dym(meme, matchList, {deburr: true});

    return msg.reply(oneLine`that meme does not exist! ${maybe 
      ? oneLine`Did you mean \`${maybe}\`?` 
      : 'You can add it to the folder then try again'}`);
  }
};