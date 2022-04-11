
const url = 'https://app-27708ea6-829f-4a95-ad6e-dcfe60ec21d6.cleverapps.io';
// const url = 'http://localhost:3000';

document.getElementById('refresh').addEventListener('click', async () => {
    await refreshProgression()
    await refreshCurrentToken()
    render();
});

document.getElementById('set-progression').addEventListener('click', async () => {
    const password = document.getElementById('password').value;
    const response = await fetch(url + '/progress?password='+password);
    const json = await response.json();
    progression = parseInt(json.progression);
    render();
});

document.getElementById('reset').addEventListener('click', async () => {
    const password = document.getElementById('password').value;
    await fetch(url + '/reset?password='+password);
    await refreshProgression()
    await refreshCurrentToken()
    render();
});

let progression = 0;
async function refreshProgression() {
    const response = await fetch(url + '/progression');
    const json = await response.json();
    progression = parseInt(json.progression);
}

let currentId = 0;
async function refreshCurrentToken() {
    const response = await fetch(url + '/current-ticket');
    const json = await response.json();
    currentId = parseInt(json.id);
}

function render() {
    document.getElementById('progression').innerText = progression;
    document.getElementById('currentId').innerText = currentId;
}

(async () => {
    await refreshProgression();
    await refreshCurrentToken();
    render();
})();
