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
            console.log(id);
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

socket.on('server:deleteProduct', (updatedProducts)=>{
    LoadProducts(updatedProducts)
})


// CHAT ----------------------------------------------------------------------------
const bottonChat= document.getElementById('bottonChat');
const val= document.getElementById('chatBox');
const parrafosMensajes= document.getElementById('parrafoMensajes');

let user

//if url contains chat
if(window.location.href.includes('chat')){
Swal.fire({
    text: "Ingresa tu usuario",
    input: "text",
    allowOutsideClick: false,
    inputValidator: (value) => {
      if (!value) {
        return "Necesitas ingresar un usuario";
      }
    }
}).then((result)=>{
    user=result.value;
    console.log(user);
    socket.emit('client:onLoadMessages');
});
};

bottonChat.addEventListener('click', ()=>{
    if(val.value.trim().length>0){
        socket.emit('client:messageSent', {user:user, message:val.value});
        val.value="";
    }
});

socket.on("server:messageStored", (arrayMensajes)=>{
    messageLoad(arrayMensajes)
});
socket.on("server:onLoadMessages", (arrayMensajes)=>{
    messageLoad(arrayMensajes)
});


messageLoad=(arrayMensajes)=>{
    parrafosMensajes.innerHTML="";
    arrayMensajes.forEach(message => {
        const d=new Date(message.date);
        const datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
        parrafosMensajes.innerHTML+=`<p><strong>${message.user}</strong>: ${message.message} <br> ${datestring}<br><br></p>`
    });
};