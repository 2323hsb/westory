const request_story_list = async () => {
    let results
    try {
        results = await $.ajax({
            headers: {
                accept: "application/json; charset=utf-8", 
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

request_story_list().then((result) => {
    result.forEach(item => {
        var subtitle = item.content.replace(/<[^>]*>/g, '')
        var thumnailImageUrls = findAllImageSrc(item.content)
        appendLatestStory(item.hash_id, item.title, subtitle.substring(0, 300), thumnailImageUrls[0], item.user_username, item.user_profile_img, item.created_date, item.view_count)
    });
})

function appendLatestStory(hashID, title, subtitle, thumnailUrl, username, profileImg, date, viewCount) {
    var newItemDiv = document.createElement('div')
    newItemDiv.classList.add('stories__latest__item')

    var itemSummary = document.createElement('div')
    itemSummary.classList.add('stories__latest__item__summary')

    var summaryTitleDiv = document.createElement('div')
    summaryTitleDiv.classList.add('stories__latest__item__summary__titlediv')
    summaryTitleDiv.innerHTML = '<a href="/stories/' + hashID + '"><h3>' + title + '</h3></a>'

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
    summaryThumnail.style.backgroundImage = 'url(' + thumnailUrl + ')'

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
    var m, urls = [], rex = /<img[^>]+src="?([^"\s]+)"?\s*\>/g;
    while (m = rex.exec(content)) {
        urls.push(m[1]);
    }
    return urls
}