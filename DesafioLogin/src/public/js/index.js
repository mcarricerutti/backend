const socketClient = io();

//Elementos
const nombreUser = document.getElementById("nombreUsuario");
const formulario = document.getElementById("formulario");
const inputMensaje = document.getElementById("mensaje");
const inputChat = document.getElementById("chat");

let user = null;

if (!user) {
  Swal.fire({
    title: "Bienvenido",
    text: "Ingresa tu usuario",
    input: "text",
    inputValidator: (value) => {
      if (!value) {
        return "Necesitas ingresar un usuario";
      }
    },
  }).then((username) => {
    user = username.value;
    nombreUser.innerText = user;
    socketClient.emit("newUser", user);
  });
}

formulario.onsubmit = (e) => {
  e.preventDefault();

  const info = {
    nombre: user,
    mensaje: inputMensaje.value,
  };

  socketClient.emit("mensaje", info);
  inputMensaje.value = '';

  const option = {
    method: 'POST',
    headers:{
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(info)
  }

  fetch("/api/mensaje", option)
  .then(response => {
    if (response.ok)
        console.log(response)
    else
        throw new Error(response.status);
})
    .catch(err =>{
      console.log('Error: ', err.message)
    })




};

socketClient.on("chat", (mensaje) => {
  console.log(mensaje);
  const chatRender = mensaje.map(elem => {
    return `<div class='mensajeRender'>
              <p>
                <strong>${elem.nombre}:</strong> 
                  <br>${elem.mensaje}
              </p>
            </div>
             `
  }).join(' ')
  inputChat.innerHTML = chatRender
});

socketClient.on('broadcast', user=>{
  console.log(`Usuario conectado: ${user}`)
  Toastify({
    text: `Ingreso ${user} al chat`,
    duration: 5000,
    position: 'rigth',
    style:{
      backgrount: 'linear-gradient(to right, #00b09b, #96c93d) '
    }
  }).showToast()
})

// products

let addProduct = document.getElementById("formulario");
let listProduct = document.getElementById("list");

const formInput = [...document.getElementsByClassName("form")];

addProduct.addEventListener("submit", (e) => {
  e.preventDefault();
  let productosAdd = {
    title: formInput[0].value,
    description: formInput[1].value,
    code: formInput[2].value,
    precio: parseInt(formInput[3].value),
    status: formInput[4].value,
    category: formInput[5].value,
    thumbnail: formInput[6].value,
  };

  const typeMethod = {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(productosAdd),
  };

  fetch("/api/products", typeMethod)
    .then((response) => {
      if (response.ok) console.log(response);
      else throw new Error(response.status);
    })
    .catch((err) => {
      console.error("ERROR: ", err.message);
    });

    socketClient.emit("prod", { title : productosAdd.title , precio: productosAdd.precio })
    socketClient.on("productoFromForm", (productsListArray) => {
        let listToRender = "";

        productsListArray.forEach(product => {
            listToRender += `Producto: ${product.title} </br>
            Precio: $${parseInt(product.precio)} </br> `
        });

        listProduct.innerHTML = listToRender
    })
});


let formDeleteProducts = document.getElementById("deleteForm");
let inputDeleteByIdProduct = document.getElementById("pID");

formDeleteProducts.addEventListener("submit",(e)=>{
  e.preventDefault()

  let deleteProdutc = inputDeleteByIdProduct.value
  let direc = "/api/products/" + deleteProdutc

  const typeMethod = {
    method : "DELETE",
    headers:{'Content-type': 'application/json; charset=UTF-8',}
  }

  fetch(direc, typeMethod)
    .then(response =>{
      if(response.ok){
        console.log(response)
      } else{
        throw new Error(response.status);
      }
    })
    .then(socketClient.emit("prodDelete",{id: deleteProdutc}))
    .catch(error =>{
      console.log(error)
    })

    socketClient.on("prodDeletelist", (obj)=>{
      let listNew = ""

      obj.forEach(pDelete =>{
        listNew += `Producto: ${pDelete.title} </br>
        Precio: $${pDelete.precio} </br>
        </br>`
      })

      listProduct.innerHTML = listNew

    })
})

//Agregar prod a carrito por POSTMAN
const addToCart= async (pid)=>{
  try {
      const response= await fetch(`http://localhost:4000/api/carts/64720463593e5253c5d05510/product/${pid}`,{
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({"quantity": 1}),
      });
      console.log('Completed!', response);
  } catch (error) {
      console.error(`Error: ${error}`);
  }
};
