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

            return Promise.all(
                sample.map(async (item, index) => { // Will return an array of ajax promises
                    console.log(item, index);
                    await new Promise(resolve => setTimeout(resolve, 550 * index));
                    console.log(`sending ${item} ${index}`);
                    return $.get(`https://api.jikan.moe/v3/character/${item.mal_id}`);
                }));
        }
    ).then( // return of function will be promise-ified
        function (results) { // parse and filter results
            console.log('debug');
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
            results = profileFilters.reduce((a, filter) => a.filter(filter), results);
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
    let match = about.match(/^(?<stats>(?:[a-zA-z0-9- ]+:.+\r?\n?)+)(?<about>(?:.+\r?\n?)+)?/i);
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
            measurements: stats.match(/(?:Bust-Waist-Hips|B-W-H|Three sizes):\s?(.*[a-zA-z]*?)/),
            age: stats.match(/Age:\s?(.*[a-zA-z]*?)/),
            birdthday: stats.match(/Birthday:\s?(.*[a-zA-z]*?)/),
            subjectOf: stats.match(/Subject of:\s?(.*[a-zA-z]*?)/),
        }
        Object.keys(about).forEach(k => about[k] = about[k] && about[k][0]);
        output.about = match.groups.about.replace(/\(Source:.+\).*|No voice.*/i, '');
        output.raw = about;
        output.source = match.groups.about.match(/\(Source:.+\).*|No voice.*/i)[0];

        return output;
    }
    // other bios
    console.log(about);
    match = about.match(/(?<about>(?:.+\r?\n?)+?)(?<source>(?:\(Source:.+\).*|No voice.*))?/);
    console.log(match);
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

}).then(
    function (results) {
        console.log(results);
    }
)