const { Player } 	    = require('../models');
const validator     = require('validator');
const { to, TE }    = require('../services/util.service');

const getUniqueKeyFromBody = function(body){// this is so they can send in 3 options unique_key, email, or playername and it will work
    let unique_key = body.unique_key;
    if(typeof unique_key==='undefined'){
        if(typeof body.Email != 'undefined'){
            unique_key = body.Email
        }else if(typeof body.Spitzname != 'undefined'){
            unique_key = body.Spitzname
        }else{
            unique_key = null;
        }
    }

    return unique_key;
}
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

const createPlayer = async function(playerInfo){
    let unique_key, auth_info, err;

    auth_info={}
    auth_info.status='create';

    unique_key = getUniqueKeyFromBody(playerInfo);
    if(!unique_key) TE('An email or player name was not entered.');

    if(validator.isEmail(unique_key)){
        auth_info.method = 'Email';
        playerInfo.Email = unique_key;

        [err, player] = await to(Player.create(playerInfo));
        if(err) TE('player already exists with that email' + err.message);

        return player;

    }else if(validator.isAlphanumeric(unique_key)){//checks if only player name was sent
        auth_info.method = 'Spitzname';
        playerInfo.Spitzname = unique_key;

        [err, player] = await to(Player.create(playerInfo));
        if(err) TE('player already exists with that name');

        return player;
    }else{
        TE('A valid email or name was not entered.');
    }
}
module.exports.createPlayer = createPlayer;

const authPlayer = async function(playerInfo){//returns token
    let unique_key;
    let auth_info = {};
    auth_info.status = 'login';
    unique_key = getUniqueKeyFromBody(playerInfo);

    if(!unique_key) TE('Please enter an email or playername to login');


    if(!playerInfo.password) TE('Please enter a password to login');

    let player;
    if(validator.isEmail(unique_key)){
        auth_info.method='Email';

        [err, player] = await to(Player.findOne({Email:unique_key }));
        if(err) TE(err.message);

    }else if(validator.isAlphanumeric(unique_key)){//checks if only player name was sent
        auth_info.method='Spitzname';

        [err, player] = await to(Player.findOne({Spitzname:unique_key }));
        if(err) TE(err.message);

    }else{
        TE('A valid email or player name was not entered');
    }

    if(!player) TE('Not registered');
    [err, player] = await to(player.comparePassword(playerInfo.password));
    console.log("compared");
    if(err) TE(err.message);
    console.log("compared");
    return player;

}
module.exports.authPlayer = authPlayer;