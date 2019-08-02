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

    const emotion = (function getEmotion (emotions) {
        for (emotion in emotions) {
            rand -= emotions[emotion];
            if (rand <= 0) {
                return emotion;
            }
        }
    }) (emotions);

    const key = transform[emotion];
    
    const queryString = "https://api.jikan.moe/v3/search/character/?" + $.params({q: key});

    $.get(queryString).then(
        function(results) {
            //TODO filter results
            console.log(results);
        }
    )

    // Return a promise
}

getMatch( {
    faces:  [
        {
            attributes: {
                "emotion": {
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
)