const backendApi = "http://localhost:3000";

document.addEventListener('submit', async e => {
    e.preventDefault();
    try {
        let response = await axios.post(`${backendApi}/user/login`, { email: e.target.email.value, password: e.target.password.value });
        // console.log(response);
        if (response.data.token) {
            window.localStorage.setItem("token", response.data.token);
            window.localStorage.setItem("userId", response.data.userId);
            alert("Login Success")
            window.location.href = 'chatScreen.html'; //TODO : try sending url from Backend with success
        }
        else {
            alert("login failed, try again!")
        }
    }
    catch (err) {
        if (err.response.status == 401) {
            alert("Wrong Password Entered");
        }
        else if (err.response.status == 404) {
            alert("User Not Found!");
        }
        else {
            alert(err.stack + "\n! Please try again in sometime! ")
        }
    }
})