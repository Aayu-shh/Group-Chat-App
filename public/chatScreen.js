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
    reloadedResponse.data.messages.map(x => {
        const messageDiv = document.createElement('div');
        messageDiv.innerText = "" + x.message;
        messageDiv.className = "message my-message";
        document.querySelector(".chat-area").appendChild(messageDiv);
    });

})
