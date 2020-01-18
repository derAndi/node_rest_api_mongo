const mongoose 			= require('mongoose');
const {TE, to}          = require('../services/util.service');
const validate          = require('mongoose-validator');

let ShortPlayer = mongoose.Schema({
    Vorname: {type: String},
    Nachname: {type: String},
    Spitzname: {type: String}
});

let Team = mongoose.Schema({
    _id: {type: mongoose.Schema.ObjectId},
    Name: {type: String},
    email: {type: String,
        validate:[validate({
            validator: 'isEmail',
            message: 'Not a valid email.',
        }),]
    },
    players: [ShortPlayer]
});



let Game = mongoose.Schema({
    isFinished: {type: Number},
    punkte1: {type: Number},
    punkte2: {type: Number},
    team_id: {type: mongoose.Schema.ObjectId},
    team2_id: {type: mongoose.Schema.ObjectId}
});

let Attendance = mongoose.Schema({
    player_id: {type: mongoose.Schema.ObjectId},
    Status: {type: String}
});

let Gameday = mongoose.Schema({
    Datum: {type: String},
    round: {type: String},
    isFinished: {type: Number},
    name: {type: String},
    games: [Game],
    attendance: [Attendance]
});

let LeagueSchema = mongoose.Schema({
    name: {type:String},
    isFinished: {type: Number},
    status: {type: Number},
    toPay: {type: Number},
    maxPlayers: {type: Number},
    drawSpots: {type: Number},
    femaleInMaxPlayers: {type: Number},
    subscribeDescription: {type: String},
    phases: {type: String},
    email: {type: String,
        validate:[validate({
            validator: 'isEmail',
            message: 'Not a valid email.',
        }),]
    },
    teams: [Team],
    gamedays: [Gameday]
}, {timestamps: true});

LeagueSchema.methods.toWeb = function(){
    let json = this.toJSON();
    json.id = this._id;//this is for the front end
    return json;
};

Game.virtual('winner').get(function () { //now you can treat as if this was a property instead of a function
    if(this.punkte1.isNullOrUndefined() || this.punkte2.isNullOrUndefined()){
        return null;
    } else {
        if(this.punkte1 == this.punkte2){
            return null;
        } else if(this.punkte1 > this.punkte2){
            return this.team_id;
        } else if(punkte2 > punkte1) {
            return this.team2_id
        } else {
            return null;
        }
    }
});

let League = module.exports = mongoose.model('League', LeagueSchema);

