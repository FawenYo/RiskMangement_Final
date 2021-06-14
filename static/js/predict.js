var DOMAIN = "";
var paragraph = "";
var question = "";

$(document).ready(function() {
    $("#predictBtn").click(function() {
        $(this).prop('disabled', true);
        $(this).css("display", "none");
        $("#loading_anim").css("display", "inline-block");
        paragraph = $("#paragraph").val()
        question = $("#question").val()
        getServer();
    });
});

function getServer() {
    let URL = "./api/get_server"

    $.ajax({
        url: URL,
        method: "GET",
        success: function(data) {
            DOMAIN = data.server_url
            predict();
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: '很抱歉！',
                text: '無法取得伺服器位置，請稍後再試！',
                showCancelButton: false,
                confirmButtonText: '確定',
            })
            init();
        }
    });
}


function predict() {

    let sendData = {
        "QUESTION_TEXT": question,
        "PARAGRAPH_TEXT": paragraph,
        "advanced": false
    };

    const requestOptions = {
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendData),
        mode: 'cors'
    };

    let URL = DOMAIN + "/api/predict"

    fetch(URL, requestOptions)
        .then(response => response.json())
        .then((data) => {
            show_text = `<font color="red">預測結果：</font>${data.answer}<br><font color="grey">耗時：${data.execution}秒</font>`
            init()
            Swal.fire({
                icon: 'success',
                title: '預測結果',
                html: show_text,
                showLoaderOnConfirm: true,
                showCancelButton: true,
                cancelButtonColor: '#00b900',
                confirmButtonText: '使用其他模型預測',
                cancelButtonText: '確定',
                preConfirm: () => {
                    let sendData = {
                        "QUESTION_TEXT": question,
                        "PARAGRAPH_TEXT": paragraph,
                        "advanced": true
                    };

                    const requestOptions = {
                        method: 'POST',
                        header: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(sendData),
                        mode: 'cors'
                    };

                    let URL = DOMAIN + "/api/predict"

                    return fetch(URL, requestOptions)
                        .then(response => response.json())
                        .then((data) => {
                            show_text = `<font color="red">預測結果：</font>${data.answer}<br><font color="grey">耗時：${data.execution}秒</font>`
                            init()
                            Swal.fire({
                                icon: 'success',
                                title: '預測結果',
                                html: show_text,
                                showCancelButton: false,
                                cancelButtonText: '確定',
                            })
                        })
                        .catch((error) => {
                            console.log(error)
                            Swal.fire({
                                icon: 'error',
                                title: '很抱歉！',
                                text: '發生錯誤，請稍後再試！',
                                showCancelButton: false,
                                confirmButtonText: '確定',
                            })
                            init();
                        });
                },
            })
        })
        .catch((error) => {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: '很抱歉！',
                text: '發生錯誤，請稍後再試！',
                showCancelButton: false,
                confirmButtonText: '確定',
            })
            init();
        });
}

function init() {
    $("#predictBtn").prop('disabled', false);
    $("#predictBtn").css("display", "inline");
    $("#loading_anim").css("display", "none");
}