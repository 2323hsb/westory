const requestStoryByID = async (accessToken, storyID) => {
    let results
    try {
        results = await $.ajax({
            headers: {
                Authorization: "Token " + accessToken,
            },
            url: WESTORY_API_BASE_URL + "/story?hash_id=" + storyID,
            type: "GET",
        })
        return results
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            throw 'requestStoryByID, unauthorize error'
        } else {
            throw 'requestStoryByID, unknown error'
        }
    }
}

const requestLoveStory = async (access_token, storyID, isLover) => {
    console.log(isLover)
    let results
    try {
        results = await $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + access_token,
            },
            url: WESTORY_API_BASE_URL + '/story/' + storyID + '/love',
            type: "POST",
            data: {
                story_id: storyID,
                is_lover: isLover,
            },
        })
        return results
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            throw 'requestLoveStory, unauthorize error'
        } else {
            throw 'requestLoveStory, unknown error'
        }
    }
}

function getStoryID() {
    var currentURL = document.getElementById('story_id').value
    var lastURLsegment = currentURL.substr(currentURL.lastIndexOf('/') + 1)
    return lastURLsegment
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

requestStoryByID(getCookie('access_token'), getStoryID()).then((result) => {
    console.log(result)
    let title = document.getElementById('story__header__title')
    let date = document.getElementById('story__header__date')
    let content = document.getElementById('story__content')
    let profileImg = document.getElementById('story__bottom__about__profileimg')
    let profileName = document.getElementById('story__bottom__about__profiletxt__name')
    let profileSomething = document.getElementById('story__bottom__about__profiletxt__something')
    let loversCount = document.getElementById('story__bottom__actions__love__count')
    let LoverIcon = document.getElementById('story__bottom__actions__love')

    title.innerHTML = result[0].title
    date.innerHTML = dateFormatter(result[0].created_date, 1)
    content.innerHTML = result[0].content
    profileImg.style.backgroundImage = 'url(' + result[0].user_profile_img + ')'
    profileName.innerHTML = result[0].user_username
    loversCount.innerHTML = result[0].lovers_count

    var isLover = result[0].is_lover
    if (isLover) {
        LoverIcon.classList.add('fas')
    } else {
        LoverIcon.classList.add('far')
    }

    let storyLove = document.getElementById('story__bottom__actions__love')
    storyLove.addEventListener('click', function (e) {
        requestLoveStory(getCookie('access_token'), getStoryID(), !isLover).then((result) => {
            isLover = !isLover
            LoverIcon.classList.toggle('fas')
            LoverIcon.classList.toggle('far')
            loversCount.innerHTML = result.lovers_count
        })
    })
})