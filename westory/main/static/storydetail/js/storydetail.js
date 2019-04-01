function requestStoryByID(storyID, accessToken = null) {
    var headers = {
        accept: "application/json; charset=utf-8",
    }
    if (accessToken) {
        headers['Authorization'] = "Token " + accessToken
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            headers: headers,
            url: WESTORY_API_BASE_URL + "/story/" + storyID,
            type: "GET",
        }).done((response) => {
            resolve(response)
        }).fail((error) => {
            reject('Network or Server Error: ' + error)
        })
    })
}

function requestLoveStory(accessToken, storyID) {
    return new Promise((resolve, reject) => {
        $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + accessToken,
            },
            url: WESTORY_API_BASE_URL + '/story/' + storyID + '/love',
            type: "POST",
        }).done((response) => {
            resolve(response)
        }).fail((error) => {
            reject('Network or Server Error: ' + error)
        })
    })
}

const submitComment = async (access_token, storyID, content) => {
    let results
    try {
        results = await $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + access_token,
            },
            url: WESTORY_API_BASE_URL + '/story/' + storyID + '/comment',
            type: "POST",
            data: {
                content: content,
            },
        })
        return results
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            throw 'submitComment, unauthorize error'
        } else {
            throw 'submitComment, unknown error'
        }
    }
}

const requestComments = async (access_token, storyID) => {
    let results
    try {
        results = await $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + access_token,
            },
            url: WESTORY_API_BASE_URL + '/story/' + storyID + '/comment',
            type: "GET",
        })
        return results
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            throw 'requestComments, unauthorize error'
        } else {
            throw 'requestComments, unknown error'
        }
    }
}

function getStoryID() {
    var currentURL = document.getElementById('storyArticleID').value
    var lastURLsegment = currentURL.substr(currentURL.lastIndexOf('/') + 1)
    return lastURLsegment
}

requestStoryByID(getStoryID(), getCookie('access_token')).then((result) => {
    let title = document.getElementById('storyTitle')
    let date = document.getElementById('storyDate')
    let content = document.getElementById('storyContent')
    let profileImg = document.getElementById('storyProfileImg')
    let profileName = document.getElementById('storyProfileName')
    let profileSomething = document.getElementById('storyProfileText')
    let loversCount = document.getElementById('storyActionLoveCounter')
    let LoverIcon = document.getElementById('storyActionLove')

    title.innerHTML = result[0].title
    date.innerHTML = dateFormatter(result[0].created_date, 1)
    content.innerHTML = result[0].content
    profileImg.style.backgroundImage = 'url(' + result[0].user_profile_img + ')'
    profileName.innerHTML = result[0].user_username
    loversCount.innerHTML = result[0].lovers_count

    if (result[0].user_is_lover) {
        LoverIcon.classList.add('fas')
    } else {
        LoverIcon.classList.add('far')
    }

    // getComments(document.getElementById('storyArticleComments'))
})

document.getElementById('storyActionLove').addEventListener('click', function (e) {
    requestLoveStory(getCookie('access_token'), getStoryID()).then((result) => {
        e.target.classList.toggle('fas')
        e.target.classList.toggle('far')
        document.getElementById('storyActionLoveCounter').innerHTML = result.lovers_count
    })
})

function getComments(target) {
    requestComments(getCookie('access_token'), getStoryID()).then((result) => {
        target.innerHTML = ''
        result.forEach(element => {
            var a = document.createElement('div')
            a.classList.add('storyArticle__comment')
            var b = document.createElement('div')
            b.classList.add('nametag')
            var c = document.createElement('a')
            c.classList.add('nametag__img')
            c.classList.add('image-cropper')
            c.style.backgroundImage = 'url(' + element.user_profile_img + ')'
            var d = document.createElement('div')
            d.classList.add('nametag__profile')
            var e = document.createElement('p')
            e.innerHTML = element.user_username
            e.classList.add('nametag__profile__name')
            var f = document.createElement('p')
            f.innerHTML = dateFormatter(element.created_date)
            f.classList.add('nametag__profile__date')
            var g = document.createElement('div')
            g.classList.add('stroyArticle__comment__content')
            var h = document.createElement('p')
            h.innerHTML = element.content

            d.appendChild(e)
            d.appendChild(f)
            b.appendChild(c)
            b.appendChild(d)
            g.appendChild(h)
            a.appendChild(b)
            a.appendChild(g)

            target.appendChild(a)
        });
    })
}

var commentSubmitBtn = document.getElementById('storyCommentSubmitBtn')
var commentTextarea = document.getElementById('storyCommentTextarea')
commentSubmitBtn.addEventListener('click', function (e) {
    var a = commentTextarea.value
    submitComment(getCookie('access_token'), getStoryID(), a).then((result) => {
        getComments(document.getElementById('storyArticleComments'))
    })
})