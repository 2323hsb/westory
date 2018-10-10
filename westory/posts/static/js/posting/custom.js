$(document).ready(function () {
    $('#summernote').summernote({
        placeholder: 'Hello bootstrap 3',
        tabsize: 2,
        height: 100,
        callbacks: {
            onImageUpload: function (image) {
               uploadImage(image[0]);
            }
        }
    });

    $('#post-form').on('submit', function(e){
        e.preventDefault();
        var contentText = $("#summernote").val();
        var payload = {
            content: contentText,
        }
        $.ajax({
            url: 'http://127.0.0.1:8001/apis/createPost',
            type: "POST",
            data: payload,
        }).done(function (response) {

        }).fail(function (error) {

        }).always(function () {
            
        });
    })

    getPosts();
});

function getPosts() {
    $.ajax({
        url: 'http://127.0.0.1:8001/apis/createPost',
        type: "GET",
        accept: "application/json"
    }).done(function (response) {
        console.log(response[0])
        $("body").append(response[0].content)
    }).fail(function (response) {
        console.log("fail")
    })
}

function uploadImage(image) {
    var data = new FormData();
    data.append("image", image);
    $.ajax({
        url: 'http://127.0.0.1:8001/apis/uploadImage',
        cache: false,
        contentType: false,
        processData: false,
        data: data,
        type: "post",
        success: function (url) {
            console.log(url.image)
            var image = $('<img>').attr('src', url.image);
            $('#summernote').summernote("insertNode", image[0]);
        },
        error: function (data) {
            console.log(data);
        }
    });
}

// function sendFile(file, editor, welEditable) {
//     console.log('sendfile');
//     data = new FormData();
//     data.append("file", file);
//     $.ajax({
//         data: data,
//         type: "POST",
//         url: "url",
//         cache: false,
//         contentType: false,
//         processData: false,
//         success: function(url) {
//             editor.insertImage(welEditable, url);
//         }
//     });
// }