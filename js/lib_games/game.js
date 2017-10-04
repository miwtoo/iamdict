var timer;

function Game() {

    this.data_game; // json data for load game
    this.data_score = []; // data score for result end game
    this.state = 1; // state game
    this.clearInput = clearInput;
    this.focus_input = focus_input;
    this.keyup_input = keyup_input;
    this.game_skip = game_skip;
    this.start_timer = start_timer;
    this.stop_timer = stop_timer;
	this.get_time = 0;
	this.clearTimerDisplay = clearTimerDisplay;
	this.clear = function () { // clear game data
		game.stop_timer(); // stop timer
		game.clearTimerDisplay(); // clear display timer
		game.state = 1; // restart state game
		game.data_score = []; // clear history game
	}
	this.restart = function () {
		// clear data game
		game.clear();
		
		load_game( user_info.data.user_id, function(){
			$('#game-page .game-end').hide();
	  		$('.game-writing').fadeIn();
		} );		
	}
	this.exit = function () { // game end
		// clear data game
		game.clear();
		
		$('.game-writing').hide();
		$('#game-page .game-end').hide();
        $('#game-page .how-to-play').hide();
		$('#game-page .menu').fadeIn();
	}

    function start_timer() {
        var start = new Date;

        timer = setInterval(function() {
            game.get_time = (new Date - start) / 1000;
            $('#game-page .status-footer .time span').text( game.get_time );
        }, 100);
    }

    function stop_timer() {
        clearInterval(timer);
    }
	
	function clearTimerDisplay() {
		$('#game-page .status-footer .time span').text('0.00');	
	}

    function game_skip () {
        next_game( 'skip' );
    }

    function clearInput( element ) {
        $(element).removeClass("right wrong");
        $(element).val("");
    }

    function focus_input( t ) {
        var regExp = /wrong/;
        var res = regExp.test( $(t).attr("class") );

        if(res)
        {
            clearInput( t );
        }
    }

    function keyup_input( e, t ) {
        var val = $(t).val().toUpperCase().trim();
        var patt = new RegExp("^[a-zA-Z]+$");

        // key backslash
        if( e.keyCode == 8 ) {
            $(t).prev("input.char").focus();
        }
        
        // not english language
        if(
            patt.test(val) == false ||
            e.keyCode == 9 ||
            e.keyCode == 13 ||
            e.keyCode == 16 ||
            e.keyCode == 32 ||
            val.length > 1
        )
        {
            clearInput( t );
            return false;   
        }
        
        var char_result = $(t).attr("data-char");
        
        if(val == char_result)
        {
            $(t).addClass("right");
        }
        else if(val != char_result && val != "") 
        {
            $(t).addClass("wrong");          
        }
        else
        {
                
        }
        
        $(t).val( val )
        
        $(t).next("input.char").focus();

        e.preventDefault();

        // what user inter char
        if(!check_complate())
        {
            // not complate yet
            console.log('game are not success yet');
        }
        else
        {   
            // complate
            next_game( 'success' );
        }

        function check_complate() {
             
             var count =  $("#game-page div.input input.char").length;
             var j = 0;

             for( var i=0; i < count; i++ )
             {
                var el = document.querySelectorAll("#game-page div.input input.char")[i];

                var regExp = /right/;
                var res = regExp.test( $(el).attr("class") );

                //console.log(i+': ' + res);

                if(res)
                {
                    j++;
                }
             }

             if(count == j)
             {
                return true;
             }
             else
             {
                return false;
             }
        }
    }
}   

var game = new Game();

function game_start( state, json ) {

    game.start_timer();

    var data = json[ state - 1 ];

    // clear
    $("#game-page div.word, #game-page div.input").html("");

    // animate
    $('#game-page .wrapper .game-play').hide().fadeIn();

    // set state
    $("#game-page .min").text( state );
    $("#game-page .max").text( json.length );

    // set word
    $("#game-page .word").text( data.translate[0] );

    // set input
    for( var i=0; i < data.word.length; i++ )
    {
         var Char = data.word[i].toUpperCase();

         var html = '<input type="text" maxlength="1" class="char" data-char="'+ Char +'" onkeyup="new Game().keyup_input(event,this)" onclick="new Game().clearInput(this)" onfocus="new Game().focus_input(this)">';

         $("#game-page div.input").append( html );
    }

    $("#game-page div.input input.char:first-of-type").focus();

}

// next state game
function next_game ( status ) {

    // save socre, time
    if( status == 'skip' )
    {
        save_new_score( 'skip' );
    }
    else if ( status == 'success' )
    {
        save_new_score( 'success' );
    }
    else 
    {
        save_new_score();
    }

    // stop timer
    game.stop_timer();

    if( IsEnd_game() )
    {
        // game end
        console.log( 'game end' );

        $('#game-page .wrapper .game-play').hide();
        $('#game-page .wrapper .game-end').fadeIn();
        $('#game-page .game-end ul.result').html("");

        for( var i=0, score=0; i < game.data_score.length; i++ )
        {
            var data = game.data_score[i];

            var html = '';
                html += '<li>';
                html +=     '<span class="r-word">'+ (i+1) +'. '+ data.word +' : '+ data.translate +'</span>';
                if(data.time == 0)
                {
                html +=     '<span class="r-time">skip</span>';
                }
                else
                {
                html +=     '<span class="r-time">'+ data.time +'</span>';
				score++;
                }
                html += '</li>';

            $('#game-page .game-end ul.result').append( html );
        }
		
		var percent = Math.floor((score/i) * 100) + '%';
		var result = 'score = ' + score + '/' + i;
		
		$("#res-percent").text(percent);
		
		// set button
		$('#game-page button.btn-replay').attr('onClick','game.restart();'); 
	    $('#game-page button.btn-continue').attr('onClick','game.exit();'); 
    }
    else
    {
		
		game.state++;
        
		if(status == 'skip') {
        
			game_start( game.state, game.data_game );
		
		} else {
			setTimeout(function(){
			  // game continue, next game
			  game_start( game.state, game.data_game );
			},1300);	
		}

        //console.log( 'game continue' );
    }

    function IsEnd_game () {
        if(game.state == game.data_game.length)
            return true;
        else
            return false;
    }
}

// get new score
function save_new_score( status ) {

    var time;
    var word = game.data_game[ game.state - 1 ].word;
    var translate = game.data_game[ game.state - 1 ].translate[0];
    var new_score;

    if( status == 'skip' )
    {
        var time = 0;
    }
    else
    {
        var time = game.get_time;
    }

    
    new_score = {"word": word, "translate": translate, "time": time};

    game.data_score.push( new_score );
}

// get score
function get_score() {
    return game.data_score;
}

// lode game
function load_game( user_id, callback ) {
    $.ajax({
        type: 'POST',
        url: 'api.php?access=data_game',
        data: {  },
        beforeSend: function() {
            
        },
        success: function( response ) {
			
            var res = JSON.parse(response);
            var data = json_rand_sort( res.data );

            game.data_game = data;

            game_start(1, game.data_game);
			
			if( callback != undefined )
				callback();
        }
    });
}







