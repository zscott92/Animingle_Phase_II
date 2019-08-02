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
            //TODO filter results
            console.log(results);

            const resultCount = results.results.length;
            let sample = getRandom(results.results, resultCount > 9 ? 10 : resultCount);
            console.log(sample);



            return Promise.all(

                // sample.map((item, index) => {
                //     return new Promise(resolve => setTimeout(resolve, 550 * index)).then(
                //         () => $.get(`https://api.jikan.moe/v3/character/${item.mal_id}`)
                //     )
                // })

                sample.map(async (item, index) => {
                    await new Promise(resolve => setTimeout(resolve, 550 * index));
                    return $.get(`https://api.jikan.moe/v3/character/${item.mal_id}`);
                })

                // (function requestNext(iter, accumulator) {
                //     const next = iter.next();
                //     if (next) {
                //         return iter.map( (item, index) => {
                //             return new Promise(resolve =>  setTimeout( resolve , 550 * index)).then(
                //                 () => $.get(`https://api.jikan.moe/v3/character/${item.mal_id}`)
                //             )
                //         })

                //         // iter.map( async (item, index) => {
                //         //     await new Promise(resolve => setTimeout(resolve, 550 * index));
                //         //     return $.get(`https://api.jikan.moe/v3/character/${item.mal_id}`);
                //         // })

                //     } else {
                //         return accumulator;
                //     }
                // })(sample, [])

            );
        }
    )


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