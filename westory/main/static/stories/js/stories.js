function requestStories(url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            headers: {
                accept: "application/json; charset=utf-8",
            },
            url: url,
            type: "GET",
        }).done((response) => {
            resolve(response)
        }).fail((error) => {
            reject('Network or Server Error: ' + error)
        })
    })
}

let latestStoryDiv = document.getElementById("stories__latest")
let moreStoryBtn = document.getElementById('stories__more')

async function loadStories(url) {
    result = await requestStories(url)
    stories = result.results
    for (let i = 0; i < stories.length; i++) {
        var user = await requestUserInfo(getCookie('access_token'), null, stories[i].user)
        var subtitle = stories[i].content.replace(/<[^>]*>/g, '')
        var thumnailImageUrls = findAllImageSrc(stories[i].content)
        appendLatestStory(getLastUrl(stories[i].url), stories[i].title, subtitle.substring(0, 300), thumnailImageUrls[0], user.username, user.profile_img, stories[i].created_date, stories[i].view_count)
    }
    return [result.next, result.previous]
}

function getLastUrl(url) {
    return url.split('/')[4]
}

function appendLatestStory(storyUrl, title, subtitle, thumnailUrl, username, profileImg, date, viewCount) {
    var newItemDiv = document.createElement('div')
    newItemDiv.classList.add('stories__latest__item')

    var itemSummary = document.createElement('div')
    itemSummary.classList.add('stories__latest__item__summary')

    var summaryTitleDiv = document.createElement('div')
    summaryTitleDiv.classList.add('stories__latest__item__summary__titlediv')
    summaryTitleDiv.innerHTML = '<a href="/stories/' + storyUrl + '"><h3>' + title + '</h3></a>'

    var summarySubTitleDiv = document.createElement('div')
    summarySubTitleDiv.classList.add('stories__latest__item__summary__subtitlediv')
    summarySubTitleDiv.innerHTML = '<p><a href="/stories/' + storyUrl + '">' + subtitle + '</a></p>'

    var summaryAbout = document.createElement('div')
    summaryAbout.classList.add('stories__latest__item__summary__about')

    var aboutProfileImage = document.createElement('a')
    aboutProfileImage.classList.add('image-cropper')
    aboutProfileImage.classList.add('stories__latest__item__summary__about__profileimg')
    aboutProfileImage.style.backgroundImage = 'url(' + profileImg + ')'

    var aboutInfoDiv = document.createElement('div')
    aboutInfoDiv.classList.add('stories__latest__item__summary__about__profiletxt')
    var aboutUsername = document.createElement('p')
    var aboutUsernameLink = document.createElement('a')
    aboutUsername.classList.add('stories__latest__item__summary__about__profiletxt__name')
    aboutUsernameLink.innerHTML = username
    aboutUsername.appendChild(aboutUsernameLink)

    var aboutDate = document.createElement('p')
    aboutDate.classList.add('stories__latest__item__summary__about__profiletxt__additional')
    aboutDate.innerHTML = dateFormatter(date) + " "
    var aboutView = document.createElement('span')
    aboutView.classList.add('stories__latest__item__summary__about__profiletxt__additional__viewcount')
    aboutView.innerHTML = "<i class='far fa-eye'></i> " + viewCount
    aboutDate.appendChild(aboutView)

    aboutInfoDiv.appendChild(aboutUsername)
    aboutInfoDiv.appendChild(aboutDate)

    var summaryThumnail = document.createElement('a')
    summaryThumnail.classList.add('stories__latest__item__img')
    summaryThumnail.href = "/stories/" + storyUrl
    if (thumnailUrl != null) {
        summaryThumnail.style.backgroundImage = 'url(' + thumnailUrl + ')'
    }

    summaryAbout.appendChild(aboutProfileImage)
    summaryAbout.appendChild(aboutInfoDiv)
    itemSummary.appendChild(summaryTitleDiv)
    itemSummary.appendChild(summarySubTitleDiv)
    itemSummary.appendChild(summaryAbout)
    newItemDiv.appendChild(itemSummary)
    newItemDiv.appendChild(summaryThumnail)

    latestStoryDiv.appendChild(newItemDiv)
}

function findAllImageSrc(content) {
    var m, urls = [], rex = /<img[^>]+src="?([^"\s]+)/g;
    while (m = rex.exec(content)) {
        urls.push(m[1]);
    }
    return urls
}

$(window).scroll(function () {
    var _docHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;
    if (_docHeight == window.pageYOffset + window.innerHeight) {
        if (nextStoryURL != null) {
            moreStoryBtn.style.display = 'block'
        }
    }
});

moreStoryBtn.addEventListener('click', function (e) {
    if (nextStoryURL) {
        loadStories(nextStoryURL).then((result) => {
            nextStoryURL = result[0]
            if (nextStoryURL == null) {
                moreStoryBtn.style.display = 'none'
            }
        })
    }
})

var nextStoryURL = WESTORY_API_BASE_URL + "/stories"
loadStories(nextStoryURL).then((result) => {
    nextStoryURL = result[0]
})
