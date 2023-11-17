const form = document.getElementById("login-form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const error = document.getElementById("error");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
            }),
        });
    } catch (error) {
        console.log(error);
    }
});
