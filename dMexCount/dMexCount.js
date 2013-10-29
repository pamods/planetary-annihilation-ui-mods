//Order from least to most
var producersM = [
	{ name: 'Metal Extractor', rate: 7 },
	{ name: 'Commander', rate: 10 },
	{ name: 'Advanced Metal Extractor', rate: 28 }
];
var producersMCommanderIndex = 1;

var producersE = [
	{ name: 'Energy Plant', rate: 600 },
	{ name: 'Commander', rate: 1000 },
	{ name: 'Advanced Energy Plant', rate: 5000 }
];
var producersECommanderIndex = 1;

function calculateChange(val, possibilities, alive) {
	var decreasing = val < 0;
	var changeAmount = decreasing ? -1 : 1;
	
	val = Math.abs(val);

	//this is hard to work out correctly if multiple change at the same time
	//so we just have the greedy implementation which is usually right, unless lots of changes happen at the same time
	//todo: dynamic programming solution :)
	
	for (var i = possibilities.length - 1; i >= 0; i--) {
		var p = possibilities[i];

		//You can never gain commanders
		if (!decreasing && p.name == 'Commander') {
			continue;
		}
		
		while (p.rate <= val) {
			//If there aren't any of these, can't get rid of them
			if (decreasing && alive[p.name] == 0) {
				break;
			}
			
			if (!alive[p.name]) {
				alive[p.name] = changeAmount;
			} else {
				alive[p.name] += changeAmount;
			}
			val -= p.rate;
		}
	}
	
	if (val != 0) {
		console.log('Sorry we messed up :( ' + val);
	}
}

function genStr(basic, advanced) {
	if (advanced > 0 && basic > 0) {
		return "Basic: " + basic + " / Adv: " + advanced;
	} else if (advanced > 0) {
		return "Adv: " + advanced;
	} else {
		return "Basic: " + basic;
	}
}

var divM = $('<div class="mex-left">? / ?</div>');
var divE = $('<div class="mex-right">? / ?</div>');
$($('.div_status_bar > > > > td >')[0]).append(divM);
$($('.div_status_bar > > > > td >')[1]).append(divE);

var currentM = 0, currentE = 0;

var aliveE = {};
var aliveM = {};

setInterval(function() {
	var m = model.metalGain();
	var e = model.energyGain();
	
	var change = (e != currentE) || (m != currentM);
	
	//just started, will be commanders value only
	if (currentE == 0 && currentM == 0) {
		//check we have at least one commander worth as the values are weird at the start of the game
		if (e >= producersE[producersECommanderIndex].rate && m >= producersM[producersMCommanderIndex].rate) {
			aliveM['Commander'] = m / producersM[producersMCommanderIndex].rate;
			aliveE['Commander'] = e / producersE[producersECommanderIndex].rate;
			
			currentM = m;
			currentE = e;
		}
	} else {
		if (m != currentM) {
			calculateChange(m - currentM, producersM, aliveM);
			currentM = m
		}
		
		if (e != currentE) {
			calculateChange(e - currentE, producersE, aliveE);
			currentE = e;
		}
	}
	
	if (change) {
		divM.html(genStr(aliveM['Metal Extractor'] || 0, aliveM['Advanced Metal Extractor'] || 0));
		divE.html(genStr(aliveE['Energy Plant'] || 0, aliveE['Advanced Energy Plant'] || 0));
	}
}, 100);