let ACCESS_TOKEN
let USER_USERNAME
let USER_PROFILE_IMAGE_URL
let USER_POSTS

const requestInitInformation = async () => {
    try {
        setUserInfo(await getUserInfo())
        setPosts(await getPost())
    } catch (errorThrown) {
        console.log(errorThrown)
        return errorThrown
    }
    displayUserInfo()
    displayPost()
    // return 
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
                Authorization: "Token " + ACCESS_TOKEN +'a',
            },
            url: "http://127.0.0.1:8001/user",
            type: "GET",
        }).done((response) => {
            resolve(response) 
        }).fail((_, _, errorThrown) => {
            reject(errorThrown) 
        });
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
        var post_html = "";
        created_date = formatDate(post.created_date)
        post_html += "<div class='posts__streams__item' data-id='" + post.id + "'>";
        post_html += "   <div class='posts__streams__item__title'>"
        post_html += "       <div class='image-cropper'><img class='posts__streams__item__title__img' src='" + post.user_profile_img + "'></div>"
        post_html += "       <div class='posts_streams_item__title__text'>"
        post_html += "           <div class='posts__streams__item__title__name'>" + post.user_username + "</div>"
        post_html += "           <div class='posts__streams__item__title__time'>" + created_date + "</div>"
        post_html += "       </div>"
        post_html += "   </div>"
        post_html += "   <div class='posts__streams__item__content'>" + post.content + "</div>"
        post_html += "   <div class='posts__streams__item__tools'>"
        post_html += "       <span><i class='far fa-thumbs-up'></i> 좋아요</span>"
        post_html += "       <span class='posts__streams__item__tools__morecomment'><i class='far fa-comment'></i> 댓글 더보기</span>"
        post_html += "   </div>"
        post_html += "   <div class='posts__streams__item__replys'></div>"
        post_html += "   <div class='posts__streams__item__reply__form'>"
        post_html += "       <div class='image-cropper'><img class='posts__streams__item__reply__form__img' src='" + USER_PROFILE_IMAGE_URL + "'></div>"
        post_html += "       <form method='POST'>"
        post_html += "          <input name='reply__input' class='posts__streams__item__reply__form__input' placeholder='댓글을 입력하세요'>"
        post_html += "          <button class='posts__streams__item__reply__form__btn btn'>달기</button>"
        post_html += "       </form>"
        post_html += "   </div>"
        post_html += "</div>"
        $('.posts__streams').append(post_html)
    });

    $('.posts__streams__item__tools__morecomment').click(more_reply_event)
}

function more_reply_event() {
    var post_id = $(this).parents('.posts__streams__item').data('id')
    var replys_div = $(this).parent().siblings('.posts__streams__item__replys')
    moreReply(post_id, replys_div).then(() => {
        $(this).empty()
        var temp_html = ""
        temp_html += "<i class='fas fa-angle-up'></i> 댓글 감추기"
        $(this).append(temp_html)
        $(this).off()
        $(this).click(remove_reply_event)
    })
}
function remove_reply_event() {
    $(this).empty()
    var temp_html = ""
    temp_html += "<i class='far fa-comment'></i> 댓글 더보기"
    $(this).append(temp_html)
    var replys_div = $(this).parent().siblings('.posts__streams__item__replys')
    replys_div.empty()
    $(this).off()
    $(this).click(more_reply_event)
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
    jQuery.each(response, function (i, reply) {
        created_date = formatDate(reply.created_date)
        var reply_html = ""
        reply_html += "<div class='posts__streams__item__replys__item'>"
        reply_html += "<div class='posts__streams__item__replys__item__title'>"
        reply_html += "<div class='image-cropper-reply'><img class='posts__streams__item__title__img' src='" + reply.user_profile_img + "'></div>"
        reply_html += "<div class='posts__streams__item__replys__item__title__username'>" + reply.user_username + "</div>"
        reply_html += "<div class='posts__streams__item__replys__item__title__time'>" + created_date + "</div>"
        reply_html += "</div>"
        reply_html += "<div class='posts__streams__item__replys__item__content'>" + reply.content
        reply_html += "</div>"
        reply_html += "</div>"
        replys_div.append(reply_html)
    })
}

$(document).ready(function () {
    ACCESS_TOKEN = getCookie('access_token')
    if (!ACCESS_TOKEN) {
        onAuthFail()
    }
    requestInitInformation().then(() => {
        // add reply event
        $('.posts__streams__item__reply__form form').on('submit', function (event) {
            event.preventDefault()
            var post_id = $(this).parents('.posts__streams__item').data('id')
            var content = $(this).find('[name=reply__input]').val();
            $.ajax({
                headers: {
                    accept: "application/json",
                    Authorization: "Token " + ACCESS_TOKEN,
                },
                url: 'http://127.0.0.1:8001/reply',
                type: "POST",
                data: {
                    post_id: post_id,
                    content: content,
                },
            }).done(() => {
                // show new reply
            }).fail(() => {

            })
        })
    }).catch((error) => {
        console.log(error)
    })

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