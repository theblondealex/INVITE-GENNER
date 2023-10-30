const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  AttachmentBuilder,
  ChannelType,
} = require("discord.js");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName("invite-generator")
    .setDescription("Generates a list of invite codes for you")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to for the invite code to be directed to")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )

    .addIntegerOption((option) =>
      option
        .setName("uses")
        .setDescription("How Many uses should each invite have?")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("How Many links to create?")
        .setRequired(true)
        .setMaxValue(1000)
    )
    .addStringOption((option) =>
      option
        .setName("expires")
        .setDescription("How long should the invites last?")
        // .setRequired(true)
        .addChoices(
          { name: "30d", value: "2592000000" },
          { name: "3d", value: "259200000" },
          { name: "24h", value: "86400000" },
          { name: "6h", value: "21600000" },
          { name: "1h", value: "3600000" },
          { name: "15Mins", value: "900000" },
          { name: "1Min", value: "60000" }
        )
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const icon = new AttachmentBuilder("attachment://theblondealexicon.png");
    //get the user data
    const comguild = interaction.member.guild.name;
    const comusername = `${interaction.user.username}#${interaction.user.discriminator}`;

    const amount = interaction.options.getInteger("amount");
    const uses = interaction.options.getInteger("uses");
    const expires = interaction.options.getString("expires");
    const timestamp = Date.now();
    const expiresstamp = Math.round((timestamp + parseInt(expires)) / 1000);

    const age = expires / 1000;
    const slashchannel = interaction.options.getChannel("channel");

    const botid = interaction.client.user.id;
    const interactionchannel = interaction.channelId;
    const channel = interaction.client.channels.cache.get(interactionchannel);
    const channelinfo = channel.permissionsFor(botid);
    const channelperms = channelinfo.serialize();

    //Check bot can create invites
    const botsrole = interaction.guild.members.me.roles.botRole;
    if (botsrole == null) {
      let embedfail = new EmbedBuilder()
        .setColor("FF0000")
        .setTitle("Failed")
        .setDescription(`You removed this bot's role, Please add it back.`)
        .setFooter({
          text: "Brought to you by @theblondealex",
          iconURL:
            "https://cdn.discordapp.com/attachments/963563981954482276/1168494084613226557/image.png?ex=6551f7eb&is=653f82eb&hm=f3226f21655d152b381a053e2b1ae5ae26c1bf5cb58f00d18e86dd38c31c1c8d&",
        });
      return interaction.editReply({
        embeds: [embedfail],
        files: [],
      });
    }
    const botsroleperms = botsrole.permissions.serialize();
    if (channelperms.CreateInstantInvite == false) {
      let embedfail = new EmbedBuilder()
        .setColor("FF0000")
        .setTitle("Failed")
        .setDescription(
          `The bot needs the \`Create Invites\` Permission on for it's role`
        )
        .setFooter({
          text: "Brought to you by @theblondealex",
          iconURL:
            "https://cdn.discordapp.com/attachments/963563981954482276/1168494084613226557/image.png?ex=6551f7eb&is=653f82eb&hm=f3226f21655d152b381a053e2b1ae5ae26c1bf5cb58f00d18e86dd38c31c1c8d&",
        });
      return interaction.editReply({
        embeds: [embedfail],
        files: [],
      });
    }
    let invarr = [];
    for (let index = 0; index < amount; index++) {
      const invite = await interaction.guild.invites.create(slashchannel, {
        reason: `Invite Gen Bot -> ${comusername}`,
        unique: true,
        maxUses: uses,
        maxAge: age,
      });
      const url = `https://discord.gg/${invite.code}`;
      invarr.push(url);
    }
    const finallist = invarr.join("\n");
    const invsfilename = `${comguild}_${comusername}_${amount}_Invites.txt}`;
    const invsbuf = Buffer.from(finallist);
    const invsfile = new AttachmentBuilder(invsbuf).setName(invsfilename);
    const expirestxt = expires
      ? `invite links expiring in <t:${expiresstamp}:R>`
      : "with no expiry time";
    try {
      let embedcomplete = new EmbedBuilder()
        .setColor("33FFAF")
        .setTitle("Done")
        .setDescription(
          `Success you have created ${amount} ${expirestxt} each invite link has ${uses} use(s)`
        )
        .setFooter({
          text: "Brought to you by @theblondealex",
          iconURL:
            "https://cdn.discordapp.com/attachments/963563981954482276/1168494084613226557/image.png?ex=6551f7eb&is=653f82eb&hm=f3226f21655d152b381a053e2b1ae5ae26c1bf5cb58f00d18e86dd38c31c1c8d&",
        });
      return await interaction.editReply({
        embeds: [embedcomplete],
        files: [invsfile],
      });
    } catch (error) {
      console.log(error);
    }
  },
};
