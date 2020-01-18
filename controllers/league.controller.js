const { League } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, league;
    let user = req.user;

    let league_data = req.body;

    [err, league] = await to(League.create(league_data));
    if(err) return ReE(res, err, 422);

    return ReS(res,{league:league.toWeb()}, 201);
}
module.exports.create = create;

const get = function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let league = req.league;
    return ReS(res, league.toWeb());
}
module.exports.get = get;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    [err, leagues] = await to(League.find({}));
    let leagues_json = [];
    for (let i in leagues){
        let league = leagues[i];
        leagues_json.push(league.toWeb())
    }
    return ReS(res, {leagues});
}
module.exports.getAll = getAll;

const update = async function(req, res){
    let err, league, data;
    league = req.league;
    data = req.body;
    league.set(data);

    [err, league] = await to(league.save());
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {league:league.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
    let league, err;
    league = req.league;

    [err, league] = await to(league.remove());
    if(err) return ReE(res, 'error occured trying to delete the league');

    return ReS(res, {message:'Deleted League'}, 204);
}
module.exports.remove = remove;