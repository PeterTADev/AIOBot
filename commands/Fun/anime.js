const {
    Message,
    MessageEmbed
  } = require('discord.js')
  const kitsu = require("node-kitsu");

module.exports = {
    name: "anime2",
  category: "fun",
  description: "Anime!",
  usage: "anime [name]",
    /**
    * @param {Message} message
    */
    run: async(client, message, args) => {
        if (!args[0]) return message.channel.send("Please specify an anime name.");
  else var aniname = args.join(" ");
  message.channel.send(`Search started for search term "${aniname}"`);
  try {
    var results = await kitsu.searchAnime(aniname, 0);
  } catch (ex) {
    if (ex.message.indexOf("ERR_UNESCAPED_CHARACTERS") != -1) {
      message.channel.send("This command only accepts English and Romaji titles. Please translate the title and try again.");
    } else {
      message.channel.send("An error occurred running this command. Please try again later.");
    }
    return client.logger.error(`${ex}`);
  }
  if (!results || !results[0]) {
    message.channel.send("No results found");
    client.logger.warn(`No anime found for search term "${aniname}"`);
    return;
  }
  var aniresult = results[0].attributes;

  const embed = {
    "title": aniresult.titles.en || aniresult.canonicalTitle || aniresult.titles.en_jp,
    "url": `https://kitsu.io/anime/${aniresult.slug}`,
    "description": aniresult.synopsis,
    // "color": client.colorInt("#fd8320"),
    "image": { "url": aniresult.posterImage.small },
    "fields": [
      { "name": "Rating:", "value": `${aniresult.averageRating || 0}% Approval`, "inline": true },
      { "name": "Episodes:", "value":  `${aniresult.episodeCount || 0} (${aniresult.subtype})`, "inline": true },
      { "name": "Status:", "value": aniresult.status == "tba" ? "TBA" : `${aniresult.status.charAt(0).toUpperCase()}${aniresult.status.substr(1).toLowerCase()}`, "inline": true }
    ]
  };
  message.channel.send({"embeds": [embed]});
//   client.logger.log(`Result found for search term "${aniname}": "${aniresult.titles.en || aniresult.canonicalTitle || aniresult.titles.en_jp}"`);
}
}