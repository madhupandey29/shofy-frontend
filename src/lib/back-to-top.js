export default function BackToTop(value) {
  const result = document.querySelector(value);
  function onScroll() {
    if (window.scrollY > 200) {
      result.classList.add('back-to-top-btn-show');
    } else {
      result.classList.remove('back-to-top-btn-show');
    }
  }
  function onClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  if (result) {
    document.addEventListener("scroll", onScroll);
    result.addEventListener("click", onClick);
    // Return a cleanup function
    return () => {
      document.removeEventListener("scroll", onScroll);
      result.removeEventListener("click", onClick);
    };
  }
}
