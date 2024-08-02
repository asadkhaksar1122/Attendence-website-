let search=document.querySelector(".search")
let input = document.querySelector(".searchinput")
let button=document.querySelector('.btn')
button.addEventListener("click", function () {
    search.classList.toggle('active')
    input.focus()
})
let hamburger = document.querySelector(".hamburger");
let icon = hamburger.querySelector("i");
let maindiv=document.querySelector(".maindiv")
hamburger.addEventListener("click", function () { 
    if (icon.classList.contains("fa-bars")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
        maindiv.classList.add("resp")
    }else{
icon.classList.remove("fa-xmark");
icon.classList.add("fa-bars");
maindiv.classList.remove("resp");
    }

})