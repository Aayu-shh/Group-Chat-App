const backendApi = "http://localhost:3000";

document.addEventListener('submit', async e => {
    e.preventDefault();
    let response = await axios.post(`${backendApi}/user/login`, { email: e.target.email.value, password: e.target.password.value });
    console.log(response);
})