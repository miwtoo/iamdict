/*
 *
 *  IamDict
 *  Author apichai_kub@hotmail.com
 *  Good luck my friend for hacking :) 
 *
 */

// get user info
$(document).ready(function(){
    var get_user_info = JSON.parse( $('#iamdict-user-info').attr('data-user')) ;
    user_info.data = get_user_info;
});

function User_info () {
    this.data = []; // json data
}
var user_info = new User_info();

// click to close page
function clickClose_Page( element ) {
	$(".popup-page-common").removeClass("fadeIn").fadeOut();

    switch( element ) {
        case '#add-page':
            get_newWord( user_info.data.user_id );
            get_Dict( user_info.data.user_id );

            $( '#add-page .wrapper .main' ).load( "html/form_saveword.html?v=3" );
        break;
        case '#game-page':
            // exit games
            gameSpeaking.exit();
            gameListening.exit();
            game.exit();
        break;
        case '#chart-page':
            setDef_view_chart();
        break;
    }

    $('.popup_').remove();
}

// click to show page
function clickPopup_Page( element, url ) {
	
	// element : element to show
	// url : url to change
	
	$( element ).fadeIn(0).addClass("fadeIn");

    // event page
    switch(element) {
		case '#add-page':
			$( '#add-page .wrapper .main' ).load( "html/form_saveword.html?v=3",function(){
				$("#input-of-word").find("input.text").focus();
			});
		break;
        case '#game-page':

            var count = $('#count_words').text() * 1 + 0;

            if( count < 10 ) {
                $( element ).hide();
                alert("คำศัพท์น้อยกว่า 10 คำ ไม่สามารถเล่นเกมได้");
            }

        break;
        case '#chart-page': 
            $.ajax({
                url: 'api_chart.php?access=word_of_this_week',
                dataType:"json",
                async: false,
                success: function( response ) {
                    
                    set_Chart( new google.visualization.DataTable( response ) );
                }
            });
			
            setTimeout(function(){
                var data = new google.visualization.DataTable(
                   {
                     cols: [{id: 'Day', label: 'word', type: 'string'},
                            {id: 'string', label: 'Your add', type: 'number'}],
                     rows: [{c:[{v: 'January'}, {v: 13}]},
                            {c:[{v: 'February'}, {v: 12}]},
                            {c:[{v: 'March'}, {v: 15}]},
                            {c:[{v: 'April'}, {v: 10}]},
                           ]
                   }
                )
                //set_Chart( data );
            },4000);
        break;
    }
}

// set url
function setUrl( url ) {
	//window.history.pushState(null, null, url);	
}

// click scroll to char
function scrollTo_ChatAt( t, char ) {
	
	$('#dict-page').scrollTop(0);
	
	var el = '#mydict #charAt-' + char;
	
	$('#dict-page').animate({
		scrollTop: $(el).offset().top - 70
	}, 1000);
	
	// set active char on right
	$("ul.sorting-char li").removeClass();
	$(t).addClass("active");
}

// click add field
function click_addField( field ) {

    // String field : translate, sentence

    var el;

    if( field == 'translate' )
    {
        el = $('#input-of-translate');
    }
    else if ( field == 'sentence' )
    {
        el = $('#input-of-sentence');
    } else {}

    var count = $( '.form .field .list' ).length;
	
    var ref = 'input-ref_' + ( count + 1 );
	var ref_class = "#" + ref;

    // add input text into element
    el.find('.field').append('<div class="list" id="'+ref+'"><input type="text" class="text"><i class="delete" onclick=\'click_remove_input(  "'+ ref_class +'" );\'>x</i></div>');

    // animate
    el.find('.field .list:last-of-type').css({opacity: "0", top: "-10px"}).animate({top: "0px", opacity : "1"}, 500);

}

// click remove input
function click_remove_input ( element_str ) {
	
	if( $('.popup-word-detail').length == 0 ) {
		
	} else {
		$('.popup-word-detail').attr("id","");	
	}
	
    $( element_str ).remove();
	
	setTimeout(function(){
		$('.popup-word-detail').attr("id","popup-word-detail");	
	},100);
}

// key up refresh input
function refresh_input ( t ) {
    var val = $( t ).val().trim();
    if( val.length > 0 )
    {
        $( t ).removeClass('wrong');
    }
}

// click save word
function click_saveWord () {

    var word = $('#input-of-word input.text').val().trim(); // String
    var trans = getData('translate'); // JSON
    var sente = getData('sentence'); // JSON

    // check from
    if( ! check_from() )
    {
        // not save
    }
    else 
    {
        saveWord( word, trans, sente );
    }
}

function click_editWord ( word_id ) {
	var word = $('#input-of-word input.text').val().trim(); // String
    var trans = getData('translate'); // JSON
    var sente = getData('sentence'); // JSON
	
	if( ! check_from() )
    {
        // not save
		console.log('failed');
    }
    else 
    {
        editWord( word_id, word, trans, sente );
    }
}

function close_editWord() {
	$('#popup-word-detail, #mydict-result-home').hide();
	$('.edit-word').remove();
	$('.nav').fadeIn();
	$('#search-word-home').val("");
}

// check data
function check_from () {
	
	var word = $('#input-of-word input.text').val().trim(); // String
	var trans = getData('translate'); // JSON
	var sente = getData('sentence'); // JSON
		
	var r = true;
	var focused = false;
	var $word = $('#input-of-word');
	var $trans = $('#input-of-translate');
	var wrong;

	// check word
	wrong = $word.find('input.text').attr('class').search("wrong");
	if( word == "")
	{
		// is null
		addClass_wrong( $word.find('input.text') );
		$word.find('.display-msg-wrong').html("a-z only and do can't use spaces ' '").show();
		focus_element( $word.find('input.text') );

		r = false;
	}
	else if(wrong > 0)
	{
		$word.find('.display-msg-wrong').html("this word has been saved in your dictionary.").show();
		$word.find('input.text').addClass('wrong');
		focus_element( $word.find('input.text') );
		r = false;
	}
	else 
	{
		removeClass_wrong( $word.find('input.text') );
		$word.find('.display-msg-wrong').hide();
	}

	// check translate
	for( var i=0; i < trans.length; i++ )
	{
		var text = trans[i].trim();
		var el = $trans.find('.field .list:nth-child('+ (i+1) +') input.text');

		if( text.length == 0 )
		{
			addClass_wrong( el );
			focus_element( $trans.find( el ) );

			r = false;
		}
		else
		{
			removeClass_wrong( el );
		}
	}

	function addClass_wrong ( element ) {
		element.addClass( 'wrong' );
	}
	function removeClass_wrong ( element ) {
		element.removeClass( 'wrong' );
	}
	function focus_element ( element ) {
		if( focused == false )
		{
			element.focus();
			focused = true;
		}
	}

	return r;
}

// getData
function getData( field ) {

	// ended here
	if(!field)
	{
		return false;
	}

	var json = [];
	var el = '#input-of-'+ field +' .field input.text';
	var count = $(el).length;

	for(var i=0;i<count;i++)
	{
		var val = document.querySelectorAll( el )[i].value;
		json.push( val );
	}

	return json;
}

// check word in dictionary
function chkWord( This ) {
	
	var text = This.value.toLowerCase();
	
	$.ajax({
        type: 'POST',
        url: 'api.php?access=check_word&text='+text,
        data: {  },
        beforeSend: function() {
            
        },
        success: function( res ) {
			var data = JSON.parse(res);
			
			if( data.count_word == 0 )
			{
				$('#input-of-word').find('.display-msg-wrong').hide();
				$('#input-of-word').find('input.text').removeClass('wrong');
			}
			else
			{
				$('#input-of-word').find('.display-msg-wrong').html("this word has been saved in your dictionary.").show();
				$('#input-of-word').find('input.text').addClass('wrong');
			}
        }
    });
}

// save word to database
function saveWord ( word, translate, sentence ) {

    var data = {
        word: word,
        translate: translate,
        sentence: sentence
    };

    $.ajax({
        type: 'POST',
        url: 'api.php?access=save_word&data=' + JSON.stringify(data),
        success: function( response ) {
	
            if( JSON.parse( response ).status_id == 0 )
            {
                console.log( 'save word fialed' );
            } 
            else
            {
                // save success
                clickClose_Page( '#add-page' );
                $( '#add-page .wrapper .main' ).load( "html/form_saveword.html" );
            }
        }
    });
}

// edit word
function editWord ( word_id, word, translate, sentence ) {

    var data = {
		word_id: word_id,
        word: word,
        translate: translate,
        sentence: sentence
    };
	
    $.ajax({
        type: 'POST',
        url: 'api.php?access=edit_word&data=' + JSON.stringify(data),
        success: function( response ) {
			// refresh
			get_Dict( user_info.data.user_id );
            get_newWord( user_info.data.user_id );
			
			// close popup
			close_editWord();
        }
    });
}

// get dictionary data
function get_Dict( user_id ) {
    if( ! user_id )
    {

    }
    else
    {
        $.ajax({
            type: 'POST',
            url: 'api.php?access=my_dict&user_id=' + user_id,
            data: {  },
            beforeSend: function() {
                
            },
            success: function( response ) {
                var json = JSON.parse( response );

                if( ! json.data )
                {
                    
                }
                else
                {
                    // clear
                    $("#mydict, #mydict-result-home").html("");

                    var temp = 1;

                    // loop count word
                    for( var i=0; i < json.data.length; i++ )
                    {
                        var data = json.data[i];

                        var r = number_char( data ) - temp;
                        
                        if( r == 0 )
                        {
                            print_char( temp );
                            print_word( data );
                            temp++;
                        }
                        else if ( number_char( data ) > temp )
                        {
                            for( var j=0; j <= r ; j++ )
                            {
                                if( j == r )
                                {
                                    print_char( temp );
                                    print_word( data );
                                }
                                else
                                {
                                   print_char( temp ); 
                                }
                                temp++;
                            }
                        }
                        else if( number_char( data ) < temp )
                        {
                            print_word( data );
                        }

                    }

                    if( temp <= 26 ) {

                        var count = 26 - temp;

                        for( var k=0; k <= count; k++ )
                        {
                            print_char( temp );
                            temp++;
                        }
                    }

                    $("#mydict-nav .count").text(i);
                }
            }
        });
    }
	
    // lib function
    function print_word ( json_data ) {
		
		var json_string = JSON.stringify(json_data);
			json_string = replace_singleCode( json_string );
		
        var html = "";
            html += '<li class="word-info" data-json=\''+ json_string +'\' onClick="popup_wordInfo(this);">';
            html +=     '<span class="word">'+ json_data.word +'</span>';
            html +=     '<span class="tran">'+ json_data.translate[0] +'</span>';
            html += '</li>';
        $("#mydict, #mydict-result-home").append( html );
    }

    function print_char ( number ) {
        var characters = new Array();
            characters[0] = 'a';
            characters[1] = 'b';
            characters[2] = 'c';
            characters[3] = 'd';
            characters[4] = 'e';
            characters[5] = 'f';
            characters[6] = 'g';
            characters[7] = 'h';
            characters[8] = 'i';
            characters[9] = 'j';
            characters[10] = 'k';
            characters[11] = 'l';
            characters[12] = 'm';
            characters[13] = 'n';
            characters[14] = 'o';
            characters[15] = 'p';
            characters[16] = 'q';
            characters[17] = 'r';
            characters[18] = 's';
            characters[19] = 't';
            characters[20] = 'u';
            characters[21] = 'v';
            characters[22] = 'w';
            characters[23] = 'x';
            characters[24] = 'y';
            characters[25] = 'z';

        var char_ = characters[ number - 1 ];
        var html = '<li class="char" id="charAt-'+ char_.toLowerCase() +'">'+ char_.toUpperCase() +'</li>';
        $("#mydict, #mydict-result-home").append( html );
    }

    function number_char ( json_data ) {
        
        var word = json_data.word.toLowerCase();
        var number;
        var patt = new RegExp("^[a-zA-Z]+$");
        var isEng = patt.test(word);

        if( !isEng )
        {
            return false;
        }

        var characters = new Array();
            characters[0] = 'a';
            characters[1] = 'b';
            characters[2] = 'c';
            characters[3] = 'd';
            characters[4] = 'e';
            characters[5] = 'f';
            characters[6] = 'g';
            characters[7] = 'h';
            characters[8] = 'i';
            characters[9] = 'j';
            characters[10] = 'k';
            characters[11] = 'l';
            characters[12] = 'm';
            characters[13] = 'n';
            characters[14] = 'o';
            characters[15] = 'p';
            characters[16] = 'q';
            characters[17] = 'r';
            characters[18] = 's';
            characters[19] = 't';
            characters[20] = 'u';
            characters[21] = 'v';
            characters[22] = 'w';
            characters[23] = 'x';
            characters[24] = 'y';
            characters[25] = 'z';

        for( var i=0; i < 26; i++ )
        {
            if( word.charAt(0) == characters[i] ) {
                number = i+1;
            }
        }

        return number;
    }
}

// get new word of to day
function get_newWord( user_id ) {

    if( ! user_id )
    {

    }
    else
    {
        $.ajax({
            type: 'POST',
            url: 'api.php?access=new_word&user_id=' + user_id,
            data: {  },
            beforeSend: function() {
                
            },
            success: function( response ) {
                var json = JSON.parse( response );

                if( ! json.data )
                {
                    
                }
                else
                {
                    // clear
                    $("#new_word ul").html("");

                    for( i = 0; i < json.data.length; i++ )
                    {
                        var data = json.data[i];

                        var html = '<li>- '+ data.word +' '+ data.translate[0] +'</li>';

                        $("#new_word ul").append(html);

                    }

                    $("#new_word strong.topic .count").text(i);
                }
            }
        });
    }
}

// search word
function search ( t, page ) {

    // page: home, mydict

    // element of search
    var element;
    var $icon_search;

    // check
    if(page == 'home')
    {
        element = '#mydict-result-home li.word-info';
        $icon_search = $('.search i');
    }
    else if(page == 'mydict')
    {
        element = '#mydict li.word-info';
        $icon_search = $('.search i');
    }

    // text
    var text_search = t.value.trim();
    var count_of_el = $(element).length;

    $icon_search.addClass('active');

    // for page home
    if( text_search.length == 0 && page == 'home' )
    {
        $('.nav').fadeIn();
        $('#mydict-result-home').hide();
    }
    else if ( text_search.length > 0 && page == 'home' )
    {
        $('.nav').hide();
        $('#mydict-result-home').show();
    }

    $("li.char").hide();

    if( text_search.length == 0 )
    {
        $("li.char").show();

        $icon_search.removeClass('active');
    }

    var result = false;

    for( var i=0; i < count_of_el; i++ )
    {
        var text_word = document.querySelectorAll( element )[i];

        if( text_search == $( text_word ).find('.word').text().substring(0,text_search.length) )
        {
            text_word.style.display = 'block';
            result = true;
        }
        else
        {
            text_word.style.display = 'none';
        }
    }

    // not found
    if( ! result )
    {
        //console.log( 'Not found' );
    }
    else
    {
        //console.log('found');
    }
	
	reset_storage_scroll_dict();
}

// close search
function close_search( page ) {

    if( page == 'home' )
    {
        $('.nav').fadeIn();
        $('#mydict-result-home').hide();
        $('#search-word-home').val("");
    } 
    else if ( page == 'dict' )
    {
        $('li.word-info').show();
        $("#search-word-mydict").val("");
    }

    $('.search i').removeClass('active');
    $("li.char").show();

}

// popup word info
function popup_wordInfo( event ) {
	
	var element_att = $(event)[0];
	var left = element_att.offsetLeft + element_att.offsetWidth + 20;
	var top = element_att.offsetTop - storage_scroll_dict.scrollTop;

    $('.popup-word-detail, .popup_').remove();

    setTimeout(function(){
        $('.popup-word-detail').show();
        $(event).addClass("active");
    },10);

    $('#mydict li, #mydict-result-home li').removeClass("active");

    var el = $(event);
    var json = JSON.parse(el.attr("data-json"));

    var html = '';
        html += '<div class="popup-word-detail" id="popup-word-detail" style="left:'+left+'px;top:'+top+'px;">';
        html +=     '<i class="point sprites"></i>';
		html += '<div class="option"><i class="sprites icon-opt" onClick="click_optionWord( this );"></i><ul class="menu"><li data-json=\''+replace_singleCode(JSON.stringify(json))+'\' onClick="selected_optWord(this, \'edit\');">Edit</li><li data-json=\''+replace_singleCode(JSON.stringify(json))+'\' onClick="selected_optWord(this, \'delete\');">Delete</li></ul></div>';
        html +=     '<div class="wp-outer add-page">';
        html +=         '<div class="header">';
        html +=             '<span>'+ json.word +'</span>';
        //html +=             ' - ';
        //html +=             '<span>'+ json.type +'</span>';
		html += 			  '<i class="listen sprites" onClick="listen( \''+ json.word +'\' );"></i>';
        html +=         '</div>';
        html +=         '<ul class="translate">';
        for(var i=0;i<json.translate.length;i++) {
        html +=             '<li>- '+ json.translate[i] +'</li>';
        }
        html +=         '</ul>';
        html +=         '<ul class="sentence">';
        for(var i=0;i<json.sentence.length;i++) {
        html +=             '<li>- '+ json.sentence[i] +'</li>';
        }
        html +=         '</ul>';
        html +=     '</div>';
        html += '</div>';
		
	$("body").append( html );
    //$("body").append('<div id="popup_" class="popup_" style="width= 100%; width: 100%; height: 100%; position: fixed;background: none; top: 0; left: 0;z-index: 1000;cursor: pointer;"></div>');
}

function listen( text ) {
	var recognition = new webkitSpeechRecognition();
	var u = new SpeechSynthesisUtterance();
	u.text = text;
	u.lang = 'en-US';
	u.rate = 1.2;
	u.volume = 1;
	u.onend = function(event) {
	
	}
	speechSynthesis.speak( u );
}

function pageLoading( status ) {
    if( !status )
    {
        $('#loading-display').fadeOut();
    }
    else
    {
        $('#loading-display').fadeIn();
    }
}

function set_Chart( data ) {

    var options = {
      //curveType: 'function',
      colors:['#FBB03B'],
      vAxis: {title:'words', format:'0', viewWindow:{ min: 0 }},
      'width': 995,
      'height': 412,
	  legend: 'none',
	  tooltip: {isHtml: true}
    };

    var chart = new google.visualization.LineChart(document.getElementById('dicplay-chart'));
    chart.draw(data, options);
}

// onclick option word
function click_optionWord ( This ) {
	
	$menu = $("#popup-word-detail .option .menu");
	
	if( $menu.css("display") == "none" )
	{
		$menu.css("display","block");
		$(This).addClass("active");			
	}
	else
	{
		$menu.css("display","none");
		$(This).removeClass("active");
	}
	
}

// selected option
function selected_optWord ( This, action ) {

	switch(action) {
		case 'edit':
			
			// load template
			$( '#popup-word-detail .wp-outer' ).load( "html/form_editword.html?v=1",function(){

				// get json data
				var data = $(This).attr("data-json");
					data = JSON.parse(data);
					
				// set id on function
				$(".edit-word .cancel").attr("onclick","close_editWord()");
				$(".edit-word .save").attr("onclick","click_editWord('"+ data.word_id +"')");
								
				$("#input-of-word input.text").val( data.word );
				
				for( var i=0, count = $( '.form .field .list' ).length; i<data.translate.length; i++ ) {
					if( i==0 ){
						$("#input-of-translate input.text:first-child").val( data.translate[i] );
					} else {
						var html = '<div class="list" id="input-ref_'+ (count+1) +'" style="top: 0px; opacity: 1;"><input type="text" class="text" value="'+ data.translate[i] +'"><i class="delete" onclick="click_remove_input(  \'#input-ref_'+ (count+1) +'\' );">x</i></div>';
						$("#input-of-translate .field").append(html);
					}
				}
				for( var i=0, count = $( '.form .field .list' ).length; i<data.sentence.length; i++ ) {
					if( i==0 ){
						$("#input-of-sentence input.text:first-child").val( data.sentence[i] );
					} else {
						var html = '<div class="list" id="input-ref_'+ (count+1) +'" style="top: 0px; opacity: 1;"><input type="text" class="text" value="'+ data.sentence[i] +'"><i class="delete" onclick="click_remove_input(  \'#input-ref_'+ (count+1) +'\' );">x</i></div>';
						$("#input-of-sentence .field").append(html);
					}
				}
			});
		break;
		case 'delete':

            var data = $(This).attr("data-json"),
                data = JSON.parse(data),
                word_id = data.word_id;
			
			var r = confirm("are you sure to delete this word ?");

            if(!r)
            {
                // cliked cancel
            }
            else
            {
                $.ajax({
                    url: 'api.php?access=delete_word&word_id=' + word_id,
                    success: function( res ) {
                        if(res = "true")
                        {
                            // refresh
                            get_Dict( user_info.data.user_id );
                            get_newWord( user_info.data.user_id );

                            // close popup
                            close_editWord();
                        }
                    }
                });
            }
						
		break;
	}

	$menu = $("#popup-word-detail .option .menu");
	$menu.css("display","none");
}

function play_game( game, event ) {

    var $menu = $('#game-page .wrapper .menu');
    var $howTo = $('#game-page .wrapper .how-to-play');
    var $btn_clickToPlay = $('#game-page .wrapper .how-to-play .btn-clickToPlay');

    switch(game) {
      case 'speaking':
        $btn_clickToPlay.attr('onclick','new GameSpeaking().load( user_info.data.user_id );');
        html_howto('Speaking English word to clearly');
      break;
      case 'listening':
		$btn_clickToPlay.attr('onclick','new GameListening().load( user_info.data.user_id );');
        html_howto('Listening English word and choose right answer.');
      break;
      case 'writing':
        $btn_clickToPlay.attr('onclick','load_game( user_info.data.user_id );');
        html_howto('Write characters into the boxs.');
      break;
      default:;
    }

    if(!game) {

    } else {

      $menu.hide();
      $howTo.fadeIn();

    }

    function html_howto( html ) {
      $('#game-page .wrapper .how-to-play .discript').html(html);
    }
}

// page chart
function click_view_chart( this_, access ) {
    var list = document.querySelectorAll("#select-view-chart li");
    var count = list.length;
    
    for(var i=0; i<count; i++) {
        document.querySelectorAll("#select-view-chart li")[i].className = "";
    }
    
    this_.setAttribute("class", "active");
    
    $.ajax({
        url: 'api_chart.php?access=' + access,
        dataType:"json",
        async: false,
        success: function( response ) {

            set_Chart( new google.visualization.DataTable( response ) );
        }
    });
}
function setDef_view_chart () {
    var el = document.querySelectorAll("#select-view-chart li")[0];
    click_view_chart(el, 'word_of_this_week');
}

// register
function checkInput_username ( username ) {

    clear_alert_wrong();

    $.ajax({
        type: 'POST',
        url: 'api.php?access=check_username',
        data: { username: username },
        beforeSend: function()
        {
            
        },
        success: function( res ) 
        {
            if( res == "true" )
            {
                return "true";
            }
            else if(res == "false")
            {
                // username has already been taken
                alert_wrong( $('#register .username'), "<u>"+ username +"</u> has already been taken" );
                return "false";
            }
        }
    });
}

function checkForm_register () {

   // clear ui alert
   clear_alert_wrong();

   var return_          = true;
   var username         = $("#register .username");
   var email            = $("#register .email"); 
   var password         = $("#register .password"); 
   var birthday         = $("#register .birthday");
   var birthday_day     = $("#register select[name='birthday_day']");
   var birthday_month   = $("#register select[name='birthday_month']");
   var birthday_year    = $("#register select[name='birthday_year']");
   var gender           = $("#register .gender"); 
   var gender_checked   = $("#register input[name='gender']:checked");
   var sumbit           = $('#register input.submit');

   if( username.val() == "" )
   {
     alert_wrong( username );
     return_ = false;
   }

   if( username.val() != "" && username.val().search(/^[a-zA-Z0-9]+$/) != 0 )
   {
     alert_wrong( username, 'only English' );
     return_ = false;
   }

   if( email.val() == "" || email.val().search(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/) != 0)
   {
     alert_wrong( email );
     return_ = false;
   }

   if( password.val() == "")
   {
     alert_wrong( password );
     return_ = false;
   }

   if( password.val() != "" && password.val().search(/^[A-Za-z0-9!@#$%^&*()_]{6,20}$/) != 0 )
   {
     alert_wrong( password, "enter your English password 6-20 characters" );
     return_ = false;
   }

   if( birthday_day.val() == "" )
   {
     alert_wrong( birthday_day );
     return_ = false;
   }

   if( birthday_month.val() == "" )
   {
     alert_wrong( birthday_month );
     return_ = false;
   }

   if( birthday_year.val() == "" )
   {
     alert_wrong( birthday_year );
     return_ = false;
   }

   if( birthday_day.val() == "" || birthday_month.val() == "" || birthday_year.val() == "" )
   {
     alert_wrong( birthday );
     return_ = false;
   }

   if( gender_checked.val() == undefined  )
   {
     alert_wrong( gender );
     return_ = false;
   }

   // return
   if( return_ == false ) {
     return false;
   }
   else
   {
    sumbit.val("Loading...");
    sumbit.attr('disabled','disabled');
    /*username.attr('disabled','disabled');
    email.attr('disabled','disabled');
    password.attr('disabled','disabled');
    birthday_day.attr('disabled','disabled');
    birthday_month.attr('disabled','disabled');
    birthday_year.attr('disabled','disabled');
    gender.find('input[type="radio"]').attr('disabled','disabled');*/
   }
   
}

// lib of form register
function alert_wrong ( element, msg ) {

 var offset;

 // add class
 $( element ).addClass('wrong');

 offset = {
     top: $( element ).offset().top,
    left: $( element ).offset().left + $( element ).width() + 25
 }

 if( element.selector == "#register .birthday" ) {
   offset.top = offset.top + 18;
   offset.left = offset.left - 8;
 }

 if( msg ) {
    html_msg( msg, offset );
 }
}

function html_msg( msg, offset ) {
 var html = '';
     html += '<div class="alertWrong_formRegister" style="top: '+offset.top+'px;left: '+offset.left+'px;">';
     html +=   '<i class="sprites"></i>';
     html +=   '<span>'+ msg +'</span>';
     html += '</div>';

 $('body').append(html);
 $('.alertWrong_formRegister:last-of-type').hide().fadeIn();
}

function clear_alert_wrong () {
 $('.alertWrong_formRegister').remove();
 $('#register input, #register select, #register .gender').removeClass('wrong');
}

// lib

function replace_singleCode( str ) {
	var r = str.indexOf("'");
	
	if( r >= 0 ) {
		str = str.replace(/'/g,"&#39");
	}
	
	return str;
}

function rand( min, max ) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rand_sort( min, max ) {
    var numbers = new Array();
    var data = new Array();
    var count = (max - min) + 1;

    for(var i=0; i < count; i++)
    {
        numbers.push( min + i );
    }

    var i = 0;
    while(i < count)
    {
        var rand_ = rand( min, max );

        if( data.indexOf( rand_ ) >= 0 )
        {}
        else
        {
            data.push( rand_ );
            i++;
        }
    }

    return data;
}

function rand_unsort ( min, max, count ) {
  var numbers = new Array();
  var status = true;
  var n;
  
  while( status ){
	  
	n = rand( min, max );
	
	if( jQuery.inArray( n, numbers ) == -1 )
	{
	  numbers.push( n );		
	}
	
	// end this line
	if( numbers.length == count ) status = false;
	
  } // end while
  
  return numbers;
}

function json_rand_sort( json ) {
    var new_data = [];
    var res_sort = rand_sort( 0, json.length - 1 );
    var count = json.length;

    for(var i=0; i < count; i++)
    {
        new_data.push( json[ res_sort[i] ] );
    }
    return new_data;
}

// close popup
$(document).ready(function(){
    
    $( document ).click(function( e ){
		
		function closePopup( element, callback ) {
			
			var el = $( element );
			var r = $(e.target).parents('#popup-word-detail').length;
			
			if( !r ) {
				
				el.hide();
				
				if(callback != undefined) {
					callback();
				}
			}	
		}
		
		// close popup image -----------------------------------------	
		closePopup( '#popup-word-detail', function(){
            $('.word-info').removeClass("active");
		});
            
    });
});





