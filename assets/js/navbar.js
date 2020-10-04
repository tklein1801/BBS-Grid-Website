var navbar = document.querySelector(".navbar");
var menuToggler = navbar.querySelector(".menu-toggler");
var collapsible = navbar.querySelector(".collapsible");
menuToggler.addEventListener("click", function () {
  menuToggler.classList.toggle("active");
  collapsible.classList.toggle("active");
});
