const socketClient = io();

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
  addProduct.reset()

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
            listToRender += `-Producto: "${product.title}" está en tu lista</br>
            </br> `
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
        listNew += `
        -Producto: "${pDelete.title}" está en tu lista </br>
        </br>`
      })

      listProduct.innerHTML = listNew

    })
})