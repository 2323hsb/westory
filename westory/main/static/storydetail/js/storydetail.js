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
            url: WESTORY_API_BASE_URL + "/stories/" + storyID,
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
            url: WESTORY_API_BASE_URL + '/stories/' + storyID + '/love_story/',
            type: "POST",
        }).done((response) => {
            resolve(response)
        }).fail((error) => {
            reject('Network or Server Error: ' + error)
        })
    })
}

function requestAddComment(access_token, storyID, content) {
    return new Promise((resolve, reject) => {
        $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + access_token,
            },
            url: WESTORY_API_BASE_URL + '/stories/' + storyID + '/add_comment/',
            type: "POST",
            data: {
                content: content,
            },
        }).done((response) => {
            resolve(response)
        }).fail((error) => {
            reject('Network or Server Error: ' + error)
        })
    })
}

function requestGetComments(access_token, storyID) {
    return new Promise((resolve, reject) => {
        $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + access_token,
            },
            url: WESTORY_API_BASE_URL + '/stories/' + storyID + '/comments',
            type: "GET",
        }).done((response) => {
            resolve(response)
        }).fail((error) => {
            reject('Network or Server Error: ' + error)
        })
    })
}

function getStoryID() {
    var currentURL = document.getElementById('storyArticleID').value
    var lastURLsegment = currentURL.substr(currentURL.lastIndexOf('/') + 1)
    return lastURLsegment
}

var commentSubmitBtn = document.getElementById('storyCommentSubmitBtn')
var commentTextarea = document.getElementById('storyCommentTextarea')
var showCommentBtn = document.getElementById('storyArticleShowComments')

requestStoryByID(getStoryID(), getCookie('access_token')).then((result) => {
    let title = document.getElementById('storyTitle')
    let date = document.getElementById('storyDate')
    let content = document.getElementById('storyContent')
    let profileImg = document.getElementById('storyProfileImg')
    let profileName = document.getElementById('storyProfileName')
    let profileSomething = document.getElementById('storyProfileText')
    let loversCount = document.getElementById('storyActionLoveCounter')
    let LoverIcon = document.getElementById('storyActionLove')

    title.innerHTML = result.title
    date.innerHTML = dateFormatter(result.created_date, 1)
    content.innerHTML = result.content
    requestUserInfo(getCookie('access_token'), uid = null, url = result.user).then((user) => {
        profileImg.style.backgroundImage = 'url(' + user.profile_img + ')'
        profileName.innerHTML = user.username
    })
    loversCount.innerHTML = result.lovers_count

    if (result.user_is_lover) {
        LoverIcon.classList.add('fas')
    } else {
        LoverIcon.classList.add('far')
    }

    let commentsLength = result.comments.length
    showCommentBtn.innerHTML = '<p>댓글 보기 (' + commentsLength + ')</p>'
})

document.getElementById('storyActionLove').addEventListener('click', function (e) {
    requestLoveStory(getCookie('access_token'), getStoryID()).then((result) => {
        e.target.classList.toggle('fas')
        e.target.classList.toggle('far')
        document.getElementById('storyActionLoveCounter').innerHTML = result.lovers_count
    })
})

async function reloadComments(comments) {
    let commentBox = document.getElementById('storyArticleComments')
    commentBox.innerHTML = ''
    for (let i = 0; i < comments.length; i++) {
        let user = await requestUserInfo(getCookie('access_token'), uid=null, url=comments[i].user)
        var a = document.createElement('div')
        a.classList.add('storyArticle__comment')
        var b = document.createElement('div')
        b.classList.add('nametag')
        var c = document.createElement('a')
        c.classList.add('nametag__img')
        c.classList.add('image-cropper')
        c.style.backgroundImage = 'url(' + user.profile_img + ')'
        var d = document.createElement('div')
        d.classList.add('nametag__profile')
        var e = document.createElement('p')
        e.innerHTML = user.username
        e.classList.add('nametag__profile__name')
        var f = document.createElement('p')
        f.innerHTML = dateFormatter(comments[i].created_date)
        f.classList.add('nametag__profile__date')
        var g = document.createElement('div')
        g.classList.add('stroyArticle__comment__content')
        var h = document.createElement('p')
        h.innerHTML = comments[i].content

        d.appendChild(e)
        d.appendChild(f)
        b.appendChild(c)
        b.appendChild(d)
        g.appendChild(h)
        a.appendChild(b)
        a.appendChild(g)

        commentBox.appendChild(a)
    }
}

commentSubmitBtn.addEventListener('click', async function (e) {
    await requestAddComment(getCookie('access_token'), getStoryID(), commentTextarea.value)
    let comments = await requestGetComments(getCookie('access_token'), getStoryID())
    reloadComments(comments)
    showCommentBtn.style.display = 'none'
})

showCommentBtn.addEventListener('click', async function (e) {
    let comments = await requestGetComments(getCookie('access_token'), getStoryID())
    reloadComments(comments)
    showCommentBtn.style.display = 'none'
})