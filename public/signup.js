const backendApi = "http://localhost:9080";
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
     //console.log("NAME: " + document.getElementById('name').value);     console.log("email: " + document.getElementById('email').value);    console.log("phone: " + document.getElementById('phone').value);    console.log("password: " + document.getElementById('pass').value);
    try {
        const target = e.target;
        let response = await axios.post(`${backendApi}/user/signUp`, { name: target.name.value, email: target.email.value, phone: target.phone.value, password: target.pass.value });
        console.log(response);
    }
    catch (err) {
        console.log(err);
    }
})