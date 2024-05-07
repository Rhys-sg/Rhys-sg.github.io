// used for all popups
const overlay = document.getElementById('overlay');

// Help "?" popup
const HelpPopUp = document.getElementById('HelpPopUp');

document.getElementById('helpBtn').addEventListener('click', function() {
    overlay.style.display = 'block';
    HelpPopUp.style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
    overlay.style.display = 'none';
    HelpPopUp.style.display = 'none';
});

overlay.addEventListener('click', function() {
    overlay.style.display = 'none';
    HelpPopUp.style.display = 'none';
});

HelpPopUp.addEventListener('click', function(event) {
    event.stopPropagation();
});


// Settings popup
const SettingsPopUp = document.getElementById('SettingsPopUp');

document.getElementById('settingBtn').addEventListener('click', function() {
    overlay.style.display = 'block';
    SettingsPopUp.style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
    overlay.style.display = 'none';
    SettingsPopUp.style.display = 'none';
});

overlay.addEventListener('click', function() {
    overlay.style.display = 'none';
    SettingsPopUp.style.display = 'none';
});

SettingsPopUp.addEventListener('click', function(event) {
    event.stopPropagation();
});