const mongoose 			= require('mongoose');
const bcrypt 			= require('bcrypt');
const bcrypt_p 			= require('bcrypt-promise');
const jwt           	= require('jsonwebtoken');
const League           = require('./league.model');
const validate          = require('mongoose-validator');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

let PlayerSchema = mongoose.Schema({
    Vorname:      {type:String},
    Nachname:       {type:String},
    Spitzname:	    {type:String, maxlength:30, minlength: 3, index: true, unique: true, sparse: true//sparse is because now we have two possible unique keys that are optional
    },
    Email: {type:String, lowercase:true, trim: true, index: true, unique: true, sparse: true,
            validate:[validate({
                validator: 'isEmail',
                message: 'Not a valid email.',
            }),]
    },
    password:   {type:String},
    role: {type: String, enum: ['player', 'admin']},
    Geschlecht: {type: String, enum: ['männlich', 'weiblich']},
    Verein: {type: String},
    Geburtsjahr: {type:Number},
    Spielstaerke: {type:Number,min:1,max:6 },
    Heimatteam: {type: String},
    Position: {type: String}

}, {timestamps: true});

/*PlayerSchema.virtual('leagues', {
    ref: 'League',
    localField: '_id',
    foreignField: 'teams.players.player_id',
    justOne: false,
});*/

PlayerSchema.pre('save', async function(next){

    if(this.isModified('password') || this.isNew){

        let err, salt, hash;
        [err, salt] = await to(bcrypt.genSalt(10));
        if(err) TE(err.message, true);

        [err, hash] = await to(bcrypt.hash(this.password, salt));
        if(err) TE(err.message, true);

        this.password = hash;

    } else{
        return next();
    }
});

 PlayerSchema.methods.comparePassword = async function(pw){
    let err, pass;
    if(!this.password) TE('password not set');
    console.log("password"+ pw);
    [err, pass] = await to(bcrypt_p.compare(pw, this.password));
    if(err) TE(err);

    if(!pass) TE('invalid password');

    return this;
};


PlayerSchema.methods.getJWT = function(){
    let expiration_time = parseInt(CONFIG.jwt_expiration);
    return jwt.sign({player_id:this._id, role:this.role}, CONFIG.jwt_encryption, {expiresIn: expiration_time});
};

PlayerSchema.methods.toWeb = function(){
    let json = this.toJSON();
    json.id = this._id;//this is for the front end
    return json;
};

let Player = module.exports = mongoose.model('players', PlayerSchema);


