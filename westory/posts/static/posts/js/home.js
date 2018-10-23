$(document).ready(function () {
    getUserInfo()
    $('.posts__form-box__form').on('submit', function (e) {
        e.preventDefault();
        var contentText = $('.posts__form-box__textarea').val();
        var payload = {
            content: contentText,
        }
        $.ajax({
            url: 'http://127.0.0.1:8001/apis/createPost',
            type: "POST",
            data: payload,
        }).done(function (response) {
            $('.posts__form-box__textarea > .emojionearea-editor').empty()
            getPosts()
        }).fail(function (error) {

        }).always(function () {

        });
    })

    $(".posts__form-box__textarea").emojioneArea({
        pickerPosition: "left",
        tonesStyle: "bullet",
        search: false,
        filtersPosition: "bottom"
    })
});

function getUserInfo() {
    var access_token = getCookie('access_token')
    console.log(access_token)
    var payload = {
        access_token: access_token,
    }
    $.ajax({
        headers: {
            accept: "application/json",
        },
        url: 'http://127.0.0.1:8001/user',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        dataType: "json"
    }).done(function (response) {
        console.log(response)
    }).fail(function (error) {
        console.log(error)
    })
}

function onAuthFail() {
    window.location.replace('http://localhost:8000/')
}

function loadUserPosts(googleUser) {
    $this = $('.posts__streams');
    $this.empty();

    var id_token = googleUser.getAuthResponse().id_token;
    var payload = {
        id_token: id_token,
    }

    $.ajax({
        headers: {
            accept: "application/json",
        },
        url: 'http://127.0.0.1:8001/posts',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        dataType: "json"
    }).done(function (response) {

    }).fail(function (error) {
        console.log(error)
    })
    // $.ajax({
    //     url: 'http://127.0.0.1:8001/apis/createPost',
    //     type: "GET",
    //     accept: "application/json"
    // }).done(function (response) {
    //     for (i = 0; i < response.length; i++) {
    //         $this.append(generatePost(response[i].content, response[i].created_date))
    //     }
    // }).fail(function (response) {
    //     console.log("fail")
    // })
}

function signOut() {
    gauthInstance.signOut().then(function () {
        window.location.replace('http://localhost:8000/')
    })
}

function generatePost(content, created_date) {
    var postHtml = "";
    created_date = formatDate(created_date)
    postHtml += "<div class='posts__streams__item'>";
    postHtml += "<div class='posts__streams__item__title'>" + created_date + "</div>"
    postHtml += "<div class='posts__streams__item__content'>" + content + "</div>"
    postHtml += "<div class='posts__streams__item__tools'></div>"
    postHtml += "<div class='posts__streams__item__reply'></div>"
    postHtml += "</div>"
    return postHtml;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    hour = d.getHours();
    min = d.getMinutes();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-') + " " + [hour, min].join(':');
}

// function uploadImage(image) {
//     var data = new FormData();
//     data.append("image", image);
//     $.ajax({
//         url: 'http://127.0.0.1:8001/apis/uploadImage',
//         cache: false,
//         contentType: false,
//         processData: false,
//         data: data,
//         type: "post",
//         success: function (url) {
//             console.log(url.image)
//             var image = $('<img>').attr('src', url.image);
//             $('#summernote').summernote("insertNode", image[0]);
//         },
//         error: function (data) {
//             console.log(data);
//         }
//     });
// }

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
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}