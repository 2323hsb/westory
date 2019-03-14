let ACCESS_TOKEN
let USER_USERNAME
let USER_PROFILE_IMAGE_URL
let USER_POSTS

const POST_PAGINATION_OFFSET = 0
const POST_PAGINATION_LIMIT = 10
let POST_WILL_LOAD = false

const request_posts = async (access_token, limit, offset) => {
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
            throw 'request_post, unauthorize error'
        } else {
            throw 'request_post, unknown error'
        }
    }
}

const request_new_post = async (access_token, content) => {
    let result
    var payload = {
        content: content,
    }
    try {
        result = await $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + access_token,
            },
            url: WESTORY_API_BASE_URL + '/post',
            type: "POST",
            data: payload,
        })
        return result
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            throw 'request_new_post, unauthorize error'
        } else {
            console.log(jqXHR)
            throw 'request_new_post, unknown error'
        }
    }
}

const request_new_reply = async (access_token, post_id, content) => {
    let result
    try {
        result = await $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + access_token,
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
            throw 'request_new_reply, unauthorize error'
        } else {
            throw 'request_new_reply, unknown error'
        }
    }
}

const request_replies = async (access_token, post_id) => {
    let result
    try {
        result = $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + access_token,
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
            throw 'request_replies, unauthorize error'
        } else {
            throw 'request_replies, unknown error'
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
            throw 'request_posts_by_page, unauthorize error'
        } else {
            throw 'request_posts_by_page, unknown error'
        }
    }
}

const request_like_a_post = async (access_token, post_id, is_like) => {
    let results
    try {
        results = await $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + access_token,
            },
            url: WESTORY_API_BASE_URL + '/likes',
            type: "POST",
            data: {
                post_id: post_id,
                is_like: is_like,
            },
        })
        return results
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            throw 'request_like_a_post, unauthorize error'
        } else {
            throw 'request_like_a_post, unknown error'
        }
    }
}

const request_like_post_ids = async (access_token, post_id) => {
    let results
    try {
        if (post_id) {
            results = await $.ajax({
                headers: {
                    accept: "application/json",
                    Authorization: "Token " + access_token,
                },
                url: WESTORY_API_BASE_URL + '/likes',
                type: "GET",
                data: {
                    'post_id': post_id
                }
            })
        } else {
            results = await $.ajax({
                headers: {
                    accept: "application/json",
                    Authorization: "Token " + access_token,
                },
                url: WESTORY_API_BASE_URL + '/likes',
                type: "GET",
            })
        }
        return results
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            throw 'request_like_a_post, unauthorize error'
        } else {
            throw 'request_like_a_post, unknown error'
        }
    }
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

const request_upload_image = async (access_token, image) => {
    var data = new FormData()
    data.append("image", image)
    let results
    try {
        results = await $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + access_token,
            },
            url: WESTORY_API_BASE_URL + '/upload_image',
            type: "POST",
            data: data,
        })
        return results
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            throw 'request_upload_image, unauthorize error'
        } else {
            throw 'request_upload_image, unknown error'
        }
    }
}
// set

function set_user_info(response) {
    USER_USERNAME = response[0].username
    USER_PROFILE_IMAGE_URL = response[0].profile_img
}
// append post

function append_posts(posts, user_info, like_posts) {
    jQuery.each(posts, function (i, post) {
        var post_html = "";
        created_date = dateFormatter(post.created_date)
        post_html += "<div class='posts__streams__item' data-id='" + post.id + "'>";
        post_html += "   <div class='posts__streams__item__title'>"
        post_html += "       <img class='posts__streams__item__title__img image-cropper' src='" + post.user_profile_img + "'>"
        post_html += "       <div class='posts_streams_item__title__text'>"
        post_html += "           <div class='posts__streams__item__title__text__name'>" + post.user_username + "</div>"
        post_html += "           <div class='posts__streams__item__title__text__time'>" + created_date + "</div>"
        post_html += "       </div>"
        post_html += "   </div>"
        post_html += "   <div class='posts__streams__item__content'>" + post.content + "</div>"
        post_html += "   <div class='posts__streams__item__tools'>"
        if (like_posts.includes(post.id)) {
            post_html += "       <span class='posts__streams__item__tools__like posts__streams__item__tools__like--like'><i class='far fa-thumbs-up'></i> " + post.likes_count + "</span>"
        } else {
            post_html += "       <span class='posts__streams__item__tools__like posts__streams__item__tools__like--unlike'><i class='far fa-thumbs-up'></i> " + post.likes_count + "</span>"
        }
        post_html += "       <span class='posts__streams__item__tools__comments posts__streams__item__tools__comments--show'><i class='far fa-comment'></i> 댓글 " + post.replies_count + "개</span>"
        post_html += "   </div>"
        post_html += "   <div class='posts__streams__item__comments'></div>"
        post_html += "   <div class='posts__streams__item__comment-form'>"
        post_html += "       <img class='posts__streams__item__comment-form__img image-cropper' src='" + user_info.profile_img + "'>"
        post_html += "       <form class='posts__streams__item__comment-form__form' method='POST'>"
        post_html += "          <input class='posts__streams__item__comment-form__form__input' placeholder='댓글을 입력하세요'>"
        post_html += "          <button class='posts__streams__item__comment-form__form__btn btn'>달기</button>"
        post_html += "       </form>"
        post_html += "   </div>"
        post_html += "</div>"

        $('.posts__streams').append(post_html)
    });
}

// display

function display_replies(comments_div, response) {
    comments_div.empty()
    jQuery.each(response, function (i, reply) {
        created_date = dateFormatter(reply.created_date)
        var reply_html = ""
        reply_html += "<div class='posts__streams__item__comments__item'>"
        reply_html += "<div class='posts__streams__item__comments__item__title'>"
        reply_html += "<div class='image-cropper-reply'><img class='posts__streams__item__comments__item__title__img' src='" + reply.user_profile_img + "'></div>"
        reply_html += "<div class='posts__streams__item__comments__item__title__username'>" + reply.user_username + "</div>"
        reply_html += "<div class='posts__streams__item__comments__item__title__time'>" + created_date + "</div>"
        reply_html += "</div>"
        reply_html += "<div class='posts__streams__item__comments__item__content'>" + reply.content
        reply_html += "</div>"
        reply_html += "</div>"
        comments_div.append(reply_html)
    })
}

// event

function show_replies_event() {
    var post_id = $(this).parents('.posts__streams__item').data('id')
    var comments_div = $(this).parent().siblings('.posts__streams__item__comments')
    var comment_btn = $(this).parents('.posts__streams__item').find('.posts__streams__item__tools__comments')
    comments_div.html('<div style="display: flex; justify-content: center; margin: 8px;"><i style="font-size:24px" class="fas fa-spinner fa-spin"></i></div>')
    request_replies(ACCESS_TOKEN, post_id).then((result) => {
        display_replies(comments_div, result)
        comment_btn.html("<i class='far fa-comment'></i> 댓글 " + result.length + "개")
        $(this).toggleClass('posts__streams__item__tools__comments--show posts__streams__item__tools__comments--hide');
    }).catch((error) => {
        console.log(error)
    })
}

function hide_replies_event() {
    var comments_div = $(this).parent().siblings('.posts__streams__item__comments')
    comments_div.empty()
    $(this).toggleClass('posts__streams__item__tools__comments--hide posts__streams__item__tools__comments--show');
}

function submit_new_reply_event() {
    event.preventDefault()
    var post_id = $(this).parents('.posts__streams__item').data('id')
    var content = $(this).find('.posts__streams__item__comment-form__form__input').val();
    request_new_reply(ACCESS_TOKEN, post_id, content).then((result) => {
        $(this).find('.posts__streams__item__comment-form__form__input').val('')
        var toggle_btn = $(this).parents('.posts__streams__item').find('.posts__streams__item__tools__comments')
        if (toggle_btn.hasClass('posts__streams__item__tools__comments--hide')) {
            toggle_btn.toggleClass('posts__streams__item__tools__comments--hide posts__streams__item__tools__comments--show')
        }
        toggle_btn.click()
    }).catch((req_status) => {
        console.log(req_status)
    })
}

function like_a_post_event() {
    var post_id = $(this).parents('.posts__streams__item').data('id')
    request_like_a_post(ACCESS_TOKEN, post_id, true).then((result) => {
        request_like_post_ids(ACCESS_TOKEN, post_id).then((result) => {
            var like_count = result.like_count
            var is_like = result.is_like
            if (is_like) {
                $(this).toggleClass('posts__streams__item__tools__like--unlike posts__streams__item__tools__like--like')
                $(this).html("<i class='far fa-thumbs-up'></i> " + like_count)
            }
        })
    }).catch((req_status) => {
        console.log(req_status)
    })
}

function unlike_a_post_event() {
    var post_id = $(this).parents('.posts__streams__item').data('id')
    request_like_a_post(ACCESS_TOKEN, post_id, false).then((result) => {
        request_like_post_ids(ACCESS_TOKEN, post_id).then((result) => {
            var like_count = result.like_count
            var is_like = result.is_like
            if (!is_like) {
                $(this).toggleClass('posts__streams__item__tools__like--like posts__streams__item__tools__like--unlike')
                $(this).html("<i class='far fa-thumbs-up'></i> " + like_count)
            }
        })
    }).catch((req_status) => {
        console.log(req_status)
    })
}

function image_upload_event(event) {
    var files = event.target.files;
    var reader = new FileReader();

    for (var i = 0, f; f = files[i]; i++) {
        reader.readAsDataURL(f);
        reader.onload = function () {
            $('.posts__form-box__tools__preview').html("<img src='"+ reader.result +"'/>")
        }
    }
}

const init_request = async (access_token, post_pagination_limit, post_paginamtion_offset) => {
    var user_info = await request_user_info(access_token)
    var posts = await request_posts(access_token, post_pagination_limit, post_paginamtion_offset)
    var like_posts = await request_like_post_ids(access_token)

    return [user_info, posts, like_posts]
}

const reload_posts = async (access_token, post_pagination_limit, post_paginamtion_offset) => {
    var posts = await request_posts(access_token, post_pagination_limit, post_paginamtion_offset)
    $('.emojionearea-editor').empty()
    $('.posts__streams').empty()

    return posts
}

function set_scroll_refresh_event(next_page_url, user_info, like_posts) {
    $(window).scroll(function () {
        if ($(window).scrollTop() +1 >= $(document).height() - $(window).height() & !POST_WILL_LOAD) {
            if (next_page_url.val) {
                POST_WILL_LOAD = true
                request_posts_by_page(ACCESS_TOKEN, next_page_url.val).then((results) => {
                    POST_WILL_LOAD = false
                    next_page_url.val = results.next
                    append_posts(results.results, user_info, like_posts)
                })
            }
        }
    })
}

function set_form_submit_event(next_page_url, user_info, like_posts) {
    $('.posts__form-box__form').on('submit', function () {
        event.preventDefault();
        var content = $('.posts__form-box__textarea').val();
        var image = $('#img_upload_input').val()
        request_new_post(ACCESS_TOKEN, content, image).then((_) => {
            reload_posts(ACCESS_TOKEN, POST_PAGINATION_LIMIT, POST_PAGINATION_OFFSET).then((results) => {
                next_page_url.val = results.next
                append_posts(results.results, user_info, like_posts)
            })
        }).catch((error) => {
            console.log(error)
        })
    })
}

$(document).ready(function () {

    var next_page_urls = {}

    init_request(ACCESS_TOKEN, POST_PAGINATION_LIMIT, POST_PAGINATION_OFFSET).then((responses) => {
        const user_info = responses[0][0]
        const posts = responses[1].results
        next_page_urls.val = responses[1].next
        const like_posts = responses[2]

        append_posts(posts, user_info, like_posts)

        set_scroll_refresh_event(next_page_urls, user_info, like_posts)
        set_form_submit_event(next_page_urls, user_info, like_posts)
    }).catch((error) => {
        console.log(error)
    })

    $(".posts__streams").on('click', '.posts__streams__item__tools__comments--show', show_replies_event)
    $(".posts__streams").on('click', '.posts__streams__item__tools__comments--hide', hide_replies_event)
    $(".posts__streams").on('submit', '.posts__streams__item__comment-form__form', submit_new_reply_event)
    $(".posts__streams").on('click', '.posts__streams__item__tools__like--unlike', like_a_post_event)
    $(".posts__streams").on('click', '.posts__streams__item__tools__like--like', unlike_a_post_event)

    $("#img_upload_input").on('change', image_upload_event)

    $(".posts__form-box__textarea").emojioneArea({
        pickerPosition: "left",
        tonesStyle: "bullet",
        search: false,
        filtersPosition: "bottom"
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

before_dom_load()

function before_dom_load() {
    ACCESS_TOKEN = getCookie('access_token')
    if (!ACCESS_TOKEN) {
        relocate_to_root()
    }
}