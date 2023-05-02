console.log("Welcome to the frontend");
const login = async (email, password) => {
    console.log(email, password);
    try {
        const res = await axios({
            method: "POST",
            url: "/auth/login",
            data: {
                email,
                password,
            },
        });
        console.log(res);

        window.location.href = "/view";
    } catch (err) {
        console.error(err.response.data);
    }
};

document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
});