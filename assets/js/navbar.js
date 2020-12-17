var navbar = document.querySelector(".navbar");
var menuToggler = navbar.querySelector(".menu-toggler");
var collapsible = navbar.querySelector(".collapsible");
menuToggler.addEventListener("click", function () {
  menuToggler.classList.toggle("active");
  collapsible.classList.toggle("active");
});

window.addEventListener("scroll", () => {
  var scrollOffset = window.scrollY,
    alertOffset = document.querySelector(".alert").offsetHeight;

  scrollOffset >= alertOffset
    ? navbar.classList.add("scrolled")
    : navbar.classList.remove("scrolled");
});
