URL = 'https://refactored-sniffle-4wp7px575x4f7756-5000.app.github.dev';

document.getElementById("userForm").addEventListener("submit",async(e)=>{
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const response = await fetch(`${URL}/user`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({name,email})
    })

    const data = await response.json();
    console.log("USER INSTERTED.......!",data);
});