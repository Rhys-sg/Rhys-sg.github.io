const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');

document.getElementById('helpBtn').addEventListener('click', function() {
    overlay.style.display = 'block';
    popup.style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
    overlay.style.display = 'none';
    popup.style.display = 'none';
});

overlay.addEventListener('click', function() {
    overlay.style.display = 'none';
    popup.style.display = 'none';
});

popup.addEventListener('click', function(event) {
    event.stopPropagation();
});