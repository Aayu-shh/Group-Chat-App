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
