const navMobile = document.querySelector(".nav-mobile")
const navMobileItem = document.querySelectorAll(".nav-mobile__list-item")
const menuBtn = document.querySelector(".header__btn")

// NAV MOBILE
const toggleNav = () => {
	navMobile.classList.toggle("nav-mobile--active")
}

// NAV MOBILE LISTENERS
menuBtn.addEventListener("click", toggleNav)
navMobileItem.forEach(el => {
	el.addEventListener("click", toggleNav)
})
