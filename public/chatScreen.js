const backendApi = "http://localhost:3000";

const message = document.querySelector('.message-input');
document.querySelector('.send-button').onclick = async (e) => {
    let myMessage = message.value;
    try {
        const response = await axios.post(`${backendApi}/user/chat`, { message: myMessage }, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        });
        message.value = "";
        console.log("Message posted success? :" + response.data.success);
    }
    catch (err) {
        console.log(err);
    }
}

document.addEventListener('DOMContentLoaded', async e => {

    const reloadedResponse = await axios.get(`${backendApi}/user/loadmessages`, {
        headers: {
            "Authorization": localStorage.getItem("token")
        }
    })
    let messageNum = 0;
    reloadedResponse.data.messages.map(x => {
        messageNum = messageNum + 1;
        const messageDiv = document.createElement('div');
        messageDiv.innerText = "" + x.message;
        if (x.userId == localStorage.getItem('userId')) {
            messageDiv.className = "message my-message";
        }
        else {
            messageDiv.className = "message user-message";
        }
        document.querySelector(".chat-area").appendChild(messageDiv);
    });
    localStorage.setItem('messageNum', messageNum);
    setInterval(() => callAPI(), 1000);
})

async function callAPI() {
    const reloadedResponse = await axios.get(`${backendApi}/user/newMessage?numOfMessages=${localStorage.getItem('messageNum')}`, {
        headers: {
            "Authorization": localStorage.getItem("token")
        }
    })
    if (!reloadedResponse.data.error) {
        if (reloadedResponse.data.count) {
            reloadedResponse.data.newMessages.map(x => {
                const messageDiv = document.createElement('div');
                messageDiv.innerText = "" + x.message;
                if (x.userId == localStorage.getItem('userId')) {
                    messageDiv.className = "message my-message";
                }
                else {
                    messageDiv.className = "message user-message";
                }
                document.querySelector(".chat-area").appendChild(messageDiv);
                let currentNum = parseInt(localStorage.getItem('messageNum'));
                localStorage.setItem('messageNum', currentNum + 1);

            })
        }
    }
    else {
        window.location.reload();
    }
}
