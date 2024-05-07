// Help "?" popup
const HelpPopUp = document.getElementById('HelpPopUp');

document.getElementById('helpBtn').addEventListener('click', function() {
    overlay.style.display = 'block';
    HelpPopUp.style.display = 'block';
});

HelpPopUp.querySelector('.close').addEventListener('click', function() {
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

document.getElementById('settingsBtn').addEventListener('click', function() {
    overlay.style.display = 'block';
    SettingsPopUp.style.display = 'block';
});

SettingsPopUp.querySelector('.close').addEventListener('click', function() {
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
