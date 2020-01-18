const League 			    = require('../models/league.model');
const { to, ReE, ReS } = require('../services/util.service');

let league = async function (req, res, next) {
    let league_id, err, league;
    league_id = req.params.league_id;

    [err, league] = await to(League.findOne({_id:league_id}));
    if(err) return ReE(res,"err finding league");

    if(!league) return ReE(res, "League not found with id: "+league_id);

    req.league = league;
    next();
}
module.exports.league = league;