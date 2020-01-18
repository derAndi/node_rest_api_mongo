const { ExtractJwt, Strategy } = require('passport-jwt');
const { Player }      = require('../models');
const CONFIG        = require('../config/config');
const {to}          = require('../services/util.service');

module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.jwt_encryption;

    passport.use(new Strategy(opts, async function(jwt_payload, done){
        let err, player;
        [err, player] = await to(Player.findById(jwt_payload.player_id));
        if(err) return done(err, false);
        if(player) {
            player.password = null;
            player.tokenhash = null;
            return done(null, player);
        }else{
            return done(null, false);
        }
    }));
}