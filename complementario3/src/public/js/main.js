// La carpeta publica es el cliente
const socket= io();

//socket.emit() //enviar eventos
//socket.on() //escuchar eventos


const formulario= document.getElementById('formulario');
formulario?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const formdata= new FormData(formulario)
    const product=Object.fromEntries(formdata);//Transforma el FormData en un objeto
    //console.log(product);
    socket.emit('client:newproduct', product);
    formulario.reset();
})

//Cargar productos
LoadProducts=(products)=>{
    const productlist=document.getElementById('product-list');
    productlist.innerHTML='';
    products.forEach(product => {
        const productli=document.createElement('li');
        Object.entries(product).forEach(([key, value])=>{productli.innerHTML+=`<p><strong>${key}:</strong> ${value}</p>`})
        productli.innerHTML+=`<button class="delete" data-id="${product._id}">Borrar</button>`
        productli.innerHTML+=`<br>`
        productlist?.appendChild(productli);

        //Listener al boton delete
        const btnDelete= productli.querySelector('.delete');
        btnDelete.addEventListener('click', (e)=>{
            const id=e.target.dataset.id;
            // console.log(id);
            socket.emit('client:deleteProduct', id);
        })
    });
}

socket.on('server:onloadProducts', (Products)=>{
    LoadProducts(Products)
})

socket.on('server:updatedProducts', (updatedProducts)=>{
    LoadProducts(updatedProducts)
})



// CHAT ----------------------------------------------------------------------------
//if url contains chat
if (window.location.href.includes('chat')) {
    const bottonChat = document.getElementById('bottonChat');
    const val = document.getElementById('chatBox');
    const parrafosMensajes = document.getElementById('parrafoMensajes');

    let user

    Swal.fire({
        title: 'Ingresa tu email',
        input: 'email',
        //inputLabel: 'Your email address',
        inputPlaceholder: 'Ingresa tu email',
        allowOutsideClick: false,
    }).then((result) => {
        user = result.value;
        socket.emit('client:onLoadMessages');
    });

    bottonChat.addEventListener('click', () => {
        if (val.value.trim().length > 0) {
            socket.emit('client:messageSent', { user: user, message: val.value });
            val.value = "";
        }
    });

    socket.on("server:messageStored", (arrayMensajes) => {
        messageLoad(arrayMensajes)
    });
    socket.on("server:onLoadMessages", (arrayMensajes) => {
        messageLoad(arrayMensajes)
    });


    messageLoad = (arrayMensajes) => {
        parrafosMensajes.innerHTML = "";
        arrayMensajes.forEach(message => {
            const d = new Date(message.date);
            const datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
            parrafosMensajes.innerHTML += `<p><strong>${message.user}</strong>: ${message.message} <br> ${datestring}<br><br></p>`
        });
    };
};

// Add to CART 

const postButtons=document.querySelectorAll('.postButton');

postButtons.forEach(postButton=>{postButton.addEventListener('click', (e)=>{
    if(e.target.dataset.id===postButton.dataset.id) {
        const cid=document.getElementById('cartId').innerText.split(' ')[2]
        addToCart(postButton.dataset.id,cid).then(()=>window.location.href = `http://localhost:8080/api/carts/${cid}`);
    }
})})

// //Agregar al carrito de ID hardcodeado
// const addToCart= async (pid,cid)=>{

//     try {
//         const URL=`http://localhost:8080/api/carts/${cid}/product/${pid}`;
//         const response= await fetch(URL,{
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({"quantity": 1}),
//         });
//         //console.log('Completed!', response);
//     } catch (error) {
//         console.error(`Error: ${error}`);
//     }
// };

//Delete from CART ----------------------------------------------------------------------------
const deleteButtons=document.querySelectorAll('.deleteButton');
deleteButtons.forEach(deleteButton=>{deleteButton.addEventListener('click', (e)=>{
    if(e.target.dataset.id===deleteButton.dataset.id) {
        deleteFromCart(deleteButton.dataset.id);
        window.location.reload();
    }
} )});

//Eliminar del carrito de ID hardcodeado
const deleteFromCart= async (pid)=>{
//get url
const cid=window.location.href.split("/").pop();
//console.log(cid);
    try {
        const response= await fetch(`http://localhost:8080/api/carts/${cid}/product/${pid}`,{
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        //console.log('Completed!', response);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}
