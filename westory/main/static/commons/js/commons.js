let WESTORY_API_BASE_URL = 'http://localhost:8001'

const request_user_info = async (access_token) => {
    let results
    try {
        results = await $.ajax({
            headers: {
                accept: "application/json",
                Authorization: "Token " + access_token,
            },
            url: WESTORY_API_BASE_URL + "/user",
            type: "GET",
        })
        return results
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            throw 'request_user_info, unauthorize error'
        } else {
            throw 'request_user_info, unknown error'
        }
    }
}

function dateFormatter(date, type = 0) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    hour = d.getHours();
    min = d.getMinutes();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    if (type == 0) {
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
    }
    return year + '년 ' + month + '월 ' + day + '일'
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

function setUserInformations() {
    request_user_info(getCookie('access_token')).then((result) => {
        let profileImage = document.getElementById('header__profileimg')
        profileImage.style.backgroundImage = 'url(' + result[0].profile_img + ')'
    })
}

setUserInformations()