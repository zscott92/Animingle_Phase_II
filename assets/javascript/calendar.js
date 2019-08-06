// var currentTime = new Date();
// today = currentTime.toISOString();

// var seventyTwoHours = new Date(currentTime.getTime() + 72 * 1000 * 60 * 60);
// seventyTwoHours = seventyTwoHours.toISOString();

// const clientId =
//   "797197574459-upvhnomrje24c4ehlttj2u3u8e9gbfpb.apps.googleusercontent.com";
// const apiKey = "AIzaSyCBcOGEbSoxbna7f9fWGKsQaz-D3vB3Oic";

// var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// const scope = "https://www.googleapis.com/auth/calendar.readonly";

// function handleClientLoad() {
//   gapi.client.setApiKey(apiKey);
//   window.setTimeout(checkAuth, 1);
// }

// function checkAuth() {
//   gapi.auth.authorize(
//     { client_id: clientId, scope: scope, immediate: true },
//     handleAuthResult
//   );
// }

// function handleAuthResult(authResult) {
//   var selectButton = document.getElementById("select-button");
//   var resultPanel = document.getElementById("result-panel");
//   var resultTitle = document.getElementById("result-title");

//   if (authResult && !authResult.error) {
//     selectButton.style.visibility = "hidden";
//     resultPanel.className = resultPanel.className.replace(
//       /(?:^|\s)panel-danger(?!\S)/g,
//       ""
//     );
//     resultPanel.className += "panel-success";
//     resultTitle.innerHTML = "Application Authorized";
//     makeApiCall();
//   } else {
//     selectButton.style.visibility = "visible";
//     resultPanel.className += " panel-danger";
//     selectButton.onclick = handleAuthClick;
//   }
// }

// function handleAuthClick(event) {
//   gapi.auth.authorize(
//     { apiKey: API_KEY, client_id: clientId, scope: scope, discoveryDocs: DISCOVERY_DOCS, immediate: false },
//     handleAuthResult
//   );
//   return false;
// }

// var resource = {
//   summary: "Sample Event " + Math.floor(Math.random() * 10 + 1),
//   start: {
//     dateTime: today
//   },
//   end: {
//     dateTime: seventyTwoHours
//   }
// };

// function makeApiCall() {
//   gapi.client.load("calendar", "v3", function() {
//     var request = gapi.client.calendar.events.insert({
//       calendarId: "gk0pudanag1bhu35vkv5dunja4@group.calendar.google.com",
//       resource: resource
//     });

//     // handle the response from our api call
//     request.execute(function(resp) {
//       if (resp.status == "confirmed") {
//         document.getElementById("event-response").innerHTML =
//           "Event created successfully. View it <a href='" +
//           resp.htmlLink +
//           "'>online here</a>.";
//       } else {
//         document.getElementById("event-response").innerHTML =
//           "There was a problem. Reload page and try again.";
//       }
//       console.log(resp);
//     });
//   });
// }
