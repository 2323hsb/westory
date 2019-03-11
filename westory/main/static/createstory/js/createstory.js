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

const request_uploadImage = async (access_token, image) => {
    var data = new FormData()
    data.append("image", image)
    let results
    try {
        results = await $.ajax({
            headers: {
                Authorization: "Token " + access_token,
            },
            url: WESTORY_API_BASE_URL + "/uploadImage",
            type: "POST",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
        })
        return results
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            throw 'request_uploadImage, unauthorize error'
        } else {
            throw 'request_uploadImage, unknown error'
        }
    }
}

const request_upload_story = async (access_token, title, content) => {
    let results
    try {
        results = await $.ajax({
            headers: {
                Authorization: "Token " + access_token,
            },
            url: WESTORY_API_BASE_URL + "/story",
            type: "POST",
            data: {
                title: title,
                content: content,
            },
        })
        return results
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            throw 'request_upload_story, unauthorize error'
        } else {
            throw 'request_upload_story, unknown error'
        }
    }
}

var container = document.getElementById('quill_editor')
var imageButton = document.getElementById('editor-section__tools__btn__camera')

var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote'],

    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],

    [{ 'size': ['small', false, 'large', 'huge'] }],

    [{ 'color': [] }],
    [{ 'align': [] }],

    ['clean']
];

let quill = new Quill('#quill_editor', {
    placeholder: '당신의 이야기를 들려주세요',
    theme: 'bubble',
    modules: {
        toolbar: toolbarOptions
    }
});

imageButton.addEventListener('click', function () {
    var fileInput = document.querySelector('input.ql-image[type=file]');
    if (fileInput == null) {
        fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
        fileInput.classList.add('ql-image');
        fileInput.addEventListener('change', function () {
            if (fileInput.files != null && fileInput.files[0] != null) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    request_uploadImage(getCookie("access_token"), fileInput.files[0]).then((result) => {
                        let savedUrl = result.image
                        var range = quill.getSelection(true);
                        quill.insertEmbed(range.index, 'image', savedUrl);
                        fileInput.value = "";
                    })
                };
                reader.readAsDataURL(fileInput.files[0]);
            }
        });
        container.appendChild(fileInput);
    }
    fileInput.click();
})

var completeButton = document.getElementById('editor-section__control__completebtn')
var titleInput = document.getElementById('editor-section__title')

// var delta
completeButton.addEventListener('click', function () {
    var title = titleInput.value
    var content = quill.root.innerHTML

    request_upload_story(getCookie('access_token'), title, content).then((result) => {
        console.log(result)
    })
    // displaySettingsPage(title, content)
})

function displaySettingsPage(title, content) {
    let editorSection = document.getElementById('editor-section')
    let settingsSection = document.getElementById('settings-section')
    let settingsTitle = document.getElementById('settings-section__title')
    let settingsSubTitle = document.getElementById('settings-section__subtitle')
    let settingsThumnailbox = document.getElementById('settings-section__thumnail-selection')

    settingsTitle.innerHTML = "<h3>" + title + "</h3>"
    settingsSubTitle.value = content.replace(/<[^>]*>/g, '').substring(0, 100)
    var srcList = findAllImageSrc(content)
    settingsThumnailbox.innerHTML

    editorSection.style.display = 'none'
    settingsSection.style.display = 'block'
}

function findAllImageSrc(content) {
    var m, urls = [], rex = /<img[^>]+src="?([^"\s]+)"?\s*\>/g;
    while (m = rex.exec(content)) {
        urls.push(m[1]);
    }
    return urls
}