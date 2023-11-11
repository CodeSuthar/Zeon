const { model, Schema } = require('mongoose');

let loggingSchema = new Schema({
    Guild: String,
    channelLogs: {
        enabled: {
            type: Boolean,
            default: false
        },
        channel: {
            type: String,
            default: null
        }
    },
    emojiLogs: {
        enabled: {
            type: Boolean,
            default: false
        },
        channel: {
            type: String,
            default: null
        }
    },
    guildBanLogs: {
        enabled: {
            type: Boolean,
            default: false
        },
        channel: {
            type: String,
            default: null
        }
    },
    guildMemberLogs: {
        enabled: {
            type: Boolean,
            default: false
        },
        channel: {
            type: String,
            default: null
        }
    },
    guildRoleLogs: {
        enabled: {
            type: Boolean,
            default: false
        },
        channel: {
            type: String,
            default: null
        }
    },
    guildScheduledEventLogs: {
        enabled: {
            type: Boolean,
            default: false
        },
        channel: {
            type: String,
            default: null
        }
    },
    inviteLinkLogs: {
        enabled: {
            type: Boolean,
            default: false
        },
        channel: {
            type: String,
            default: null
        }
    },
    messageLogs: {
        enabled: {
            type: Boolean,
            default: false
        },
        channel: {
            type: String,
            default: null
        }
    },
    stickerLogs: {
        enabled: {
            type: Boolean,
            default: false
        },
        channel: {
            type: String,
            default: null
        }
    },
    stageLogs: {
        enabled: {
            type: Boolean,
            default: false
        },
        channel: {
            type: String,
            default: null
        }
    },
    threadLogs: {
        enabled: {
            type: Boolean,
            default: false
        },
        channel: {
            type: String,
            default: null
        }
    },
    voiceStateLogs: {
        enabled: {
            type: Boolean,
            default: false
        },
        channel: {
            type: String,
            default: null
        }
    },
    webhookLogs: {
        enabled: {
            type: Boolean,
            default: false
        },
        channel: {
            type: String,
            default: null
        }
    }
});

module.exports = model('logging-zeon', loggingSchema);