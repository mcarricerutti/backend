const socket= io();


const formulario= document.getElementById('formulario');
formulario?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const formdata= new FormData(formulario)
    const product=Object.fromEntries(formdata);
    socket.emit('client:newproduct', product);
    formulario.reset();
})

//Cargar productos
LoadProducts=(products)=>{
    console.log("test");
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

