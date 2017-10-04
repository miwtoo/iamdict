/*
	Library function javascript
	Author apichai_kub@hotmail.com
	version 0.1
*/

/* ============ function event other ============ */
// popup click to signin
function popup(element) {
	if($(element).css('display') == 'none') 
		$(element).show();
	else 
		$(element).hide();
}

/* ============ function set layout content ============ */
function set_widthWrapper() {
	var wBody  = document.querySelector('body').offsetWidth,
		wNav   = document.querySelector('nav').offsetWidth,
		result = (wBody - wNav) - 20;
		document.querySelector('#wrapper').style.width = result + "px";
}

function set_dottedTimeline() {
	var wNav   = document.querySelector('nav').offsetWidth,
		hNav   = document.querySelector('nav').offsetHeight,
		result =  wNav / 2;
		
		document.querySelector('#dotted-timeline').style.left = result + "px";
		document.querySelector('#dotted-timeline').style.height = hNav + "px";
}

function setLayout() {
	$('#content').masonry({
		itemSelector: '.post',
		/*columnWidth: function( containerWidth ) {
			var wBody = document.querySelector('body').offsetWidth,
				numbercolumn;
			if(wBody >= 1800)
				numbercolumn = 5;
			else if(wBody >= 1500)
				numbercolumn = 4;
			else numbercolumn = 3; 
			return containerWidth / numbercolumn;
		}*/
	});	
}

function refresh_Layout() {
  var $contents = $('#content').masonry({
		itemSelector: '.post',
  });
  
  
  setTimeout(function(){
  	$contents.masonry('reload');
  },500);	
  setTimeout(function(){
  	$contents.masonry('reload');
  },1000);	
}

// # click view image show popup # // 
function popupImage( e, post_id) {
  // show popup
  $( '#popup-image' ).show();
  $( 'body' ).css({ overflow: 'hidden' });
  
  getPostsData( post_id );
  
  function getPostsData( post_id ) {
	  clear_template();
	  
	  $("#popup-image .comment-post").attr("onKeyUp","commPost(this, event, '"+ post_id +"')");
	  $("#popup-image .like").attr("onClick","like( this, '"+ post_id +"', false )");
	  
	  $.ajax({
		type: "POST",
		url: "api.php?access=get&type=posts_data&post_id=" + post_id,
		beforeSend: function() {
			getComment( post_id );
		},
		success: function(res) {
			
			var html_media = "",
				res = JSON.parse(res);
						
			$( '#popup-image img.photo' ).attr("src", "images/common/photos/user_1.jpg");
			$( '#popup-image .user-name' ).text(res.author_name);
			$( '#popup-image .about-user a' ).attr("href","profile.php?uid=" + res.author_id);
			$( '#popup-image .created' ).text(humaneDate(timestamp(res.created)));
			$( '#popup-image .like_count' ).text(res.likes_count);
			
			if(res.data) {
				$.each(res.data, function(index, data) {
					
					var id = "#list-media-"+ data.media_type +"-template";
					var template = Handlebars.compile( $( id ).html() );
					var source;
					
					if(data.media_type == "video") {
						source = data.source.split("?v=");
						source = source[1];	
					} else {
						source = data.source;	
					}
					
					context_list_media = {
							source: source,
							title: data.title,
							description: data.description
					}
					
					html_media += template(context_list_media);
				
				});
				$("#popup-image .media").html(html_media);
			}
	
		} // end success
	  });
  }
  
  // get comment
  function getComment( post_id ) {
	  clear_template();
	   
	  $.ajax({
		type: "POST",
		url: "api.php?access=get&type=comment&post_id=" + post_id,
		beforeSend: function() {
			
		},
		success: function(res) {
			
			res = JSON.parse(res);
			
			if(res.data) {
				
				var template = Handlebars.compile($("#list-comments-template").html());
			
				$.each(res.data, function(index, data) {
					
					console.log(data)
					
					context_list_comment = {
						user_id: data.author_id,
						photo : "images/common/photos/user_1.jpg",
						name : data.author_name,
						message : data.message,
						created : humaneDate(timestamp(data.created)),
					}
					
					$( '#popup-image .users-comments' ).append(template(context_list_comment));
				
				});
			
			}
	
		} // end success
	  });
  }
  
  function clear_template() {
  	 $("#popup-image .media").html("");	
	 $( '#popup-image .users-comments' ).html(""); 
  }
  
}

// # loadmore post # // 
var chk_loading = new function Chk_loading(){
  this.loading = false;	 // is loading for chk
}
function loadmore() {
	
  var loadmore_storage = new function Loadmore_data() {
	this.start_cur = document.querySelectorAll('#content li.post').length; // count post current
	this.limit = 20; // limit default
  };
  
  var start_cur = loadmore_storage.start_cur;
  var limit = loadmore_storage.limit;
  
  //console.log('Start:' + start_cur + ' Limit:' + limit);
  
  if(chk_loading.loading == true) // if loading
  
    return false;
	
  else {
	  
	 $.ajax({
	  type: 'POST',
	  url: 'ajax/process.php?q=loadmore',
	  data: { start_cur:start_cur, limit:limit },
	  beforeSend: function() {
	    chk_loading.loading = true;
	  },
	  success: function(res) {
		
		// res = json strin
		
		var json = JSON.parse(res);
		if(json.length == undefined ) return false;
		
	    chk_loading.loading = false;
		loadmore_storage.start_cur = start_cur * 1 + limit;
	  
	    var source = $("#posts").html(),
		    template = Handlebars.compile(source),
		    context,
		    html;
	  
	    $.each(JSON.parse(res), function(index, data) {
	      
		  context = {
			  auto_id: data.auto_id,
			  facebook_id: data.user_fb_id,
			  type: data.type,
			  first_name: data.first_name,
			  last_name: data.last_name,
			  owner: data.owner,
			  source: data.source,
			  likes_count: data.likes_count,
			  created: data.created,
			  link: data.link,
			  page_story_id: data.page_story_id,
			  object_id: data.object_id
		  }
		
		  html = template(context);
		  
		  $('#content').append(html);
	
	    }); 
	  
	    setTimeout("refresh_Layout();",1000);
		setTimeout("refresh_Layout();",2000);
	  
	  } // end success
    }); // end ajax
  } // end if
}

// select type post
$(document).ready(function(){
	
	$('.uiTextareatPost .header ul.type li').click(function(){
		
		// chk cat
		var cat = $(this).attr('data-cat'); // categories
		
		if(cat == '3') {
			
			$('textarea#textarea-post').hide();
			$('#wrapper_editor').show();
				
		} else {
			
			if($( '#wrapper_editor textarea' ).val().trim().length > 0) {
				c = confirm("You are sure to change categories");
				if(!c) 
					return false;
				else {
					
					var editor = CKEDITOR.instances.editor;
					editor.setData("");
					
				}
			}	
			
			$('#wrapper_editor').hide();
			$('textarea#textarea-post').show();
			
		}
		
		// set ui selected icon
		$('.uiTextareatPost .header ul.type li').find('i.selected').css({ display: 'none' });
		$(this).find('i.selected').css({ display: 'block' });
		
		$('#btn-post').attr('data-cat', cat);
		
	});	
});


$(document).ready(function(){
	
	// click post
	$('#btn-post').click(function(){
		
		var text   = "";
		var source = $(this).attr("data-source");
		var cat   = $(this).attr("data-cat");
		var facebook_id = facebook.id;
		
		// if categoty is blog 
		if(cat == 3) {
			text = $( '#wrapper_editor textarea' ).val();	
		} else {
			text = $(this).attr("data-text");	
		}
		
		// chk
		if(text.trim().length == 0) { // check text
			if(cat == 3) {
				CKEDITOR.instances.editor.focus(); alert('please enter your content'); return false; 	
			} else {
				$("#textarea-post").focus(); alert('please enter your message'); return false; 	
			}
		} 
		if(source.trim().length == 0) { alert('please attach photo'); return false; } // check attach photo
		
		if(text.trim().length == 0 || source.trim().length == 0) {
				
		} else {
			
			$.ajax({
			  type: 'POST',
			  url: 'ajax/process.php?q=post',
			  data: { text:text, source:source, cat:cat, facebook_id:facebook_id },
			  beforeSend: function() {
				  
			  },
			  success: function(res){
				  
				var data = JSON.parse(res);
				  
			    var template = Handlebars.compile($("#posts").html()),
						context,
						html;
					
					context = {
					  //auto_id: ,
					  facebook_id: facebook_id,
					  type: 1,
					  owner: data.name,
					  source: source,
					  likes_count: 0,
					  created: 'สักครู่นี้',
					  //link: data.link,
					  //page_story_id: data.page_story_id,
					  //object_id: data.object_id
				    }
					
					html = template(context);
					
					if($('#content li.post').length == 0)
						$('#content').html(html);
					else {
						
						$('#content li.post:first-of-type').before(html);
						
						// clear
						$('.result-attach').hide();
						$('.uiTextareatPost .footer button.btn-post').attr('data-source', '');
						$('.uiTextareatPost .footer button.btn-post').attr('data-text', '');
						$('#textarea-post').val("");
					
						refresh_Layout();
						
						setTimeout("refresh_Layout();",1000);
					
					}
			  }
			});
			
		}
		
	});
	
	// type text message
	$('#textarea-post').keyup(function(){
		
		var text = $(this).val();
		
		$('.uiTextareatPost .footer button.btn-post').attr('data-text', text);
		
	});
	
	// remove file
	$('.result-attach span.remove').click(function(){
		
		var source = $(this).attr('data-source');
		
		$('.result-attach').hide();
		$('.uiTextareatPost .footer button.btn-post').attr('data-source', '');
		
		$.ajax({
		  type: 'POST',
		  url: 'ajax/process.php?q=remove_file',
		  data: { source:source }
		});
		
	});
});

// close popup
$(document).ready(function(){
	
	$( 'body' ).click(function(e){
		
		function closePopup( element, callback ) {
			var el = $( element );
			if(!$(e.target).not(el).length) {
				
				switch(element) {
					case '#popup-post' :
					
					break;
					default: el.hide();
							 $( 'body' ).css({ overflow: 'auto' });
				}
				
				if(callback != undefined) {
					callback();
				}
			}	
		}
		
		// close popup image -----------------------------------------	
		closePopup( '#popup-image' );
		
		// close create post -----------------------------------------	
		closePopup( '#popup-post', function(){
			
			function hide() {
				$("#popup-post").hide().html("");	
				$( 'body' ).css({ overflow: 'auto' });
			}
			
			var c;
			
			if( !dataPost() )
			{
				c = confirm("Are you sure to cancel this post");
				if(!c)
				{}
				else
				{
					hide();
				}
			}
			else
			{
				hide();
			}
		});	
	
	});
});

// share post
function share ( link ) {
  /*FB.ui({
    method: 'stream.share',
    u: link
  });*/
}

// like post
function like ( e, post_id, status_liked ) {
	
	var $like_count = $(e).find('.like_count');
	
	KWD.api('like_post', {post_id: post_id}, function( response ){
		
		response = JSON.parse( response );
		
		console.log( response.status_message );
		
		if(response.status_message == "liked")
		{
			$like_count.text( $like_count.text() * 1 + 1 );
		}
		else
		{
			$like_count.text( $like_count.text() * 1 - 1 );	
		}
		
	});
}

// comment post
function commPost(this_, event, post_id) {
	
	var template = Handlebars.compile($("#list-comments-template").html()),
		context,
		html,
		$el = '#post_' + post_id + ' ul.users-comments, #popup-image ul.users-comments',
		$el = $($el);
	 
	event = event || window.event || {};
	
	var msg = $(this_).val(),
		charCode = event.charCode || event.keyCode || event.which;
	
	// user enter
	if(charCode == 13) {
	  if(msg.trim().length == 0)
		return false;
	  else {
		  
		KWD.api('comment', {post_id: post_id, message: msg}, function( response ){
			response = JSON.parse(response);
			if(response.data)
			{
			  context = {
					photo: "images/common/photos/user_1.jpg",
					name: "Firstname Lastname",
					message: msg,
					created: "เมื่อสักครู่นี้", 
					likes_count: 0,
			  }
			  
			  html = template(context);
			  
			  $el.prepend(html);
			  
			  refresh_Layout();
			  
			  $(this_).val("").css("height", "16px");
			}
		});
		  
	  }
	}

	refresh_Layout();
}

function setTextAreaAutoSize() {
	$('#content li.post textarea, .comment-post').autosize();	
}

/* ====================================================== Start function ====================================================== */

$(window).load(function(){
	//set_widthWrapper();
	//set_dottedTimeline();
	setLayout(); // setLayout Content
	setTextAreaAutoSize();
});

setInterval(function(){
	//$("#content").masonry('reload');
},2000);