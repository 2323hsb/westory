let ACCESS_TOKEN
let WESTORY_API_BASE_URL = 'http://localhost:8001'
let USER_USERNAME
let USER_PROFILE_IMAGE_URL
let USER_POSTS

const POST_PAGINATION_OFFSET = 0
const POST_PAGINATION_LIMIT = 10
let POST_PAGINATION_NEXT = null
let POST_WILL_LOAD = false

const REQ_SUCCESS = 'REQ_SUCCESS'
const REQ_UNAUTHORIZED = 'REQ_UNAUTHORIZED'
const REQ_ERROR = 'REQ_ERROR'

// request

const request_user_info = async () => {
    let results
    try {
        results = await $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + ACCESS_TOKEN,
            },
            url: WESTORY_API_BASE_URL + "/user",
            type: "GET",
        })
        return results
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            return REQ_UNAUTHORIZED
        } else {
            return REQ_ERROR
        }
    }
}

const request_posts = async () => {
    let result
    try {
        result = await $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + ACCESS_TOKEN,
            },
            url: WESTORY_API_BASE_URL + "/post",
            type: "GET",
        })
        return result
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            return REQ_UNAUTHORIZED
        } else {
            return REQ_ERROR
        }
    }
}

const request_new_post = async (content) => {
    let result
    var payload = {
        content: content
    }
    try {
        result = await $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + ACCESS_TOKEN,
            },
            url: WESTORY_API_BASE_URL + '/post',
            type: "POST",
            data: payload,
        })
        return result
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            return REQ_UNAUTHORIZED
        } else {
            return REQ_ERROR
        }
    }
}

const request_new_reply = async (post_id, content) => {
    let result
    try {
        result = await $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + ACCESS_TOKEN,
            },
            url: WESTORY_API_BASE_URL + '/reply',
            type: "POST",
            data: {
                post_id: post_id,
                content: content,
            },
        })
        return result
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            return REQ_UNAUTHORIZED
        } else {
            return REQ_ERROR
        }
    }
}

const request_replies = async (post_id) => {
    let result
    try {
        result = $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + ACCESS_TOKEN,
            },
            url: WESTORY_API_BASE_URL + '/reply',
            type: "GET",
            data: {
                post_id: post_id,
            },
        })
        return result
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            return REQ_UNAUTHORIZED
        } else {
            return REQ_ERROR
        }
    }
}

// new request

const n_request_posts = async (access_token, limit, offset) => {
    let results
    try {
        results = await $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + access_token,
            },
            url: WESTORY_API_BASE_URL + "/post",
            type: "GET",
            data: {
                limit: limit,
                offset: offset,
            }
        })
        return results
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            return REQ_UNAUTHORIZED
        } else {
            return REQ_ERROR
        }
    }
}

const request_posts_by_page = async (access_token, next) => {
    let results
    try {
        results = await $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + access_token,
            },
            url: next,
            type: "GET",
        })
        return results
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            return REQ_UNAUTHORIZED
        } else {
            return REQ_ERROR
        }
    }
}

// set

// function set_user_info(response) {
//     USER_USERNAME = response[0].username
//     USER_PROFILE_IMAGE_URL = response[0].profile_img
// }

// function set_posts(response) {
//     USER_POSTS = response
// }

// append post

function append_posts(posts) {
    jQuery.each(posts, function (i, post) {
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
        post_html += "       <span class='posts__streams__item__tools__morereplies'><i class='far fa-comment'></i> 댓글 " + post.replies_count + "개</span>"
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
}

// display

function display_user_info(user_info) {
    $('.header__profile__pic').attr('src', user_info[0].profile_img)
}

function display_posts() {
    console.log(USER_POSTS)
    jQuery.each(USER_POSTS.results, function (i, post) {
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
        post_html += "       <span class='posts__streams__item__tools__morereplies'><i class='far fa-comment'></i> 댓글 " + post.replies_count + "개</span>"
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

    $('.posts__streams__item__tools__morereplies').click(more_replies_event)
    $('.posts__streams__item__reply__form form').submit(request_new_reply_event)
}

function display_replies(view, replies_div, response) {
    replies_div.empty()
    view.off()
    view.click(remove_replies_event)
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
        replies_div.append(reply_html)
    })
}

// reload

const reloadPost = async () => {
    request_posts().then((result) => {
        set_posts(result)
        $('.emojionearea-editor').empty()
        $('.posts__streams').empty()
        display_posts()
    }).catch((req_status) => {
        console.log(req_status)
    })
}

// event

function more_replies_event() {
    var post_id = $(this).parents('.posts__streams__item').data('id')
    var replies_div = $(this).parent().siblings('.posts__streams__item__replys')
    request_replies(post_id).then((result) => {
        display_replies($(this), replies_div, result)
    }).catch((req_status) => {
        console.log(req_status)
    })
}

function remove_replies_event() {
    var replies_div = $(this).parent().siblings('.posts__streams__item__replys')
    replies_div.empty()
    $(this).off()
    $(this).click(more_replies_event)
}

function request_new_reply_event() {
    event.preventDefault()

    var post_id = $(this).parents('.posts__streams__item').data('id')
    var content = $(this).find('[name=reply__input]').val();
    var replies_div = $(this).parent().siblings('.posts__streams__item__replys')
    request_new_reply(post_id, content).then((result) => {
        $(this).find('[name=reply__input]').val('')
        request_replies(post_id).then((result) => {
            display_replies(find_post_by_post_id(post_id), replies_div, result)
        }).catch((req_status) => {
            console.log(req_status)
        })
    }).catch((req_status) => {
        console.log(req_status)
    })
}

// const moreReply = async (post_id, replies_div) => {
//     try {
//         display_replies(replies_div, await getReply(post_id))
//     } catch (error) {
//         console.log(error)
//     }
// }

// function getReply(post_id) {
//     return new Promise((resolve, reject) => {
//         $.ajax({
//             headers: {
//                 accept: "application/json",
//                 Authorization: "Token " + ACCESS_TOKEN,
//             },
//             url: 'http://127.0.0.1:8001/reply',
//             type: "GET",
//             data: {
//                 post_id: post_id,
//             },
//         }).done((response) => { resolve(response) }).fail((error) => { reject(error) })
//     })
// }

async function wait_until_init_request() {
    while (!(USER_USERNAME && USER_PROFILE_IMAGE_URL)) {
        await sleep(500)
    }
}

$(document).ready(function () {
    POST_WILL_LOAD = true
    n_request_posts(ACCESS_TOKEN, POST_PAGINATION_LIMIT, POST_PAGINATION_OFFSET).then((results) => {
        POST_WILL_LOAD = false
        POST_PAGINATION_NEXT = results.next
        append_posts(results.results)
        // set_posts(results)
    }).catch(req_status => {
        relocate_to_root()
    })

    request_user_info().then((results) => {
        // set_user_info(results)
        console.log(results)
        display_user_info(results)
    }).catch(req_status => {
        relocate_to_root()
    })

    $('.posts__form-box__form').on('submit', function () {
        event.preventDefault();
        var content = $('.posts__form-box__textarea').val();
        request_new_post(content).then((_) => {
            reloadPost()
        }).catch((req_status) => {
            console.log(req_status)
        })
    })

    $(".posts__form-box__textarea").emojioneArea({
        pickerPosition: "left",
        tonesStyle: "bullet",
        search: false,
        filtersPosition: "bottom"
    })

    $(window).scroll(function () {        
        if ($(window).scrollTop() + $(window).height() == $(document).height() & !POST_WILL_LOAD) {
            if (POST_PAGINATION_NEXT) {
                POST_WILL_LOAD = true
                request_posts_by_page(ACCESS_TOKEN, POST_PAGINATION_NEXT).then((result) => {
                    POST_WILL_LOAD = false
                    POST_PAGINATION_NEXT = result.next
                    append_posts(result.results)
                })
            }
        }
    })
});

function find_post_by_post_id(post_id) {
    return $('.posts__streams__item').find("[data-id='" + post_id + "']")
}

const relocate_to_root = () => {
    deleteCookie('access_token')
    window.location.replace('http://localhost:8000/')
}

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

before_dom_load()

function before_dom_load() {
    ACCESS_TOKEN = getCookie('access_token')
    if (!ACCESS_TOKEN) {
        relocate_to_root()
    }
}