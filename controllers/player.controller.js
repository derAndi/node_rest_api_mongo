const { Player }      = require('../models');
const authService   = require('../services/auth.service');
const { to, ReE, ReS }  = require('../services/util.service');

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    const body = req.body;
    if(!body.unique_key && !body.Email && !body.Spitzname){
        return ReE(res, 'Please enter an email or player name to register.');
    } else if(!body.password){
        return ReE(res, 'Please enter a password to register.');
    }else{
        let err, player;

        [err, player] = await to(authService.createPlayer(body));

        if(err) return ReE(res, err, 422);
        return ReS(res, {message:'Successfully created new player.', player:player.toWeb(), token:player.getJWT()}, 201);
    }
}
module.exports.create = create;

const get = async function(req, res){
    //get should only be accesible by admins
    res.setHeader('Content-Type', 'application/json');
    let player = req.user;
    //if player.role = admin
    console.log("player: player"+ player);

    return ReS(res, {player:player});
};
module.exports.get = get;

const getMe = async function(req, res){
    //respond with player
    res.setHeader('Content-Type', 'application/json');
    let player = req.user;

    console.log("player: "+ player);

    return ReS(res, {player:player.toWeb()});
};
module.exports.getMe = getMe;

const getAll = async function(req, res){
    console.log("getAllPlayers");
    res.setHeader('Content-Type', 'application/json');
    [err, players] = await to(Player.find({}));

    let players_json = [];
    for (let i in players){
        let player = players[i];
        players_json.push(player.toWeb())
    }

    return ReS(res, players);
}
module.exports.getAll = getAll;

const update = async function(req, res){
    let err, player, data;
    player = req.user;
    data = req.body;
    player.set(data);

    [err, player] = await to(player.save());
    if(err){

        if(err.message.includes('E11000')){
            if(err.message.includes('Spitzname')){
                err = 'This player name is already in use';
            } else if(err.message.includes('Email')){
                err = 'This email address is already in use';
            }else{
                err = 'Duplicate Key Entry';
            }
        }

        return ReE(res, err);
    }
    return ReS(res, {message :'Updated Player: '+player.Email});
}
module.exports.update = update;

const remove = async function(req, res){
    let player, err;
    player = req.user;

    [err, player] = await to(player.destroy());
    if(err) return ReE(res, 'error occured trying to delete player');

    return ReS(res, {message:'Deleted Player'}, 204);
}
module.exports.remove = remove;


const login = async function(req, res){
    const body = req.body;
    let err, player;
    console.log("login");
    [err, player] = await to(authService.authPlayer(req.body));
    if(err) return ReE(res, err, 422);
    return ReS(res, {"token":player.getJWT(), "player":player.toWeb()});
}
module.exports.login = login;