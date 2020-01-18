const express 			= require('express');
const router 			= express.Router();

const PlayerController 	= require('../controllers/player.controller');
const LeagueController = require('../controllers/league.controller');
const HomeController 	= require('../controllers/home.controller');

const custom 	        = require('./../middleware/custom');

const passport      	= require('passport');
const path              = require('path');

require('./../middleware/passport')(passport);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:"success", message:"Parcel Pending API", data:{"version_number":"v1.0.0"}})
});

router.post(    '/players',           PlayerController.create);                                                    // C
router.get(     '/players/me',        passport.authenticate('jwt', {session:false}), PlayerController.getMe);       // C
router.get(     '/players/:player_id',passport.authenticate('jwt', {session:false}), PlayerController.get);          // C
router.get(     '/players',           passport.authenticate('jwt', {session:false}), PlayerController.getAll);        // R
router.put(     '/players/:player_id',passport.authenticate('jwt', {session:false}), PlayerController.update);     // U
router.delete(  '/players/:player_id',passport.authenticate('jwt', {session:false}), PlayerController.remove);     // D
router.post(    '/players/login',     PlayerController.login);

router.post(    '/leagues',             passport.authenticate('jwt', {session:false}), LeagueController.create);                  // C
router.get(     '/leagues',             LeagueController.getAll);                  // R

router.get(     '/leagues/:league_id', custom.league, LeagueController.get);     // R
router.put(     '/leagues/:league_id', passport.authenticate('jwt', {session:false}), custom.league, LeagueController.update);  // U
router.delete(  '/leagues/:league_id', passport.authenticate('jwt', {session:false}), custom.league, LeagueController.remove);  // D

router.get('/dash', passport.authenticate('jwt', {session:false}),HomeController.Dashboard)


//********* API DOCUMENTATION **********
router.use('/docs/api.json',            express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
router.use('/docs',                     express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
module.exports = router;
