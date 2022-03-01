const itemsContainer = document.querySelectorAll(
  ".items-container"
) as NodeListOf<HTMLDivElement>;

let actualContainer: HTMLDivElement,
  actualBtn: HTMLButtonElement,
  actualUl: HTMLUListElement,
  actualForm: HTMLFormElement,
  actualTextInput: HTMLInputElement,
  actualValidation: HTMLSpanElement

// creation d'une fonction pour regrouper le listener

function addContainerListeners(currentContainer: HTMLDivElement){
    console.log(currentContainer);
    
  const currentContainerDeletionBtn = currentContainer.querySelector(
    ".delete-container-btn"
  ) as HTMLButtonElement;

  const currentAddItemBtn = currentContainer.querySelector('.add-item-btn') as HTMLButtonElement

  const currentCloseFormBtn = currentContainer.querySelector('.close-form-btn') as HTMLButtonElement

  const currentForm = currentContainer.querySelector('form') as HTMLFormElement


  // appel de la fonction pour supprimer un bloc de div
  deleteBtnListeners(currentContainerDeletionBtn);
//   ajouter item
  addItemBtnListener(currentAddItemBtn);
//   fermer l'ajout de nouveaux items
  closingFormBtnsListeners(currentCloseFormBtn);
// ajouter une liste avec le submit
  addFormSubmitListener(currentForm)
// drag and drop
  addDDListener(currentContainer)

}

// pour chaque container j'appel la fonction addContainerListners va faire le listener sur chaque container
itemsContainer.forEach((container: HTMLDivElement) => {
  addContainerListeners(container);
});

// fonction de delete de container
function deleteBtnListeners(btn: HTMLButtonElement) {
  // au click j appel une fonction d'effacement
  btn.addEventListener("click", handleDeletion);
}
// fonction pour ajouter un item
function addItemBtnListener(btn : HTMLButtonElement){
    btn.addEventListener('click', handleAddItem)
}
// fonction pour fermer au click le add new item
function closingFormBtnsListeners(btn: HTMLButtonElement){
    btn.addEventListener('click',() => toggleForm(actualBtn, actualForm, false))
}
// fonction de creation d une nouvelle liste de taches
function addFormSubmitListener(form: HTMLFormElement){
    form.addEventListener('submit', createNewItem )
}
// fonction pour le drag and drop
function addDDListener(element: HTMLElement){
    element.addEventListener('dragstart', handleDragStart)
    element.addEventListener('dragover', handleDragOver)
    element.addEventListener('drop', handleDrop)
    element.addEventListener('dragend', handleDragEnd)
}



// fonction d'effacement
function handleDeletion(e: MouseEvent) {
  const btn = e.target as HTMLButtonElement;
  const btnsArray = [
    ...document.querySelectorAll(".delete-container-btn"),
  ] as HTMLButtonElement[];
  const containers = [
    ...document.querySelectorAll(".items-container"),
  ] as HTMLDivElement[];

  containers[btnsArray.indexOf(btn)].remove();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function handleAddItem(e: MouseEvent){
    const btn = e.target as HTMLButtonElement;
    // toggle pour fermer les containers qui ne sont pas actifs
    if(actualContainer) toggleForm(actualBtn, actualForm, false)
    setContainerItems(btn);
    toggleForm(actualBtn, actualForm, true)
}

function toggleForm(btn : HTMLButtonElement, form: HTMLFormElement, action: Boolean ){

    if(!action){
        form.style.display = "none";
        btn.style.display = "block"
    }
    else if (action){
        form.style.display = "block";
        btn.style.display = "none"
    }

}

function setContainerItems(btn : HTMLButtonElement){
    actualBtn = btn;
    actualContainer = btn.parentElement as HTMLDivElement;
    actualUl = actualContainer.querySelector('ul') as HTMLUListElement;
    actualForm = actualContainer.querySelector('form') as HTMLFormElement;
    actualTextInput =  actualContainer.querySelector('input') as HTMLInputElement;
    actualValidation = actualContainer.querySelector('.validation-msg') as HTMLSpanElement;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createNewItem(e:Event){
    e.preventDefault()
    // validation
    // si pas assez de caractère on envoie une erreur sous forme de message
    if(actualTextInput.value.length === 0){
        actualValidation.textContent = "Must be at least 1 character long"
        return
    }
    // sinon on renvoie rien
    else{
        actualValidation.textContent = ""
    }
    // Creation Li (    Item    )
    const itemContent =  actualTextInput.value;
    const li = `
    <li class='item' draggable='true'>
    <p>${itemContent}</p>
    <button>X</button>
    </li>
    `
    actualUl.insertAdjacentHTML('beforeend',li);
    const item =actualUl.lastElementChild as HTMLElement;
    const liBtn = item.querySelector('button') as HTMLButtonElement;
    handleItemDeletion(liBtn);
    addDDListener(item);
    actualTextInput.value = ""

}

// fonction pour retirer la liste ciblée

function handleItemDeletion(btn: HTMLButtonElement){
    btn.addEventListener('click', () => {
        const elToRemove = btn.parentElement as HTMLLIElement;
        elToRemove.remove()
    })
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Drag and Drop

let dragSrcEl: HTMLElement;

function handleDragStart(this: HTMLElement, e: DragEvent){

    e.stopPropagation()

    if(actualContainer)toggleForm(actualBtn, actualForm, false)

    dragSrcEl = this;
    e.dataTransfer?.setData('text/html', this.innerHTML);
}

function handleDragOver(e: DragEvent){
    e.preventDefault()
}

function handleDrop(this: HTMLElement, e: DragEvent){
    e.stopImmediatePropagation()
    const receptionEl = this;

    if(dragSrcEl.nodeName === "LI" && receptionEl.classList.contains('items-container')){
        (receptionEl.querySelector('ul') as HTMLUListElement).appendChild(dragSrcEl)
        addDDListener(dragSrcEl)
        handleItemDeletion(dragSrcEl.querySelector("button") as HTMLButtonElement)
    }

    if(dragSrcEl !== this && this.classList[0] === dragSrcEl.classList[0]){
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer?.getData('text/html') as string;
        if(this.classList.contains('items-container')){
            addContainerListeners(this as HTMLDivElement)

            this.querySelectorAll('li').forEach((li: HTMLLIElement) => {
                handleItemDeletion(li.querySelector('button') as HTMLButtonElement)
                addDDListener(li)
            })
        } else {
            addDDListener(this)
            handleItemDeletion(this.querySelector('button') as HTMLButtonElement)
        }
    }


}

function handleDragEnd(this: HTMLElement, e: DragEvent){
    e.stopPropagation();
    if(this.classList.contains('items-container')) {
        addContainerListeners(this as HTMLDivElement)

        this.querySelectorAll('li').forEach((li: HTMLLIElement) => {
            handleItemDeletion(li.querySelector('button') as HTMLButtonElement)
            addDDListener(li)
        })
    } else{
        addDDListener(this)
    }
}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// add new container

const addContainerBtn = document.querySelector('.add-container-btn') as HTMLButtonElement;
const addContainerForm = document.querySelector('.add-new-container form') as HTMLFormElement;
const addContainerFormInput = document.querySelector('.add-new-container input') as HTMLInputElement;
const validationNewContainer = document.querySelector('.add-new-container .validation-msg') as HTMLSpanElement;
const addContainerCloseBtn = document.querySelector('.close-add-list') as HTMLButtonElement
const addNewContainer = document.querySelector('.add-new-container') as HTMLDivElement;
const containerList = document.querySelector('.main-content') as HTMLDivElement;

// ouverture container
addContainerBtn.addEventListener('click', ()=> {
    toggleForm(addContainerBtn, addContainerForm, true);
});
// fermeture container X
addContainerCloseBtn.addEventListener('click', ()=>{
    toggleForm(addContainerBtn, addContainerForm, false)
});

addContainerForm.addEventListener('submit', createNewContainer)

function createNewContainer(e: Event){
    e.preventDefault()

    if(addContainerFormInput.value.length === 0){
        validationNewContainer.textContent = "Must be at least 1 character long"
        return
    }
    // sinon on renvoie rien
    else{
        validationNewContainer.textContent = ""
    }

    const itemsContainer = document.querySelector('.items-container') as HTMLDivElement;
    const newContainer = itemsContainer.cloneNode() as HTMLDivElement;
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
    `
    newContainer.innerHTML = newContainerContent;
    containerList.insertBefore(newContainer, addNewContainer);
    addContainerFormInput.value = "";
    addContainerListeners(newContainer);
}





