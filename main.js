// ! если не работает, то нужно запустить json server
// ! npx json-server -w bd.json -p 8000
const API = "http://localhost:8000/products";

let productsList = document.getElementById("products");
let image = document.getElementById("image");
let description = document.getElementById("description");
let firstPrice = document.getElementById("price-1");
let secondPrice = document.getElementById("price-2");

let openAddFormBtn = document.getElementById("open-add-form");
let addModal = document.getElementById("add-modal");
let addModalInner = document.getElementById("add-modal-inner");
let closeAddForm = document.getElementById("close-add-modal");

// ? достает форму добавления
let inpImage = document.getElementById("add-img");
let inpDescription = document.getElementById("add-description");
let inpFirstPrice = document.getElementById("add-price-1");
let inpSecondPrice = document.getElementById("add-price-2");
let addProductBtn = document.getElementById("add-btn");

// ? На кнопку навесили события чтоб открыть модалку
openAddFormBtn.addEventListener("click", () => {
  addModal.style.display = "flex";
});

// ? Закрытие модалки при клике на крестик внутри нее
closeAddForm.addEventListener("click", () => {
  addModal.style.display = "none";
});

// ? начало details
let closeDetailsBtn = document.getElementById("close-details");
let detailsParent = document.getElementById("details");
let detailsInner = document.getElementById("details-inner");
closeDetailsBtn.addEventListener("click", () => {
  detailsParent.style.display = "none";
});

// ! for edit
let editModal = document.getElementById("edit-modal");
let editModalInner = document.getElementById("edit-modal-inner");
let closeEditModal = document.getElementById("close-edit-modal");
let inpImageEdit = document.getElementById("edit-img");
let inpDescriptionEdit = document.getElementById("edit-description");
let inpFirstPriceEdit = document.getElementById("edit-price-1");
let inpSecondPriceEdit = document.getElementById("edit-price-2");
let editProductBtn = document.getElementById("edit-btn");

closeEditModal.addEventListener("click", () => {
  editModal.style.display = "none";
});

// ? При клике на кнопку внутри модалки, собираем данные с инпута в объект и делаем запрос на добавление продукта, после скрываем модалку
addProductBtn.addEventListener("click", async () => {
  // ? собираем данные
  let product = {
    image: inpImage.value,
    description: inpDescription.value,
    first_price: inpFirstPrice.value,
    second_price: inpSecondPrice.value,
  };

  // ? отправляем данные
  if (inpImage.value.trim() && inpDescription.value.trim() && inpFirstPrice.value.trim() && inpSecondPrice.value.trim()) {
    await fetch(API, {
      method: "POST",
      body: JSON.stringify(product),
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
    });
  } else {
    alert("Заполните поля!");
  }

  // ? закрываем модалку
  addModal.style.display = "none";
});

async function showProducts() {
  let products = await fetch(API).then((res) => res.json());
  console.log("products: ", products);

  products.forEach((product, id) => {
    let div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
    <img src="${product.image}" />
    <p>${product.description}</p>
    <div class="card-price">
        <p>${product.first_price}cом</p>
        <p>${product.second_price}сом</p>
    </div>
    `;

    // ! details
    div.addEventListener("click", () => {
      detailsInner.innerHTML = "";
      detailsParent.style.display = "flex";

      detailsInner.innerHTML = `
      <img src="${product.image}"/>
      <div class="details-text" id="details-text">
        <p>${product.description}</p>
        <div class="card-price">
            <p>${product.first_price}сом</p>
            <p>${product.second_price}сом</p>
        </div>
      </div>
      `;
      let detailsText = document.getElementById("details-text");
      let btnDelete = document.createElement("button");
      btnDelete.innerHTML = "Удалить продукт";

      btnDelete.addEventListener("click", (e) => deleteProduct(product.id, e));

      // ! создаем кнопку для редактирования внутри details
      let editBtn = document.createElement("button");
      editBtn.innerHTML = "Редактировать продукт";
      detailsText.append(btnDelete, editBtn);

      editBtn.addEventListener("click", (e) => {
        editModal.style.display = "flex";
        editModal.style.zIndex = "2";
        editProduct(product);
      });
    });

    // ! edit

    productsList.append(div);
  });
}

showProducts();

async function deleteProduct(id, event) {
  event.stopPropagation();
  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  detailsParent.style.display = "none";
}

function editProduct(product) {
  inpImageEdit.value = product.image;
  inpDescriptionEdit.value = product.description;
  inpFirstPriceEdit.value = product.first_price;
  inpSecondPriceEdit.value = product.second_price;

  editProductBtn.addEventListener("click", async () => {
    let newProduct = {
      image: inpImageEdit.value,
      description: inpDescriptionEdit.value,
      first_price: inpFirstPriceEdit.value,
      second_price: inpSecondPriceEdit.value,
    };
    await fetch(`${API}/${product.id}`, {
      method: "PATCH",
      body: JSON.stringify(newProduct),
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
    });
  });
}
