function getMatch(faceResponse) {
    const emotions = faceResponse.faces[0].attributes.emotions;
    // "emotion": {
    //     "sadness": 0.378,
    //     "neutral": 75.48,
    //     "disgust": 0.004,
    //     "anger": 0.004,
    //     "surprise": 23.765,
    //     "fear": 0.004,
    //     "happiness": 0.363
    //   }


    const transform = {
        anger: "yandere",
        neutral: "deredere",
        disgust: "tsundere",
        sadnes: "kuudere",
        fear: "yandere",
        happiness: "moe",
        surprise: "tsundere",
    }

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

    const queryString = "https://api.jikan.moe/v3/search/character/?" + $.param({ q: key });

    console.log(queryString);

    return $.get(queryString).then(
        function (results) {
            const resultCount = results.results.length;
            let sample = getRandom(results.results, resultCount > 9 ? 10 : resultCount);

            Promise.all(
                sample.map(async (item, index) => { // Will return an array of ajax promises
                    await new Promise(resolve => setTimeout(resolve, 550 * index));
                    return $.get(`https://api.jikan.moe/v3/character/${item.mal_id}`);
                })
            ).then( // return of function will be promise-ified
                function (results) { //results is an array of objects that we get back from the character endpoint
                    results = results.map(result => parseAbout(result.about));
                    // Apply each filter to our results
                    results = profileFilters.reduce( (a, filter) => a.filter(filter), results);
                }
            )
        }
    )
}

// takes in the about object from the ajax request, outputs an object full of 
function parseAbout(about) {
    // VNDB formatted bio
    let match = about.match(/(?<stats>(?:.+:.+\n)+)(?<about>.+?)?\n?(?<source>(?:\(Source:.+\).*|No voice.*))?$/);
    if (match) {
        const stats = match.groups.stats;
        output.stats = {
            hair: stats.match(/Hair:\s?(.*[a-zA-z]*?)/),
            eyes: stats.match(/Eyes:\s?(.*[a-zA-z]*?)/),
            clothes: stats.match(/Clothes:\s?(.*[a-zA-z]*?)/),
            personality: stats.match(/Personality:\s?(.*[a-zA-z]*?)/),
            role: stats.match(/Role:\s?(.*[a-zA-z]*?)/),
            height: stats.match(/Height:\s?(.*[a-zA-z]*?)/),
            measurements: stats.match(/(?:Bust-Waist-Hips|B-W-H|Three sizes):\s?(.*[a-zA-z]*?)/),
            age: stats.match(/Age:\s?(.*[a-zA-z]*?)/),
            birdthday: stats.match(/Birthday:\s?(.*[a-zA-z]*?)/),
            subjectOf: stats.match(/Subject of:\s?(.*[a-zA-z]*?)/),
        }
        Object.keys(about).forEach(k => about[k] = about[k] && object[k][0]);
        output.about = match.groups.about;
        output.raw = about;
        output.source = match.groups.source;

        return output;
    }
    // other bios
    match = about.match(/(?<about>(?:.+\n?)+?)(?<source>(?:\(Source:.+\).*|No voice.*))?$/);
    if (match) {
        output = {
            about: match.groups.about,
            source: match.groups.source,
            raw: about,
        }

        return output;
    }
}

// https://stackoverflow.com/questions/19269545/how-to-get-n-no-elements-randomly-from-an-array
function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}


// for debugging
getMatch({
    faces: [
        {
            attributes: {
                "emotions": {
                    "sadness": 0.378,
                    "neutral": 75.48,
                    "disgust": 0.004,
                    "anger": 0.004,
                    "surprise": 23.765,
                    "fear": 0.004,
                    "happiness": 0.363
                }

            }
        }
    ]

}
).then(
    console.log
)