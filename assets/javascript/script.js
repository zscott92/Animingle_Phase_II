function getMatch(faceResponse) {
  const emotions = faceResponse.faces[0].attributes.emotion;

  const transform = {
    anger: "yandere",
    neutral: "deredere",
    disgust: "tsundere",
    sadness: "kuudere",
    fear: "yandere",
    happiness: "moe",
    surprise: "tsundere"
  };

  let rand = Math.random() * 100;

  const emotion = (function getEmotion(emotions) {
    for (e in emotions) {
      rand -= emotions[e];
      if (rand <= 0) {
        return e;
      }
    }
  })(emotions);

  console.log(emotion);

  const key = transform[emotion];
  const queryString =
    "https://api.jikan.moe/v3/search/character/?" + $.param({ q: key });

  console.log(queryString);

  return $.get(queryString)
    .then(function(results) {
      const resultCount = results.results.length;

      let sample = getRandom(
        filterRepeats(results.results),
        resultCount > 9 ? 10 : resultCount
      );
      console.log(sample);

      if (!sample) {
        // If we have exhausted the results of this query, make a new one
        return getMatch(faceResponse);
      }

      return Promise.all(
        sample.map(async (item, index) => {
          // Will return an array of ajax promises
          console.log(item, index);
          await new Promise(resolve => setTimeout(resolve, 550 * index));
          console.log(`sending ${item} ${index}`);
          return $.get(`https://api.jikan.moe/v3/character/${item.mal_id}`);
        })
      );
    })
    .then(
      // return of function will be promise-ified
      function(results) {
        // parse and filter results
        console.log("debug");
        console.log(results);
        results = results.map(result => {
          console.log(result);
          const obj = parseAbout(result.about);
          obj.name = result.name;
          obj.featured = result.animeography;
          obj.image_url = result.image_url;
          return obj;
        });
        console.log(results);
        results = profileFilters.reduce(
          (a, filter) => a.filter(filter),
          results
        );
        return results.map(p => new Profile(p));
      }
    );
}

// TODO find and fix the regex that is taking approximately until the end of time to calculate.
// parse the 'about' string  we get from our ajax requests
function parseAbout(about) {
  // VNDB formatted bio
  // console.log(about);
  // console.log([...about].map(x => x.charCodeAt(0)));
  let match = about.match(
    /^(?<stats>(?:[a-zA-z0-9- ]+:.+\r?\n?)+)(?<about>(?:.+\r?\n?)+)?/i
  );
  console.log(match);
  if (match) {
    const output = {};
    const stats = match.groups.stats;
    output.stats = {
      hair: stats.match(/Hair:\s?(.*[a-zA-z]*?)/),
      eyes: stats.match(/Eyes:\s?(.*[a-zA-z]*?)/),
      clothes: stats.match(/Clothes:\s?(.*[a-zA-z]*?)/),
      personality: stats.match(/Personality:\s?(.*[a-zA-z]*?)/),
      role: stats.match(/Role:\s?(.*[a-zA-z]*?)/),
      height: stats.match(/Height:\s?(.*[a-zA-z]*?)/),
      measurements: stats.match(
        /(?:Bust-Waist-Hips|B-W-H|Three sizes):\s?(.*[a-zA-z]*?)/
      ),
      age: stats.match(/Age:\s?(.*\w*?)/),
      birthday: stats.match(/Birthday:\s?(.*[a-zA-z]*?)/),
      subjectOf: stats.match(/Subject of:\s?(.*[a-zA-z]*?)/)
    };
    Object.keys(output.stats).forEach(
      k => (output.stats[k] = output.stats[k] && output.stats[k][1])
    );

    output.about =
      match.groups.about &&
      match.groups.about.replace(/\(Source:.+\).*|No voice.*/i, "");
    output.raw = about;
    output.source =
      match.groups.about &&
      match.groups.about.match(/\(Source:.+\).*|No voice.*/i);
    output.source = output.source && output.source[0];

    return output;
  }
  // other bios
  console.log(about);
  match = about.match(
    /(?<about>(?:.+\r?\n?)+?)(?<source>(?:\(Source:.+\).*|No voice.*))?/
  );
  console.log(match);
  if (match) {
    output = {
      about: match.groups.about,
      source: match.groups.source,
      raw: about
    };

    const age = match.groups.about.match(/(\d) year old/i);
    if (age) {
      output.stats = { age: age[1] };
    }
    output.about =
      output.about && output.about.replace(/\(Source:.+\).*|No voice.*/i, "");

    return output;
  }
}

// https://stackoverflow.com/questions/19269545/how-to-get-n-no-elements-randomly-from-an-array
function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len) return false;
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

// function filterRepeats(arr) {
//     return arr.filter(character => {
//         loadedProfiles.forEach(profile => {
//             const profName = profile.name.replace(',', '').split(' ');
//             const charName = character.name.replace(',', '').split(' ');
//             console.log(profName, charName);
//             if ((profName[0] == charName[0] && profName[1] == charName[1]) ||
//                 (profName[0] == charName[1] && profName[1] == charName[0])) {
//                 return false;
//             }
//         });
//         return true;
//     })
// }

function filterRepeats(arr) {
  return arr.filter(character => {
    if (loadedNames.has(character.name)) {
      return false;
    } else {
      loadedNames.add(character.name);
      return true;
    }
  });
}

let loadedProfiles = new Set([]);
let loadedNames = new Set([]);
let loading = false;
let faceData;

function loadMore() {
  drawLoadScreen();
  getMatch(faceData).then(function(results) {
    $("#loading-card").remove();
    results.forEach(result => loadedProfiles.add(result));
    $("#profile-space").append(
      ...results.map(profile => {
        return profile.buildNode();
      })
    );
    loading = false;
  });
}

function drawLoadScreen() {
  if (!loading) {
    loading = true;
    $("#profile-space").append(
      $("<div>")
        .addClass("profile splash")
        .attr("id", "loading-card")
        .append(
          $(
            '<progress class="progress is-small is-primary loading-bar" max="100">'
          )
        )
    );
  }
}

// // for debugging
// getMatch(faceData).then(
//     function (results) {
//         console.log(results);
//         results.forEach(result => loadedProfiles.add(result));
//         $('#profile-space').append(
//             ...results.map(profile => {
//                 return profile.buildNode()
//             })
//         );
//     }
// )

// loadMore();

function requestFaceData(selectImgFile) {
  let data = new FormData();
  data.append("api_key", "ck3PwAKq4ZDsnbx77dyZG3lEk_YDwCIz");
  data.append("api_secret", "Epcw27lJerS2w28JQvd2DYhG_Rs-LjFJ");
  //data.append("image_url", "https://cdn.cnn.com/cnnnext/dam/assets/190802164147-03-trump-rally-0801-large-tease.jpg");
  data.append("image_file", selectImgFile);
  data.append(
    "return_attributes",
    "gender,age,smiling,headpose,emotion,ethnicity,mouthstatus,eyegaze"
  );

  console.log(data);
  return $.ajax({
    url: "https://api-us.faceplusplus.com/facepp/v3/detect",
    method: "POST",
    contentType: false,
    mimeType: "multipart/form-data",
    processData: false,
    data: data
  });
}

let currentPage = 0;
function setupProfileSpace() {
  $("#display-area")
    .empty()
    .append(
      $("<div>")
        .addClass("content")
        .attr("id", "profile-space")
    );

  $("#profile-space").on("scroll", function(event) {
    let page = $("#profile-space").scrollLeft() / window.innerWidth;
    if (Math.abs(page - currentPage) > 1) {
      page = Math.floor(page) + (currentPage - page > 1 ? 1 : 0);
      $("#profile-space").css({ overflow: "hidden" });
      setTimeout(function() {
        $("#profile-space").css({ overflow: "" });
      }, 10);

      $("#profile-space").scrollLeft(page * window.innerWidth);
      console.log("scrolling locked to page " + page);
    }

    if (!(page % 1) && page != currentPage) {
      // we have scrolled to a new page
      console.log(page);
      console.log(currentPage);
      $(`#profile-space .profile:nth-child(${currentPage + 1})`).scrollTop(0);
      currentPage = page;
    }

    if (page == loadedProfiles.size - 1 && !loading) {
      // We have just scrolled to the last page
      loadMore();
    }
  });
}

$("#splash-button").on("click", function() {
  $("input[type=file]").trigger("click");
});


$("input[type=file]").change(function(e) {
  // const vals = $(this).val();
  // val = vals.length ? vals.split('\\').pop() : '';
  // const fr = new FileReader();
  // const bin = fr.readAsBinaryString(val);
  setupProfileSpace();
  drawLoadScreen();
  requestFaceData(e.target.files[0]).then(function(results) {
    faceData = JSON.parse(results);
    loadMore();
  });
});
