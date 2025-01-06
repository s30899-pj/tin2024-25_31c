document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const categories = document.getElementById('categories');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        categories.classList.toggle('active');
    });
});