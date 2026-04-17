const URL = 'http://127.0.0.1:5000';

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
