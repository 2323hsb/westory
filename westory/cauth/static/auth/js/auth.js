let WESTORY_API_BASE_URL = 'http://localhost:8001'

function onGoogleJSLoaded() {
    var access_token = getCookie('access_token')
    if (access_token) {
        window.location.replace('/main/posts')
    } else {
        set_google_auth_btn_listener()
    }
}

function set_google_auth_btn_listener() {
    gapi.load('auth2', function () {
        gapi.auth2.init({
            client_id: '877944658856-1tr4gmmtc8nm4ur7m1p3jv2e9omm8fo3.apps.googleusercontent.com'
        }).then(
            function () {
                var authInstance = gapi.auth2.getAuthInstance()
                $('.authbox__buttons__google').on('click', function () {
                    authInstance.signIn({
                        scope: 'profile email',
                    }).then(function (googleUser) {
                        var id_token = googleUser.getAuthResponse().id_token;
                        var payload = {
                            id_token: id_token,
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
                        }).done(function (response) {
                            switch (response.status) {
                                case 'success':
                                    document.cookie = "access_token=" + response.access_token
                                    window.location.replace('/main/posts')
                                    break
                                case 'new':
                                    console.log("user not exist!")
                                    signUpWithGoogle(id_token)
                                    break
                                case 'fail':
                                    console.log(response)
                                    break
                            }
                        }).fail(function (error) {
                            console.log(error)
                        })
                    })
                })
            }, function () {
                console.log('onError')
            })
    });
}

function signUpWithGoogle(id_token) {
    var payload = {
        id_token: id_token,
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
    }).done(function (response) {
        switch (response.status) {
            case 'success':
                console.log(response)
                break
            case 'fail':
                console.log(response)
                break
        }
    }).fail(function (error) {
        console.log('we got error')
        // console.log(error)
    })
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