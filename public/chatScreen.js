const backendApi = "http://localhost:3000";

const message = document.querySelector('.message-input');
const newGroupBtn = document.getElementById("newGroupBtn");
const newGrpDiv = document.querySelector('.newGrpDiv');

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
    let lastMsgId = localStorage.getItem('lastMsgId') || 0;
    let totalMsgNum = localStorage.getItem('totalMsgNum') || 0;
    const reloadedResponse = await axios.get(`${backendApi}/user/loadmessages?lastMsgId=${lastMsgId}`, {
        headers: {
            "Authorization": localStorage.getItem("token")
        }
    })

    //Main Problem -> Heavy loading if Message volume too much
    // In Cases where local storage has all messages from DB and DB returns empty response
    if (reloadedResponse.data.count == 0 && lastMsgId > 0) {
        for (let i = 1; i <= localStorage.getItem("totalMsgNum"); i++) {
            const localMessageObj = JSON.parse(localStorage.getItem(`message${i}`));
            addMessageToScreen(localMessageObj);
        }
    }
    else {
        reloadedResponse.data.messages.map(x => {
            lastMsgId = x.id;
            localStorage.setItem(`message${++totalMsgNum}`, JSON.stringify(x));
            addMessageToScreen(x);
        });
    }

    localStorage.setItem('lastMsgId', lastMsgId);
    localStorage.setItem('totalMsgNum', totalMsgNum);
    setInterval(() => callAPI_ById(), 1000);
})


// To get Messages with ID greater than currentId based on messageId
async function callAPI_ById() {
    let totalMsgNum = localStorage.getItem('totalMsgNum');
    const reloadedResponse = await axios.get(`${backendApi}/user/newMessage?lastMsgId=${localStorage.getItem("lastMsgId") || 0}`, {
        headers: {
            "Authorization": localStorage.getItem("token")
        }
    })
    if (!reloadedResponse.data.error) {
        if (reloadedResponse.data.count) {
            reloadedResponse.data.newMessages.map(x => {
                lastMsgId = x.id;
                addMessageToScreen(x);
                localStorage.setItem(`message${++totalMsgNum}`, JSON.stringify(x));
            })
            localStorage.setItem('lastMsgId', lastMsgId);
            localStorage.setItem('totalMsgNum', totalMsgNum);
        }
    }
    else {
        window.location.reload();
    }
}

newGroupBtn.onclick = () => {
    try {
        newGroupBtn.remove();
        newGrpDiv.innerHTML = `<label>Group Name:</label>
                                        <input type="text" class="groupName">
                                        <button class="create">Create Group</button>`
        document.querySelector('.create').onclick = async () => {
            let enteredGrpName = document.querySelector('.groupName').value.trim();
            console.log(enteredGrpName);
            const grpNameResp = await axios.post(`${backendApi}/user/group/create`, { groupName: `${enteredGrpName}` }, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            console.log(grpNameResp);
            newGrpDiv.remove();
        }

    }
    catch (err) {
        console.log(err);
    }
}

function addMessageToScreen(messageObj) {
    const messageDiv = document.createElement('div');
    messageDiv.innerText = "" + messageObj.message;
    if (messageObj.userId == localStorage.getItem('userId')) {
        messageDiv.className = "message my-message";
    }
    else {
        messageDiv.className = "message user-message";
    }
    document.querySelector(".chat-area").appendChild(messageDiv);
}
