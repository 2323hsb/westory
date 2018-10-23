function onGoogleJSLoaded() {
    gapi.load('auth2', function () {
        gapi.auth2.init({
            client_id: '877944658856-1tr4gmmtc8nm4ur7m1p3jv2e9omm8fo3.apps.googleusercontent.com'
        }).then(
            function () {
                var authInstance = gapi.auth2.getAuthInstance()
                if (authInstance.isSignedIn.get()) {
                    window.location.replace('http://localhost:8000/home')
                } else {
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
                                url: 'http://127.0.0.1:8001/auth/signIn',
                                type: "POST",
                                contentType: "application/json",
                                data: JSON.stringify(payload),
                                dataType: "json"
                            }).done(function (response) {
                                switch(response.status){
                                    case 'success':
                                        document.cookie = "access_token="+response.access_token
                                        window.location.replace('http://localhost:8000/home')
                                    case 'fail':
                                        break
                                }
                            
                            }).fail(function (error) {
                                console.log(error)
                            })
                        })
                    })
                }
            }, function () {
                console.log('onError')
            })
    });
}