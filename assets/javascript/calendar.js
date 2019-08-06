    var currentTime = new Date();
    today = currentTime.toISOString();
	
    var twoHoursLater = new Date(currentTime.getTime() + (2*1000*60*60));
    twoHoursLater = twoHoursLater.toISOString();
	
    var clientId = '797197574459-upvhnomrje24c4ehlttj2u3u8e9gbfpb.apps.googleusercontent.com';
    var apiKey = 'AIzaSyBleGaJ6t6_SMoJvaavNGOgCRf4e6madDY';

    var scope = 'https://www.googleapis.com/auth/calendar';


			function handleClientLoad() {
            gapi.client.setApiKey(apiKey);
				window.setTimeout(checkAuth,1);
			}

			function checkAuth() {
				gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
			}

			function handleAuthResult(authResult) {
				var authorizeButton = document.getElementById('authorize-button');
                var resultPanel	= document.getElementById('result-panel');
                var resultTitle	= document.getElementById('result-title');
    	
				if (authResult && !authResult.error) {
                    authorizeButton.style.visibility = 'hidden';
					resultPanel.className = resultPanel.className.replace( /(?:^|\s)panel-danger(?!\S)/g , '' )
					resultPanel.className += ' panel-success';				
					resultTitle.innerHTML = 'Application Authorized'		
					makeApiCall();											
				} else {													
					authorizeButton.style.visibility = 'visible';
					resultPanel.className += ' panel-danger';				
					authorizeButton.onclick = handleAuthClick;				
				}
			}
			
			function handleAuthClick(event) {
				gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
				return false;
			}
			
			var resource = {
				"summary": "Sample Event " + Math.floor((Math.random() * 10) + 1),
				"start": {
					"dateTime": today
				},
				"end": {
					"dateTime": twoHoursLater
				}
			};
  
			function makeApiCall() {
				gapi.client.load('calendar', 'v3', function() {					
					var request = gapi.client.calendar.events.insert({
						'calendarId':'gk0pudanag1bhu35vkv5dunja4@group.calendar.google.com',	
						"resource":	resource							
					});
					
					// handle the response from our api call
					request.execute(function(resp) {
						if(resp.status=='confirmed') {
							document.getElementById('event-response').innerHTML = "Event created successfully. View it <a href='" + resp.htmlLink + "'>online here</a>.";
						} else {
							document.getElementById('event-response').innerHTML = "There was a problem. Reload page and try again.";
						}
						console.log(resp);
					});
				});
            }
            
		<script src="https://apis.google.com/js/client.js?onload=handleClientLoad"></script>
		