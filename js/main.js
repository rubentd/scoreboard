$(document).ready( function(){

	adjustHeight();
	var game = new GameController();
	$(document).keyup(function(e){
		game.listenKeys(e);
	});

});

/*
 * CONFIG
 */
var globalReset = 0;
MAX_GOALS = 10;

function GameController(){
	this.init();
}

GameController.prototype = {

	init : function(){
		this.blue = new Player("blue");
		this.white = new Player("white");
		this.removeAnimations();
		this.updateScreen();
		this.loadSounds();
	},

	reset: function(){
		this.sounds.victory.pause();
		this.sounds.crowd.pause();
		clearTimeout(globalReset);
		this.init();
	},

	loadSounds : function(){
		this.sounds = {};
		this.sounds.ding = new Audio('sounds/ding.mp3');
		this.sounds.firstBlood = new Audio('sounds/1-first-blood.mp3');
		this.sounds.dominating = new Audio('sounds/2-dominating.mp3');
		this.sounds.unstoppable = new Audio('sounds/unstoppable.mp3');
		this.sounds.wickedSick = new Audio('sounds/whicked-sick.mp3');
		this.sounds.triple = new Audio('sounds/3-triple.mp3');
		this.sounds.super = new Audio('sounds/4-super.mp3');
		this.sounds.hyper = new Audio('sounds/5-hyper.mp3');
		this.sounds.brutal = new Audio('sounds/6-brutal.mp3');
		this.sounds.master = new Audio('sounds/7-master.mp3');
		this.sounds.awesome = new Audio('sounds/8-awesome.mp3');
		this.sounds.blaster = new Audio('sounds/9-blaster.mp3');
		this.sounds.monster = new Audio('sounds/10-monster.mp3');
		this.sounds.comboBreaker = new Audio('sounds/combo-breaker.mp3');
		this.sounds.crowd = new Audio('sounds/crowd.mp3');
		this.sounds.excellent = new Audio('sounds/excellent.mp3');
		this.sounds.finishHim = new Audio('sounds/finish-him.mp3');
		this.sounds.humiliation = new Audio('sounds/humiliation.mp3');
		this.sounds.superb = new Audio('sounds/superb.mp3');
		this.sounds.supremeVictory = new Audio('sounds/supreme-victory.mp3');
		this.sounds.thatWasPathetic = new Audio('sounds/that-was-pathetic.mp3');
		this.sounds.danger = new Audio('sounds/danger.mp3');
		this.sounds.wellDone = new Audio('sounds/well-done.mp3');
		this.sounds.winner = new Audio('sounds/winner.mp3');
		this.sounds.youllNeverWin = new Audio('sounds/youll-never-win.mp3');
		this.sounds.victory = new Audio('sounds/victory.mp3');
	},

	updateScreen : function(){
		$("#white-score").html( this.white.score );
		$("#blue-score").html( this.blue.score );
	},

	bouncePlayerScore: function(playerId){
		$('#' + playerId + '-score').addClass("animated pulse");
		setTimeout(function(){
			$('#' + playerId + '-score').removeClass("animated pulse");
		}, 1000);
	},

	goal: function(goalPlayer, otherPlayer){
		goalPlayer.score++;
		goalPlayer.combo++;
		this.bouncePlayerScore(goalPlayer.id);
		this.updateScreen();
		this.soundEffect(goalPlayer, otherPlayer);
	},

	listenKeys : function(e) {

	    e = e || window.event;
	    if (e.keyCode == '37') { //left
	        this.goal( this.white, this.blue ); // Goal of white player
	    }
	    else if (e.keyCode == '39') { //right
	        this.goal( this.blue, this.white ); // Goal of blue player
	    }
	    else if (e.keyCode == '38') { //up : RESET
	        this.init();
	    }
	},

	soundEffect : function(goalPlayer, otherPlayer){
		var gc = this;
		this.sounds.ding.play();

		if(goalPlayer.score == MAX_GOALS){
			gc.sounds.crowd.play();
			gc.sounds.victory.play();
			gc.sounds.winner.play();
			setTimeout( function(){
				gc.addCelebrationToNumber(goalPlayer.id);
			}, 2000);
			if(otherPlayer.score < 5){
				setTimeout( function(){
					gc.playRandomHumilliation();
				}, 12000);
			}
			globalReset = setTimeout( function(){
				gc.reset();
			}, 14000);
		}
		//Danger sound
		 else if(goalPlayer.score == MAX_GOALS - 1){
			this.sounds.danger.play();
			setTimeout( function(){
				gc.sounds.finishHim.play();
			}, 1000);
		}
		//Combos
		 else if(goalPlayer.score == 1 && otherPlayer.score == 0){
			this.sounds.firstBlood.play();
		}else if(goalPlayer.score == 2 && otherPlayer.score == 0){
			this.sounds.dominating.play();
		}else if(goalPlayer.combo == 3){
			if(otherPlayer.score > 0){
				this.sounds.triple.play();
			}else{
				this.sounds.wickedSick.play();
			}
		}else if(goalPlayer.combo == 4){
			this.sounds.super.play();
		}else if(goalPlayer.combo == 5){
			this.sounds.hyper.play();
		}else if(goalPlayer.combo == 6){
			this.sounds.brutal.play();
		}else if(goalPlayer.combo == 7){
			this.sounds.master.play();
		}else if(goalPlayer.combo == 8){
			this.sounds.awesome.play();
		}else if(goalPlayer.combo == 9){
			this.sounds.blaster.play();
		}else if(goalPlayer.combo == 10){
			this.sounds.monster.play();
		}else if(otherPlayer.combo > 2){
			this.sounds.comboBreaker.play();
		}else{
			this.playRandomGoodSound();
		}
		otherPlayer.combo=0;
		
	},

	playRandomGoodSound: function(){
		var r = randRange(0, 2);
		if(r == 0){
			this.sounds.excellent.play();
		}else if(r == 1){
			this.sounds.superb.play();
		}else{
			this.sounds.wellDone.play();
		}
	},

	playRandomHumilliation: function(){
		var r = randRange(0, 2);
		if(r == 0){
			this.sounds.humiliation.play();
		}else if(r == 1){
			this.sounds.youllNeverWin.play();
		}else if(r == 2){
			this.sounds.thatWasPathetic.play();
		}else{
			this.sounds.supremeVictory.play();
		}
	},

	addCelebrationToNumber: function(playerId){
		$('#' + playerId + '-score').addClass("animated infinite flash");
	},

	removeAnimations: function(){
		$('.score').removeClass("animated");
		$('.score').removeClass("infinite");
		$('.score').removeClass("flash");
		$('.score').removeClass("pulse");
	}

}

function Player(id){
	this.score = 0;
	this.combo = 0;
	this.id = id;
}

function randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function adjustHeight(){
	var h = $(window).height();
	$(".score").css('height', h + 'px');
	$(".score").css('line-height', h + 'px');
	$(".score").css('font-size', h*.8 + 'px');
}
