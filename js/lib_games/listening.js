/*
 * OOP Game Listening
 * v. 1.0
 */
 
function GameListening () {
  
  /* --------- variable game status ------------------- */
  this.state = 1; // state game
  
  /* --------- ui game -------------------------------- */
  this.ui = function( element ) {
	return $( element );
  }
  
  /* --------- set display game ----------------------- */
  // set speaker
  this.set_speaker = function ( text ) {
    $('.game-listening .icon-volume').attr('onClick','new GameListening().speak( \''+ text +'\' );');  
  }
  // set choice
  this.set_choice = function () {
	var $choice = $('.game-listening .choice');
	var data = gameListening.data;
	var list_wrong_answer = rand_unsort_answer(0, (data.length - 1), 3 ); // list wrong answer
	var choice_posi = rand_unsort( 0,3,4 ); // choice position
	
	// clear
	$choice.html('');
	// add choises  
    $choice.append( choices() ); 
	
	function html ( word, status ) {
	  return '<input onClick="gameListening.selected( this, '+ status +' );" type="button" value="'+ word +'">';
	}
	
	function choices () {
	  var choices = ''; // html
	  var answers = new Array;
	  
	  answers.push({ text: data[ list_wrong_answer[0] ].translate[0], isRight: false });
	  answers.push({ text: data[ list_wrong_answer[1] ].translate[0], isRight: false });
	  answers.push({ text: data[ list_wrong_answer[2] ].translate[0], isRight: false });
	  answers.push({ text: data[ ( gameListening.state - 1 ) ].translate[0], isRight: true });
	  
	  for( var i=0; i<4; i++ )
	  {
		var para1 = answers[ choice_posi[i] ].text;
		var para2 = answers[ choice_posi[i] ].isRight;
        choices += html( para1, para2 );
	  }
	  
	  return choices;	
	}
	
	function rand_unsort_answer ( min, max, count ) {
	  var numbers = new Array();
	  var status = true;
	  var n;
	  
	  while( status ){
		  
		n = rand( min, max );
		
		if( jQuery.inArray( n, numbers ) == -1 && n != (gameListening.state - 1) )
		{
		  numbers.push( n );		
		}
		
		// end this line
		if( numbers.length == count ) status = false;
		
	  } // end while
	  
	  return numbers;
	}
  }
  // set display
  this.display = function( statusHeader ) {
	var $statusHeader = $('.game-listening .status-header');	
	
    if( statusHeader != null ) {
	  $statusHeader.html( statusHeader );
	}
  }
  
  /* --------- event game ----------------------- */
  // selected anwser
  this.selected = function ( event, status ) {
	$button = $(event); 
	 
    // if user selected right answer
	if( status )
	{
      $button.addClass('right');
	  
	  // stop timer
	  game.stop_timer();
	  
	  // save history
	  gameListening.add_history( 'success', gameListening.data[ (gameListening.state-1) ] );
	  
	  setTimeout(function(){
		gameListening.state++;
	    gameListening.next( gameListening.state );
	  },1300);
	}
	else
	{
	  $button.addClass('wrong');	
	}
  }
  
  /* --------- function controll speaker ---------- */
  // speaker
  this.speak = function ( text ) {
    var $volume = $('.game-listening .icon-volume');
    var recognition = new webkitSpeechRecognition();
    var u = new SpeechSynthesisUtterance();
	
    // option
    u.text = text;
    u.lang = 'en-US';
    u.rate = 1.2;
    u.volume = 1;
	u.onstart = function (event) {
	  // volume active
      $volume.addClass('active');
	}
    u.onend = function(event) {
	  // volume none active
	  $volume.removeClass('active');
    }
	// start speaking
    speechSynthesis.speak( u );	 
  }
  
  /* --------- function data and game controll ---------- */
  this.data = null; // data words
  this.history = []; // data history game play
  this.add_history = function ( status, data ) { // add history game
    gameListening.history.push( {"word": data.word, "translate": data.translate[0], "time": game.get_time, "status": status} );
  }
  this.clear = function () { // clear game data
	game.stop_timer(); // stop timer
	game.clearTimerDisplay(); // clear display timer
	gameListening.state = 1; // restart state game
	gameListening.history = []; // clear history game
  }
  // next game
  this.next = function ( state ) {
	// data word
	var data = gameListening.data[ state - 1 ];
	
	// if game end
	if( (gameListening.state - 1) == gameListening.data.length )
	{
	  gameListening.end();
	  return false;	// end thislibe
	}
	
	// # next game if game is not over yet
	
	// clear timer
	game.clearTimerDisplay();
	
	// animation fade in
	$('.game-listening').hide().fadeIn();
	
	// set display
	var para1 = gameListening.state + ' Of ' + gameListening.data.length;
	gameListening.display( para1 );
	gameListening.set_choice();
	
	// set game
	gameListening.set_speaker( data.word );
	
	// speak
	setTimeout(function(){
	  gameListening.speak( data.word );
	  game.start_timer();
	},500);
  }
  this.skip = function () {
	  // stop timer and clear
	  game.stop_timer();
	  game.clearTimerDisplay();
	  
	  // save history
	  gameListening.add_history( 'skip', gameListening.data[ (gameListening.state-1) ] );
	  
	  gameListening.state++;
	  gameListening.next( gameListening.state );
  }
  this.restart = function() {
    gameListening.load( user_info.data.user_id, function(){
	  // callback
	  gameListening.clear(); // clear game data
	  gameListening.ui('#game-page .game-end').hide();
	  gameListening.ui('.game-listening').fadeIn();
	  
	});
  }
  this.exit = function () {
	// clear game data
	gameListening.clear();  
	 
    // back to menu
	gameListening.ui('.game-listening').hide();
	gameListening.ui('#game-page .game-end').hide();
	gameListening.ui('#game-page .how-to-play').hide();
	gameListening.ui('#game-page .menu').fadeIn();
  }
  this.end = function () {
  
    // set display game end
	setDisplay( gameListening.history );
	setButton();
     
    gameListening.ui('.game-listening').hide(); 
	gameListening.ui('#game-page .game-end').fadeIn();
	 
	// clear game data	
    gameListening.clear();
	 
	function setDisplay ( history ) {
      // clear html
	  $('#game-page .game-end ul.result').html("");
	   
      for( var i=0, score = 0; i<history.length; i++ )
	  {
	    var html = '';
            html += '<li>';
            html +=     '<span class="r-word">'+ (i+1) +'. '+ history[i].word +' : '+ history[i].translate +'</span>';
            if( history[i].status == 'skip' ) {
    		html +=     '<span class="r-time">skip</span>'; 
			} else {
			html +=     '<span class="r-time">'+ history[i].time +'</span>'; 
			score++;
			}
            html += '</li>';

            $('#game-page .game-end ul.result').append( html );   
	  }
	  var percent = Math.floor((score/i) * 100) + '%';
	  var result = 'score = ' + score + '/' + i;
	  $("#res-percent").text(percent);
	}
	 
	function setButton () {
	  var $replay = $('#game-page button.btn-replay').attr('onClick','gameListening.restart();'); 
	  var $conti = $('#game-page button.btn-continue').attr('onClick','gameListening.exit();'); 
    }
  }
  this.load = function ( user_id, callback ) {
    $.ajax({
      type: 'POST',
      url: 'api.php?access=data_game',
      success: function( response ) {
        var res = JSON.parse(response);
        var data = json_rand_sort( res.data );
		
		// word data
        gameListening.data = data;
		
		// start game
		gameListening.next( 1 );
		
		// callback
		if( callback != undefined )
			callback();
      }
    });
  }
}


var gameListening = new GameListening();
