// set style silder
function set_silder( element ) { 

	// insert menu html html
	insert_menu();	

	// loop list li
	var element_str = element.selector + ' li';
	var count = element.find('li').length;

	// add class
	for( var i=0; i<count; i++ ) {
		
		var attr = document.querySelectorAll( element_str )[i].getAttribute('data-name');

		if( attr != null)
		{
			document.querySelectorAll( element_str )[i].setAttribute("class", "silder");
		}
	}

	var element_str = element.selector + ' li.silder';
	var count = element.find('li.silder').length;

	for( var i=0; i<count; i++ ) {

		// set style element
		var slider_height = get_bodyHeight() + get_bodyMargin(),
			ref = i;
		  	
		  	// set style silder
			set_style_silder( ref, element_str, slider_height );

		// insert list menu html
		var name = $( document.querySelectorAll( element_str )[i] ).attr('data-name'),
			number = i + 1;

		if( i == 0 )
		{
			insert_list_menu( name, number, true );
		}
		else
		{
			insert_list_menu( name, number, false );
		}
	}

	// set css postion menu right
	set_position_menu();			
}

// set style slider css
function set_style_silder ( ref, element, height ) {
	document.querySelectorAll( element )[ref].style.height = height + 'px';
	document.querySelectorAll( element )[ref].style.width = '100%';
	document.querySelectorAll( element )[ref].style.float = 'left';
}

// insert menu html
function insert_menu () {
	$('body').append('<ul class="jQ-slider-fullScreen-menuRight"></ul>');
}

// set position menu css
function set_position_menu () {
	$('.jQ-slider-fullScreen-menuRight').css({ top: ((get_bodyHeight() / 2) - (get_menuHeight() / 1.1)) + 'px' });	
}

// insert list menu html
function insert_list_menu ( name, number, active ) {
	if( active )
	{
		$('.jQ-slider-fullScreen-menuRight').append('<li class="active" data-number="'+ number +'" onclick="scroll_to( '+number +' )"><i class="silderChai-icon"></i> <span>'+ name +'</span></li>');
	}
	else
	{
		$('.jQ-slider-fullScreen-menuRight').append('<li data-number="'+ number +'" onclick="scroll_to( '+number +' )"><i class="silderChai-icon"></i> <span>'+ name +'</span></li>');
	}
}

// get body width
function get_bodyHeight () {
	
	$('body').append('<div id="test-body-height" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;"></div>');

	var height = $('#test-body-height').height();

	$('#test-body-height').remove();

	return height;
}

// get menu right height
function get_menuHeight() {
	return document.querySelector('.jQ-slider-fullScreen-menuRight').offsetHeight;
}

// get body width
function get_bodyMargin () {
	var body_margin = $('body').css('margin');
		body_margin = body_margin.split('px');

	return body_margin[0] * 2;
}

// scroll to silder
function scroll_to ( number_slider ) {
	var body_h = get_bodyHeight(),
		body_margin = get_bodyMargin();
	var result = (body_h+body_margin) * (number_slider - 1);

	$('body, html').animate({
		scrollTop: result,
	}, 800);

	set_ui();

	function set_ui() {
		var el = $('ul.jQ-slider-fullScreen-menuRight'),
			count = el.find('li').length;

		el.find('li').removeClass('active');

		for( var i = 0; i < count; i++ )
		{
			if( (number_slider-1) == i )
			{
				el.find('li:nth-child('+ number_slider +')').addClass('active');
			}
		}
	}
}

(function( $ ) {
	
	jQuery.fn.silderChai = function (options) {	
		set_silder( this );
	};

}( jQuery ));