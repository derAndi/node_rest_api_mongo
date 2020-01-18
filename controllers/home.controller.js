const { to, ReE, ReS } = require('../services/util.service');

const Dashboard = function(req, res){
	let player = req.player.id;
	return res.json({success:true, message:'it worked', data:'player name is :'});
}
module.exports.Dashboard = Dashboard