var DOMAIN = "";
var paragraph = "";
var question = "";

$(document).ready(function() {
    // Get server IP every 5 seconds
    window.setInterval((() => {
        getServer();
    }), 5000)

    $("#predictBtn").click(function() {
        $(this).prop('disabled', true);
        $(this).css("display", "none");
        $("#loading_anim").css("display", "inline-block");
        paragraph = $("#paragraph").val()
        question = $("#question").val()
        predictGPU();
    });

    $("#predictBtn2").click(function() {
        $(this).prop('disabled', true);
        $(this).css("display", "none");
        $("#loading_anim2").css("display", "inline-block");
        paragraph = $("#paragraph").val()
        question = $("#question").val()
        predictHF();
    });
});

function getServer() {
    let URL = "./api/get_server"

    $.ajax({
        url: URL,
        method: "GET",
        success: function(data) {
            DOMAIN = data.server_url
        },
    });
}

function predictGPU() {
    let start = new Date();

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
            let end = new Date();
            show_text = `<font color="red">預測結果：</font>${data.answer}<br><font color="grey">耗時：${(end-start)/1000}秒</font>`
            init(true)
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
                            init(true)
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
                            init(true);
                        });
                },
            })
        })
        .catch((error) => {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: '很抱歉！',
                text: '伺服器目前為離線狀態！',
                showCancelButton: false,
                confirmButtonText: '確定',
            })
            init(true);
        });
}

function predictHF() {
    let start = new Date();
    let sendData = { "inputs": { "question": question, "context": paragraph } };

    const requestOptions = {
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendData),
        mode: 'cors'
    };

    let URL = "https://api-inference.huggingface.co/models/uer/roberta-base-chinese-extractive-qa"

    fetch(URL, requestOptions)
        .then(response => response.json())
        .then((data) => {
            let end = new Date();
            show_text = `<font color="red">預測結果：</font>${data.answer}<br><font color="grey">耗時：${(end-start)/1000}秒</font>`
            init(false)
            Swal.fire({
                icon: 'success',
                title: '預測結果',
                html: show_text,
                showCancelButton: false,
                confirmButtonText: '確定',
            })
        })
        .catch((error) => {
            init(false)
            Swal.fire({
                icon: 'error',
                title: '超過使用次數，請稍後再試！',
                showCancelButton: false,
                confirmButtonText: '確定',
            })
        })
}

function init(fastModel) {
    if (fastModel) {
        $("#predictBtn").prop('disabled', false);
        $("#predictBtn").css("display", "inline");
        $("#loading_anim").css("display", "none");
    } else {
        $("#predictBtn2").prop('disabled', false);
        $("#predictBtn2").css("display", "inline");
        $("#loading_anim2").css("display", "none");
    }
}