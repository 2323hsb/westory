let WESTORY_API_BASE_URL = 'http://localhost:8001'

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
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    window.location.reload()
}

function changeLoginState(isLogin) {
    if (isLogin) {
        document.getElementById('headerLogin').classList.toggle('display-block')
    } else {
        document.getElementById('headerNotLogin').classList.toggle('display-block')
    }
}

let loginBtn = document.getElementById('headerLoginBtn')
loginBtn.addEventListener('click', async () => {
    try {
        let googleAccount = await getGoogleUser();
        var response = await loginWithGoogleAccount(googleAccount)
        if (response.access_token && response.user_id) {
            document.cookie = "access_token=" + response.access_token + "; " + "path=/"
            document.cookie = "ws_uid=" + response.user_id + "; " + "path=/"
        } else {
            // 수정 필요
            await signUpWithGoogleAccount(googleAccount)
            response = await loginWithGoogleAccount(googleAccount)
            if (response.access_token && response.user_id) {
                document.cookie = "access_token=" + response.access_token + "; " + "path=/"
                document.cookie = "ws_uid=" + response.user_id + "; " + "path=/"
            }
        }
        window.location.reload()
    } catch (message) {
        console.log(message)
    }
})

let logoutBtn = document.getElementById('logout_btn')
logoutBtn.addEventListener('click', () => {
    deleteCookie('access_token')
    deleteCookie('ws_uid')
    // window.location.replace('/')
})

const gapiAuthInitVal = { client_id: '877944658856-1tr4gmmtc8nm4ur7m1p3jv2e9omm8fo3.apps.googleusercontent.com', }
const gapiAuthScope = { scope: 'profile email', }
function getGoogleUser() {
    return new Promise((resolve, reject) => {
        gapi.load('auth2', _ => {
            gapi.auth2.init(gapiAuthInitVal)
                .then(_ => {
                    gapi.auth2.getAuthInstance().signIn(gapiAuthScope)
                        .then((googleUser) => { resolve(googleUser) })
                        .catch((error) => { reject(error) })
                })
                .catch((error) => { reject(error) })
        })
    })
}

function loginWithGoogleAccount(googleUser) {
    return new Promise((resolve, reject) => {
        var payload = {
            id_token: googleUser.getAuthResponse().id_token,
        }
        $.ajax({
            headers: {
                accept: "application/json",
            },
            url: WESTORY_API_BASE_URL + '/auth/signIn',
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload),
            dataType: "json"
        }).done((response) => {
            resolve(response)
        }).fail((error) => {
            reject('Network or Server Error: ' + error)
        })
    })
}

function signUpWithGoogleAccount(googleUser) {
    return new Promise((resolve, reject) => {
        var payload = {
            id_token: googleUser.getAuthResponse().id_token,
        }
        $.ajax({
            headers: {
                accept: "application/json",
            },
            url: WESTORY_API_BASE_URL + '/auth/signUpWithGoogle',
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload),
            dataType: "json"
        }).done((response) => {
            resolve(response)
        }).fail((error) => {
            reject('Network or Server Error: ' + error)
        })
    })
}

function requestUserInfo(access_token, uid=null, url=null) {
    if(uid==null && url==null) {
        return null
    }
    var target_url
    if(url) {
        target_url = url
    }
    if(uid) {
        target_url = WESTORY_API_BASE_URL + "/user/" + uid
    }
    var headers = {
        accept: "application/json; charset=utf-8",
    }
    if (access_token) {
        headers['Authorization'] = "Token " + access_token
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            headers: headers,
            url: target_url,
            type: "GET",
        }).done((response) => {
            resolve(response)
        }).fail((error) => {
            reject(error)
        })
    })
}

function setProfileUI(user) {
    let profileImage = document.getElementById('header__profileimg')
    profileImage.style.backgroundImage = 'url(' + user.profile_img + ')'
    profileImage.addEventListener('click', function () {
        document.getElementById("profile-dropdown").classList.toggle("display-block");
    })
}

if (getCookie('access_token') && getCookie('ws_uid')) {
    requestUserInfo(getCookie('access_token'), uid=getCookie('ws_uid'))
        .then((user) => {
            changeLoginState(true)
            setProfileUI(user)
        })
        .catch((message) => {
            changeLoginState(false)
        })
} else {
    changeLoginState(false)
}


// 드롭다운 메뉴 관련
window.onclick = function (event) {
    if (!event.target.matches('.dropdown-btn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('display-block')) {
                openDropdown.classList.remove('display-block');
            }
        }
    }
}