const express = require("express");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const url = require("url");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const passport = require("passport");
const Strategy = require("passport-discord").Strategy;
const discordinfo = require("discordinfo.js");

module.exports = async (client) => {

    //Backend Of The Dashboard
    const app = express();
    const session = require("express-session");
    const MemoryStore = require("memorystore")(session);

    //Initalize the Discord Login
    passport.serializeUser(
        (user, done) => done(null, user)
    )
    passport.deserializeUser(
        (obj, done) => done(null, obj)
    )

    passport.use(new Strategy({
        clientID: client.config.Dashboard.Information.ClientID,
        clientSecret: client.config.Dashboard.Information.ClientSecret,
        callbackURL: client.config.Dashboard.Information.Domain + client.config.Dashboard.Information.CallbackURL,
        scope: client.config.Dashboard.Information.Scopes
    }, (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => done(null, profile))
    }))

    app.use(session({
        store: new MemoryStore({ checkPeriod: 86400000 }),
        secret: `#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n`,
        resave: false,
        saveUninitialized: false
    }));

    //Middlewares
    app.use(passport.initialize());
    app.use(passport.session());

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "./Views"))  ;

    app.use(bodyParser.json());  
    app.use(bodyParser.urlencoded({  
        extended: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));

    app.use(express.static(path.join(__dirname, "./Public")));
    app.use("/css", express.static(__dirname + './Public/css'));
    app.use("/img", express.static(__dirname + './Public/img'));
    app.use("/js", express.static(__dirname + './Public/js'));

    const checkAuth = (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login");
    }

    app.get("/login", (req, res, next) => {
        if (req.session.backURL) {
            req.session.backURL = req.session.backURL;
        } else if (req.headers.referer) {
            const parsed = url.parse(req.headers.referer);
            if (parsed.hostname == app.locals.domain) {
                req.session.backURL = parsed.path
            }
        } else {
            req.session.backURL = "/"
        }
        next();
    }, passport.authenticate("discord", { prompt: "none" }));

    app.get(client.config.Dashboard.Information.CallbackURL, passport.authenticate("discord", { failureRedirect: "/" }), async (req, res) => {
        const info = new discordinfo({
            token: client.config.Bot.Token
        });
        const syt = await client.users.fetch(req.user.id);
        let banned = await client.db.get(`blacklist_${syt.id}`);
        if (banned) {
            req.session.destroy()
            res.json({ login: false, message: "You are banned from the dashboard", logout: true })
            req.logout();
        } else {
            res.redirect("/dashboard")
        }
    });

    app.get("/logout", function(req, res, next) {
        req.logout(function(err) {
            if (err) {
              return next(err);
            }
            req.session.destroy()
            res.redirect('/');
        });
    });

    app.get("/", (req, res) => {
        res.render("index", {
            user: req.isAuthenticated() ? req.user : null,
            bot: client,
            req: req,
            config: client.config
        });
    });

    app.get("/commands", (req, res) => {
        res.render("commands", {
            user: req.isAuthenticated() ? req.user : null,
            bot: client,
            req: req,
            config: client.config
        });
    });

    app.get("/invite", (req, res) => {
        res.render("invite", {
            user: req.isAuthenticated() ? req.user : null,
            bot: client,
            req: req,
            config: client.config
        });
    });

    app.get("/support", (req, res) => {
        res.render("support", {
            user: req.isAuthenticated() ? req.user : null,
            bot: client,
            req: req,
            config: client.config
        });
    });

    app.get("/vote", (req, res) => {
        res.render("vote", {
            user: req.isAuthenticated() ? req.user : null,
            bot: client,
            req: req,
            config: client.config
        });
    });

    app.get("/underprogress", (req, res) => {
        res.render("underprogress", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            client: client,
            config: client.config
        });
    });

    app.get("/dashboard", (req, res) => {
        if (!req.user) {
            res.render("401", {
                req: req,
                user: req.isAuthenticated() ? req.user : null,
                client: client,
                config: client.config
            })
        } else {
            res.render("dashhome", {
                req: req,
                user: req.isAuthenticated() ? req.user : null,
                client: client,
                config: client.config,
                Permissions: PermissionsBitField
            })
        }
    });

    app.get("/dashboard/:guildID", async (req, res) => {
        if (!req.user) {
            res.render("401", {
                req: req,
                user: req.isAuthenticated() ? req.user : null,
                client: client,
                config: client.config
            })
        }
      
        const Guild = await client.guilds.fetch(req.params.guildID)
  
        const Member = await Guild.members.fetch(req.user.id)
  
        if (!Member) {
            res.render("401", {
                req: req,
                user: req.isAuthenticated() ? req.user : null,
                client: client,
                config: client.config
            })
        }
  
        if (!Member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            res.render("401",  {
                user: req.isAuthenticated() ? req.user : null,
                client: client,
                req: req,
                config: client.config
            })
        }
  
        res.render("underprogress", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            guild: Guild,
            client: client,
            config: client.config
        })
    })

    app.use(function(req, res) {
        if (res.status(404)) {
            return res.render("404", {
                req: req,
                user: req.isAuthenticated() ? req.user : null,
                client: client,
                config: client.config
            })
        }
    });

    const http = require("http").createServer(app);
    http.listen(client.config.Dashboard.Information.Port, () => {
        console.log(`Website is online on the Port: ${client.config.Dashboard.Information.Port}, ${client.config.Dashboard.Information.Domain}`);
    });
}