$(document).ready(function() {

function getFaceId(e, selectImgFile) {

e.preventDefault();
    let data = new FormData();
    data.append("api_key", "ck3PwAKq4ZDsnbx77dyZG3lEk_YDwCIz");
    data.append("api_secret", "Epcw27lJerS2w28JQvd2DYhG_Rs-LjFJ");
    //data.append("image_url", "https://cdn.cnn.com/cnnnext/dam/assets/190802164147-03-trump-rally-0801-large-tease.jpg");
    data.append("image_file", selectImgFile);
    data.append("return_attributes", "gender,age,smiling,headpose,emotion,ethnicity,mouthstatus,eyegaze");

console.log(data);
    $.ajax({
        url: "https://api-us.faceplusplus.com/facepp/v3/detect",
        method: "POST",
        contentType: false,
        mimeType: "multipart/form-data",
        processData: false,
        data: data
    }).then(function (response) {
        //console.log(response);

        return(response);

    });
       
}

//Main Section
    
$("#submitbtn").on("click", getFaceId);

});

