"use strict";
const itemsContainer = document.querySelectorAll(".items-container");
let actualContainer, actualBtn, actualUl, actualForm, actualTextInput, actualValidation;
// creation d'une fonction pour regrouper le listener
function addContainerListeners(currentContainer) {
    console.log(currentContainer);
    const currentContainerDeletionBtn = currentContainer.querySelector(".delete-container-btn");
    const currentAddItemBtn = currentContainer.querySelector('.add-item-btn');
    const currentCloseFormBtn = currentContainer.querySelector('.close-form-btn');
    const currentForm = currentContainer.querySelector('form');
    // appel de la fonction pour supprimer un bloc de div
    deleteBtnListeners(currentContainerDeletionBtn);
    //   ajouter item
    addItemBtnListener(currentAddItemBtn);
    //   fermer l'ajout de nouveaux items
    closingFormBtnsListeners(currentCloseFormBtn);
    // ajouter une liste avec le submit
    addFormSubmitListener(currentForm);
    // drag and drop
    addDDListener(currentContainer);
}
// pour chaque container j'appel la fonction addContainerListners va faire le listener sur chaque container
itemsContainer.forEach((container) => {
    addContainerListeners(container);
});
// fonction de delete de container
function deleteBtnListeners(btn) {
    // au click j appel une fonction d'effacement
    btn.addEventListener("click", handleDeletion);
}
// fonction pour ajouter un item
function addItemBtnListener(btn) {
    btn.addEventListener('click', handleAddItem);
}
// fonction pour fermer au click le add new item
function closingFormBtnsListeners(btn) {
    btn.addEventListener('click', () => toggleForm(actualBtn, actualForm, false));
}
// fonction de creation d une nouvelle liste de taches
function addFormSubmitListener(form) {
    form.addEventListener('submit', createNewItem);
}
// fonction pour le drag and drop
function addDDListener(element) {
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragend', handleDragEnd);
}
// fonction d'effacement
function handleDeletion(e) {
    const btn = e.target;
    const btnsArray = [
        ...document.querySelectorAll(".delete-container-btn"),
    ];
    const containers = [
        ...document.querySelectorAll(".items-container"),
    ];
    containers[btnsArray.indexOf(btn)].remove();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function handleAddItem(e) {
    const btn = e.target;
    // toggle pour fermer les containers qui ne sont pas actifs
    if (actualContainer)
        toggleForm(actualBtn, actualForm, false);
    setContainerItems(btn);
    toggleForm(actualBtn, actualForm, true);
}
function toggleForm(btn, form, action) {
    if (!action) {
        form.style.display = "none";
        btn.style.display = "block";
    }
    else if (action) {
        form.style.display = "block";
        btn.style.display = "none";
    }
}
function setContainerItems(btn) {
    actualBtn = btn;
    actualContainer = btn.parentElement;
    actualUl = actualContainer.querySelector('ul');
    actualForm = actualContainer.querySelector('form');
    actualTextInput = actualContainer.querySelector('input');
    actualValidation = actualContainer.querySelector('.validation-msg');
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createNewItem(e) {
    e.preventDefault();
    // validation
    // si pas assez de caractère on envoie une erreur sous forme de message
    if (actualTextInput.value.length === 0) {
        actualValidation.textContent = "Must be at least 1 character long";
        return;
    }
    // sinon on renvoie rien
    else {
        actualValidation.textContent = "";
    }
    // Creation Li (    Item    )
    const itemContent = actualTextInput.value;
    const li = `
    <li class='item' draggable='true'>
    <p>${itemContent}</p>
    <button>X</button>
    </li>
    `;
    actualUl.insertAdjacentHTML('beforeend', li);
    const item = actualUl.lastElementChild;
    const liBtn = item.querySelector('button');
    handleItemDeletion(liBtn);
    addDDListener(item);
    actualTextInput.value = "";
}
// fonction pour retirer la liste ciblée
function handleItemDeletion(btn) {
    btn.addEventListener('click', () => {
        const elToRemove = btn.parentElement;
        elToRemove.remove();
    });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Drag and Drop
let dragSrcEl;
function handleDragStart(e) {
    var _a;
    e.stopPropagation();
    if (actualContainer)
        toggleForm(actualBtn, actualForm, false);
    dragSrcEl = this;
    (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/html', this.innerHTML);
}
function handleDragOver(e) {
    e.preventDefault();
}
function handleDrop(e) {
    var _a;
    e.stopImmediatePropagation();
    const receptionEl = this;
    if (dragSrcEl.nodeName === "LI" && receptionEl.classList.contains('items-container')) {
        receptionEl.querySelector('ul').appendChild(dragSrcEl);
        addDDListener(dragSrcEl);
        handleItemDeletion(dragSrcEl.querySelector("button"));
    }
    if (dragSrcEl !== this && this.classList[0] === dragSrcEl.classList[0]) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/html');
        if (this.classList.contains('items-container')) {
            addContainerListeners(this);
            this.querySelectorAll('li').forEach((li) => {
                handleItemDeletion(li.querySelector('button'));
                addDDListener(li);
            });
        }
        else {
            addDDListener(this);
            handleItemDeletion(this.querySelector('button'));
        }
    }
}
function handleDragEnd(e) {
    e.stopPropagation();
    if (this.classList.contains('items-container')) {
        addContainerListeners(this);
        this.querySelectorAll('li').forEach((li) => {
            handleItemDeletion(li.querySelector('button'));
            addDDListener(li);
        });
    }
    else {
        addDDListener(this);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// add new container
const addContainerBtn = document.querySelector('.add-container-btn');
const addContainerForm = document.querySelector('.add-new-container form');
const addContainerFormInput = document.querySelector('.add-new-container input');
const validationNewContainer = document.querySelector('.add-new-container .validation-msg');
const addContainerCloseBtn = document.querySelector('.close-add-list');
const addNewContainer = document.querySelector('.add-new-container');
const containerList = document.querySelector('.main-content');
// ouverture container
addContainerBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, true);
});
// fermeture container X
addContainerCloseBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, false);
});
addContainerForm.addEventListener('submit', createNewContainer);
function createNewContainer(e) {
    e.preventDefault();
    if (addContainerFormInput.value.length === 0) {
        validationNewContainer.textContent = "Must be at least 1 character long";
        return;
    }
    // sinon on renvoie rien
    else {
        validationNewContainer.textContent = "";
    }
    const itemsContainer = document.querySelector('.items-container');
    const newContainer = itemsContainer.cloneNode();
    const newContainerContent = `
    <div class="top-container">
      <h2>${addContainerFormInput.value}</h2>
      <button class="delete-container-btn">X</button>
    </div>
    <ul></ul>
    <button class="add-item-btn">Add an item</button>
    <form autocomplete="off">
      <div class="top-form-container">
        <label for="item">Add a new item</label>
        <button type="button" class="close-form-btn">X</button>
      </div>
      <input type="text" id="item" />
      <span class="validation-msg"></span>
      <button type="submit">Submit</button>
    </form>
    `;
    newContainer.innerHTML = newContainerContent;
    containerList.insertBefore(newContainer, addNewContainer);
    addContainerFormInput.value = "";
    addContainerListeners(newContainer);
}
