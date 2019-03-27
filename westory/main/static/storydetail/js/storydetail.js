// const requestStoryByID = async (accessToken, storyID) => {
//     let results
//     try {
//         results = await $.ajax({
//             headers: {
//                 Authorization: "Token " + accessToken,
//             },
//             url: WESTORY_API_BASE_URL + "/story?hash_id=" + storyID,
//             type: "GET",
//         })
//         return results
//     } catch (jqXHR) {
//         if (jqXHR.status == 401) {
//             throw 'requestStoryByID, unauthorize error'
//         } else {
//             throw 'requestStoryByID, unknown error'
//         }
//     }
// }

const requestStoryByID = async (accessToken, storyID) => {
    let results
    try {
        results = await $.ajax({
            headers: {
                Authorization: "Token " + accessToken,
            },
            url: WESTORY_API_BASE_URL + "/story/" + storyID,
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

requestStoryByID(getCookie('access_token'), getStoryID()).then((result) => {
    console.log(result)
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

    var isLover = result[0].is_lover
    if (isLover) {
        LoverIcon.classList.add('fas')
    } else {
        LoverIcon.classList.add('far')
    }

    LoverIcon.addEventListener('click', function (e) {
        requestLoveStory(getCookie('access_token'), getStoryID(), !isLover).then((result) => {
            isLover = !isLover
            LoverIcon.classList.toggle('fas')
            LoverIcon.classList.toggle('far')
            loversCount.innerHTML = result.lovers_count
        })
    })

    getComments(document.getElementById('storyArticleComments'))
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