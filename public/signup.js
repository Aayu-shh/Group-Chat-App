const backendApi = "http://localhost:3000";
document.addEventListener('submit', async (e) => {
    e.preventDefault();
    //console.log("NAME: " + document.getElementById('name').value);     console.log("email: " + document.getElementById('email').value);    console.log("phone: " + document.getElementById('phone').value);    console.log("password: " + document.getElementById('pass').value);
    try {
        const target = e.target;
        let response = await axios.post(`${backendApi}/user/signup`, { name: target.name.value, email: target.email.value, phone: target.phone.value, password: target.pass.value });
        console.log(response);
        if (response.status == 200) alert("Successfuly signed up!");
    }
    catch (err) {
        if (err.response.data.error.at(0) == "email must be unique") {
            alert("User already exists, Please Login!")
        }
        else {
            let errMsg = "";
            err.response.data.error.forEach(element => {
                errMsg += element + "\n";
            });
            alert(errMsg);
        }
    }
})