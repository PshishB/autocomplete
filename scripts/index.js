const input = document.querySelector('input');
const inputWrapper = document.querySelector('.input__wrapper');

let arr = [];

async function search () {
    inputWrapper.innerHTML = '';
    arr = [];
    let value = input.value;
    if (!value)  return ;
    let t = await fetch(`https://api.github.com/search/repositories?q=${value}`);
    let repositories = await t.json();
    repositories = repositories.items;
    repositories = repositories.filter(repo => repo.name.toLowerCase().startsWith(value));
    repositories.sort(function(a, b) {
        let texta = a.name.toLowerCase();
        let textb = b.name.toLowerCase();
        let indexA = texta.includes(value.toLowerCase()) ? texta.indexOf(value.toLowerCase()) : Infinity;
        let indexB = textb.includes(value.toLowerCase()) ? textb.indexOf(value.toLowerCase()) : Infinity;
        return indexA - indexB;
    });    
    for (let i = 0; i < 5 ; i++) {
        let inputItem = document.createElement('div');
        inputItem.classList.add('input__item');
        let inputArticle = document.createElement('p');
        inputArticle.classList.add('.input__article');
        inputArticle.innerText = repositories[i].name;
        arr.push(repositories[i]);
        inputItem.appendChild(inputArticle);
        inputWrapper.appendChild(inputItem);
    }
}

const debounce = (fn, debounceTime) => {
    let flag;
    return function () { 
      const fnCall = () => {fn.apply(this,arguments)}
      clearTimeout(flag);
      flag = setTimeout(fnCall,debounceTime);
    }
  };
  
input.addEventListener('input',debounce(search,1000));

let inputItem = document.querySelectorAll('.input__item');
let list = document.querySelector('.list');
let idCounter = 0;

async function addList (element, index) {
    let listItem = document.createElement('div');
    listItem.classList.add('list__item');
    let listArticle = document.createElement('p');
    let listBtn = document.createElement('button');
    let t = await fetch(`https://api.github.com/repos/${arr[idCounter].owner.login}/${arr[idCounter].name}/stargazers`)
    let stargazers = await t.json();
    listArticle.innerText = `Name:${arr[idCounter].name} \n Owner:${arr[idCounter].owner.login} \n Stars:${stargazers.length}`;
    listArticle.classList.add('list__article');
    listBtn.classList.add('list__btn');
    listItem.appendChild(listArticle);
    listItem.appendChild(listBtn);
    listItem.id = `${idCounter}`
    idCounter++;
    list.appendChild(listItem);
    inputWrapper.innerHTML = '';
    arr = [];
    input.value = null;
}

let container = document.querySelector('.container');

inputWrapper.addEventListener('click',event => {
    if (!event.target.matches('.input__item')){
        return;
    }
    addList()
});

let listItems = document.querySelectorAll('.list__item');
let listBtn = document.querySelectorAll('.list__btn')
list.addEventListener('click', event => {
    const listItem = event.target.closest('.list__item');
    if (listItem) {
        const listItemIndex = parseInt(listItem.id);
        if (!isNaN(listItemIndex)) {
            const buttonClicked = event.target.closest('.list__btn');
            if (buttonClicked) {
                listItem.remove();
                idCounter--;
                const listItems = document.querySelectorAll('.list__item');
                listItems.forEach((item, index) => {
                    item.id = index;
                });
            }
        }
    }
});