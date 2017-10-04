/*
 * OOP GameSpeaking
 * v. 1.0
 */
function GameSpeaking () {

  /* --------- variable web speech api statu -------------- */
  this.recognizerStart = false; // status microphone is on or off

  /* --------- variable game status ----------------------- */
  this.state = 1; // state game
  
  /* --------- ui game ------------------------------------ */
  this.ui = function ( element ) { 
	return $( element );  
  }

  /* --------- functions querySelector ui ----------------- */
  // controll icon microphone
  this.iconMic = function ( status ) {
    // status on, off
    if( status == 'on' ) {
      $('.game-speaking i.icon-speaking').addClass('active');
    } else {
      $('.game-speaking i.icon-speaking').removeClass('active');
    }
  }
  // display translate
  this.display = function ( statusHeader, translate, message ) {
  	var $statusHeader = $('.game-speaking .status-header');
  	var $translate = $('.game-speaking .word');
  	var $message = $('.game-speaking .message');

  	if(statusHeader != null)
  	{
      $statusHeader.html( statusHeader );
  	}
  	
  	if(translate != null)
  	{
   	  $translate.html( translate );
    }

    if(message != null)
    {
  	  $message.html( message );
  	}
  }
  
  /* --------- functions controll microphone --------- */
  // start microphone
  this.startMic = function ( event ) {
    // check status microphone is stated of off
    if( gameSpeaking.recognizerStart ) {
      recognizer.stop();
      recognizerStart = false;
      return;
    } else {
      recognizer.start();
      recognizerStart = true;
    }
  }

  /* --------- function data and game controll ------ */
  this.data = null; // data words
  this.history = []; // data game histoty
  this.add_history = function ( status, data ) { // add game history
    gameSpeaking.history.push( {"word": data.word, "translate": data.translate[0], "time": null, "status": status} );
  }
  this.clear = function () { // clear game data
    gameSpeaking.state = 1; // restart state game
    gameSpeaking.history = []; // clear history game
  }
  // next game
  this.next = function ( state ) {

    // if game end
    if( (gameSpeaking.state - 1) == gameSpeaking.data.length )
    {
      gameSpeaking.end();
      return false; // end thislibe
    }

  	// fadein
  	$('.game-speaking').hide().fadeIn();

    // set display
    var para1 = state + ' Of ' + gameSpeaking.data.length;
    var para2 = gameSpeaking.data[ state - 1 ].translate[0];
    var para3 = 'Speak now';
    gameSpeaking.display( para1, para2, para3 );
  }
  this.skip = function () { // game skip
    // save history
    gameSpeaking.add_history( 'skip', gameSpeaking.data[ (gameSpeaking.state-1) ] );
    
    gameSpeaking.state++;
    gameSpeaking.next( gameSpeaking.state );
  }
  this.restart = function () {
    gameSpeaking.load( user_info.data.user_id, function(){
      // callback
      gameSpeaking.clear(); // clear game data
      gameSpeaking.ui('#game-page .game-end').hide();
      gameSpeaking.ui('.game-speaking').fadeIn();
    
    });
  }
  this.exit = function () {
    // clear game data
    gameSpeaking.clear();  
   
    // back to menu
    gameSpeaking.ui('.game-speaking').hide();
    gameSpeaking.ui('#game-page .game-end').hide();
    gameSpeaking.ui('#game-page .how-to-play').hide();
    gameSpeaking.ui('#game-page .menu').fadeIn();
  }
  this.end = function () { // game end
    // set display game end
    setDisplay( gameSpeaking.history );
    setButton();
     
    gameSpeaking.ui('.game-speaking').hide(); 
    gameSpeaking.ui('#game-page .game-end').fadeIn();
   
    // clear game data  
    gameSpeaking.clear();
   
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
            html +=     '<span class="r-time">success</span>'; 
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
      var $replay = $('#game-page button.btn-replay').attr('onClick','gameSpeaking.restart();'); 
      var $conti = $('#game-page button.btn-continue').attr('onClick','gameSpeaking.exit();'); 
    }
  }  
  this.load = function ( user_id, callback ) {
    $.ajax({
      type: 'POST',
      url: 'api.php?access=data_game',
      success: function( response ) {
        var res = JSON.parse(response);
        var data = json_rand_sort( res.data );
        gameSpeaking.data = data;

        // game start
        gameSpeaking.next( 1 );

        if( callback != undefined )
          callback();
      }
    });
  }
}

// public
var gameSpeaking = new GameSpeaking();

// test browser support
window.SpeechRecognition = window.SpeechRecognition       ||
                           window.webkitSpeechRecognition ||
                           null;

// check browser support web speech api
if (window.SpeechRecognition === null) {
    console.log("You browser not support. Update your browser");
} else {
    var recognizer = new window.SpeechRecognition();

    // set status web speech api
    recognizer.continuous = true; // Recogniser doesn't stop listening even if the user pauses
    recognizer.interimResults = true; // trim string
    recognizer.lang = 'en-US'; // language

    // Start recognising
    recognizer.onresult = function(event) {

    	gameSpeaking.display(null,null, 'Listening...');

        for (var i = event.resultIndex; i < event.results.length; i++) {
            if(event.results[i].isFinal) {
              
              var transcript = event.results[i][0].transcript.trim();
              var answer = gameSpeaking.data[ gameSpeaking.state - 1 ].word;
              var html;

              gameSpeaking.display(null,null, transcript);
			  
			        // speaking right
              if( transcript.search( answer ) != -1 )
              {

                var replace = transcript.replace(answer,'<u><b>'+ answer +'</b></u>');

              	html = '<div class="right"><span>'+ replace +'</span> <i class="sprites"></i></div>';
              	gameSpeaking.display(null,null, html);
				
				        gameSpeaking.add_history( 'success', gameSpeaking.data[ (gameSpeaking.state-1) ] );
              	
              	// next state
              	setTimeout(function(){
                  gameSpeaking.state++;
              	  gameSpeaking.next( gameSpeaking.state );
              	},2500);
              }
              else
              {
              	html = '<div class="wrong"><span>'+ transcript +'</span> <i class="sprites"></i></div>';
              	gameSpeaking.display(null,null, html);

              	setTimeout(function(){
              		gameSpeaking.display(null,null, 'Try again. Speak now');
              	},2500);
              }

        
              
            } else {
              //console.log( event.results[i][0].transcript );
            }
        }
    };

    recognizer.onstart = function() {
        console.log('start listening');
        gameSpeaking.recognizerStart = true;
        gameSpeaking.iconMic('on');
    };

    // Listen for errors
    recognizer.onerror = function(event) {
        console.log('Recognition error: ' + event);
        gameSpeaking.recognizerStart = false;
    };

    // Ended listening
    recognizer.onend = function() {
        console.log('Ended listening');
        gameSpeaking.recognizerStart = false;
        gameSpeaking.iconMic('off');
    };
}

// test Game start
setTimeout(function(){
  //gameSpeaking.load( user_info.data.user_id );
},1500);
