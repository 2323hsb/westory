let ACCESS_TOKEN
let USER_USERNAME
let USER_PROFILE_IMAGE_URL
let USER_POSTS

const requestInitInformation = async () => {
    try {
        setUserInfo(await getUserInfo())
        setPosts(await getPost())
    } catch (error) {
        console.log(error)
    }
    displayUserInfo()
    displayPost()
}

const reloadPost = async () => {
    try {
        setPosts(await getPost())
    } catch (error) {
        console.log(error)
    }
    displayPost()
}

function getUserInfo() {
    return new Promise((resolve, reject) => {
        $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + ACCESS_TOKEN,
            },
            url: "http://127.0.0.1:8001/user",
            type: "GET",
        }).done((response) => { resolve(response) }).fail((error) => { reject(error) });
    })

}

function setUserInfo(response) {
    USER_USERNAME = response[0].username
    USER_PROFILE_IMAGE_URL = response[0].profile_img
}

function displayUserInfo() {
    $('.header__profile__pic').attr('src', USER_PROFILE_IMAGE_URL)
}

function getPost() {
    return new Promise((resolve, reject) => {
        $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + ACCESS_TOKEN,
            },
            url: 'http://127.0.0.1:8001/post',
            type: "GET",
        }).done((response) => { resolve(response) }).fail((error) => { reject(error) })
    })
}

function setPosts(response) {
    USER_POSTS = response
}

function displayPost() {
    jQuery.each(USER_POSTS, function (i, post) {
        var postHtml = "";
        created_date = formatDate(post.created_date)
        postHtml += "<div class='posts__streams__item' data-id='" + post.id + "'>";
        postHtml += "<div class='posts__streams__item__title'>"
        postHtml += "<div class='image-cropper'><img class='posts__streams__item__title__img' src='" + post.user_profile_img + "'></div>"
        postHtml += "<div class='posts_streams_item__title__text'>"
        postHtml += "<div class='posts__streams__item__title__name'>" + post.user_username + "</div>"
        postHtml += "<div class='posts__streams__item__title__time'>" + created_date + "</div>"
        postHtml += "</div>"
        postHtml += "</div>"
        postHtml += "<div class='posts__streams__item__content'>" + post.content + "</div>"
        postHtml += "<div class='posts__streams__item__tools'>"
        postHtml += "<span><i class='far fa-thumbs-up'></i> 좋아요</span>"
        postHtml += "<span class='posts__streams__item__tools__morecomment'><i class='far fa-comment'></i> 댓글 더보기</span>"
        postHtml += "</div>"
        postHtml += "<div class='posts__streams__item__replys'></div>"
        postHtml += "<div class='posts__streams__item__reply__form'>"
        postHtml += "<div class='image-cropper'><img class='posts__streams__item__reply__form__img' src='" + USER_PROFILE_IMAGE_URL + "'></div>"
        postHtml += "<input class='posts__streams__item__reply__form__input' placeholder='댓글을 입력하세요'>"
        postHtml += "<button class='posts__streams__item__reply__form__btn btn'>달기</button>"
        postHtml += "</div>"
        postHtml += "</div>"
        $('.posts__streams').append(postHtml)
    });

    $('.posts__streams__item__tools__morecomment').click(function () {
        var post_id = $(this).parents('.posts__streams__item').data('id')
        var replys_div = $(this).parent().siblings('.posts__streams__item__replys')
        moreReply(post_id, replys_div)
    })
}

const moreReply = async (post_id, replys_div) => {
    try {
        displayReply(replys_div, await getReply(post_id))
    } catch (error) {
        console.log(error)
    }
}

function getReply(post_id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + ACCESS_TOKEN,
            },
            url: 'http://127.0.0.1:8001/reply',
            type: "GET",
            data: {
                post_id: post_id,
            },
        }).done((response) => { resolve(response) }).fail((error) => { reject(error) })
    })
}

function displayReply(replys_div, response) {
    // replys_div.append("test")
    // console.log(response)
    jQuery.each(response, function (i, reply) {
        var reply_html = ""
        reply_html += "<div class='posts__streams__item__replys__item'><a>" + reply.user_username + "</a></div>"
        replys_div.append(reply_html)
    })
}

$(document).ready(function () {
    ACCESS_TOKEN = getCookie('access_token')
    if (!ACCESS_TOKEN) {
        onAuthFail()
    }
    requestInitInformation()

    $('.posts__form-box__form').on('submit', async function (event) {
        event.preventDefault();
        var content = $('.posts__form-box__textarea').val();
        try {
            await createPost(content)
            $('.emojionearea-editor').empty();
            $('.posts__streams').empty();
            await reloadPost()
        } catch (error) {
            console.log(error)
        }
    })

    $(".posts__form-box__textarea").emojioneArea({
        pickerPosition: "left",
        tonesStyle: "bullet",
        search: false,
        filtersPosition: "bottom"
    })
});

function onAuthFail() {
    window.location.replace('http://localhost:8000/')
}

function createPost(content) {
    return new Promise((resolve, reject) => {
        var payload = {
            content: content
        }
        $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + ACCESS_TOKEN,
            },
            url: 'http://127.0.0.1:8001/post',
            type: "POST",
            data: payload,
        }).done(function (response) {
            resolve(response)
        }).fail(function (error) {
            reject(error)
        })
    })
}

// function getPost(access_token) {
//     $.ajax({
//         headers: {
//             accept: "application/json",
//         },
//         url: 'http://127.0.0.1:8001/post',
//         type: "GET",
//         data: {
//             access_token: access_token
//         },
//     }).done(function (response) {
//         console.log(response)
//         generatePost(response)
//     }).fail(function (error) {
//         console.log(error)
//     })
// }

// function getPublicUserInfo(userKey) {
//     $.ajax({
//         headers: {
//             accept: "application/json",
//         },
//         url: 'http://127.0.0.1:8001/public-user',
//         type: "GET",
//         data: {
//             key: userKey
//         },
//     }).done(function (response) {
//         console.log(response)
//     })
// }

function signOut() {
    deleteCookie('access_token')
    window.location.replace('http://localhost:8000/')
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

    var create_time = new Date(date).getTime()
    var now = new Date()
    var sec_gap = (now - create_time) / 1000
    if (sec_gap < 60) {
        return Math.floor(sec_gap) + '초 전'
    }
    var min_gap = sec_gap / 60
    if (min_gap < 60) {
        return Math.floor(min_gap) + '분 전'
    }
    var hour_gap = min_gap / 60
    if (hour_gap < 24) {
        return Math.floor(hour_gap) + '시간 전'
    }
    return year + '년 ' + month + '월 ' + day + '일'
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

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}