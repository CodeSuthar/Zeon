const { model, Schema, SchemaTypes } = require('mongoose');
 
const giveawaySchema = new Schema({
    messageId: String,
    channelId: String,
    guildId: String,
    startAt: Number,
    endAt: Number,
    ended: Boolean,
    winnerCount: Number,
    prize: String,
    messages: {
        giveaway: String,
        giveawayEnded: String,
        inviteToParticipate: String,
        drawing: String,
        dropMessage: String,
        winMessage: SchemaTypes.Mixed,
        embedFooter: SchemaTypes.Mixed,
        noWinner: String,
        winners: String,
        endedAt: String,
        hostedBy: String
    },
    thumbnail: String,
    image: String,
    hostedBy: String,
    winnerIds: { type: [String], default: undefined },
    reaction: SchemaTypes.Mixed,
    botsCanWin: Boolean,
    embedColor: SchemaTypes.Mixed,
    embedColorEnd: SchemaTypes.Mixed,
    exemptPermissions: { type: [], default: undefined },
    exemptMembers: String,
    bonusEntries: String,
    extraData: SchemaTypes.Mixed,
    lastChance: {
        enabled: {
            type: Boolean,
            default: false
        },
        content: String,
        threshold: Number,
        embedColor: SchemaTypes.Mixed
    },
    pauseOptions: {
        isPaused: Boolean,
        content: String,
        unPauseAfter: Number,
        embedColor: SchemaTypes.Mixed,
        durationAfterPause: Number,
        infiniteDurationText: String
    },
    isDrop: Boolean,
    allowedMentions: {
        parse: { type: [String], default: undefined },
        users: { type: [String], default: undefined },
        roles: { type: [String], default: undefined }
    }
}, { id: false });
 
module.exports = model('giveaway-zeon', giveawaySchema);