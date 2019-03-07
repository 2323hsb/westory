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

let lastestStoryDiv = document.getElementById("stories__latest")

request_story_list(getCookie('access_token')).then((result) => {
    var new_item_div = document.createElement('div')
    lastestStoryDiv.appendChild()

})