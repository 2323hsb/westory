let WESTORY_API_BASE_URL = 'http://localhost:8001'

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

const request_story_list = async (access_token) => {
    let results
    try {
        results = await $.ajax({
            headers: {
                Authorization: "Token " + access_token,
            },
            url: WESTORY_API_BASE_URL + "/story",
            type: "GET",
        })
        return results
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            throw 'request_story_list, unauthorize error'
        } else {
            throw 'request_story_list, unknown error'
        }
    }
}

let latestStoryDiv = document.getElementById("stories__latest")

request_story_list(getCookie('access_token')).then((result) => {
    result.forEach(item => {
        var subtitle = item.content.replace(/<[^>]*>/g, '')
        appendLatestStory(item.title, subtitle.substring(0, 100), '', item.user_username, item.user_profile_img, item.created_date)
    });
})

function appendLatestStory(title, subtitle, thumnail, username, profileImg, date) {
    var newItemDiv = document.createElement('div')
    newItemDiv.classList.add('stories__latest__item')

    var itemSummary = document.createElement('div')
    itemSummary.classList.add('stories__latest__item__summary')

    var summaryTitleDiv = document.createElement('div')
    summaryTitleDiv.classList.add('stories__latest__item__summary__titlediv')
    summaryTitleDiv.innerHTML = '<a><h3>' + title + '</h3></a>'

    var summarySubTitleDiv = document.createElement('div')
    summarySubTitleDiv.classList.add('stories__latest__item__summary__subtitlediv')
    summarySubTitleDiv.innerHTML = '<p>' + subtitle + '</p>'

    var summaryAbout = document.createElement('div')
    summaryAbout.classList.add('stories__latest__item__summary__about')

    var aboutProfileImage = document.createElement('a')
    aboutProfileImage.classList.add('image-cropper')
    aboutProfileImage.classList.add('stories__latest__item__summary__about__profileimg')
    aboutProfileImage.style.backgroundImage = 'url(' + profileImg + ')'

    var aboutInfoDiv = document.createElement('div')
    var aboutUsername = document.createElement('p')
    var aboutUsernameLink = document.createElement('a')
    aboutUsername.classList.add('stories__latest__item__summary__about__name')
    aboutUsernameLink.innerHTML = username
    aboutUsername.appendChild(aboutUsernameLink)

    var aboutDate = document.createElement('p')
    aboutDate.classList.add('stories__latest__item__summary__about__date')
    aboutDate.innerHTML = date
    aboutInfoDiv.appendChild(aboutUsername)
    aboutInfoDiv.appendChild(aboutDate)

    var summaryThumnail = document.createElement('a')
    summaryThumnail.classList.add('stories__latest__item__img')

    summaryAbout.appendChild(aboutProfileImage)
    summaryAbout.appendChild(aboutInfoDiv)
    itemSummary.appendChild(summaryTitleDiv)
    itemSummary.appendChild(summarySubTitleDiv)
    itemSummary.appendChild(summaryAbout)
    newItemDiv.appendChild(itemSummary)
    newItemDiv.appendChild(summaryThumnail)

    latestStoryDiv.appendChild(newItemDiv)
}