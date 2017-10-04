  /*
   *  Kidwadee API
   *  Coded apichai_kub@hotmail.com
   *  Version 0.1
   *  Descripting: erverting return json datatype 
   */
   
function Kwd() {
	this.api = function ( action, json, callback ) {
		
		var parameters,
			callbackVal,
			timer,
			delay = 1;
		
		switch( action ) {
			case 'post':
				
				parameters = JSON.stringify( json );
				
				$.ajax({
					type: 'POST',
				  	url: 'api.php?access=insert&type=post&json=' + parameters,
				  	data: {  },
				  	beforeSend: function() {
					  	
				  	},
				  	success: function( response ){
						callbackVal = response;
				  	}
				});
				
			break;
			case 'comment':
				// parameters: post_id, message
				
				if(
					json.post_id == undefined &&
					json.message == undefined
				)
				{
					callbackVal = '{"status_id": "0", "status_message": "check your parameter"}';	
				}
				else
				{
					parameters = "&post_id=" + json.post_id + "&message=" + json.message + "";
					
					$.ajax({
						type: 'POST',
						url: 'api.php?access=insert&type=comment' + parameters,
						data: {  },
						beforeSend: function() {
							
						},
						success: function( response ){
							callbackVal = response;
						}
					});
				}
			break;
			
			case 'like_post':
				
				// parameters: post_id
				
				if(json.post_id == undefined)
				{
					callbackVal = '{"status_id": "0", "status_message": "check your parameter"}';			
				}
				else
				{
					
					parameters = '&post_id=' + json.post_id;
					
					$.ajax({
						type: 'POST',
						url: 'api.php?access=insert&type=like_post' + parameters,
						data: {  },
						beforeSend: function() {
							
						},
						success: function( response ){
							callbackVal = response;
						}
					});	
				}
				
			break;
		} // end switch
		
		timer = setInterval(function(){
			if(callbackVal == null)
				delay += 1;
			else {
				callback( callbackVal );
				clearInterval(timer);
			}
		}, delay);
		
	}
}

var KWD = new Kwd();