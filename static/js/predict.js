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
            predictGPU();
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
            if ("error" in data) {
                if (data.error == "Rate limit reached. Please log in or use your apiToken") {
                    init(false)
                    Swal.fire({
                        icon: 'error',
                        title: '超過使用次數，請稍後再試！',
                        showCancelButton: false,
                        confirmButtonText: '確定',
                    })

                } else {
                    Swal.fire({
                        title: '正在載入模型...',
                        html: '預估剩餘時間： <b></b> 秒',
                        timer: data.estimated_time * 1000,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading()
                            timerInterval = setInterval(() => {
                                const content = Swal.getHtmlContainer()
                                if (content) {
                                    const b = content.querySelector('b')
                                    if (b) {
                                        b.textContent = parseInt(Swal.getTimerLeft() / 1000) + 1
                                    }
                                }
                            }, 1000)
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        }
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.timer) {
                            fetch(URL, requestOptions)
                                .then(response => response.json())
                                .then((data => {
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
                                }))
                        }
                    })
                }
            } else {
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
            }
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