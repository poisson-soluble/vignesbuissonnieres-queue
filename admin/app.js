const url = 'https://app-b2f86271-629c-4583-91eb-9defc1880c7c.cleverapps.io';
// const url = 'http://localhost:3002';
const URL_REDIRECT = 'https://billetterie.vignes-buissonnieres.fr/create_cookie.php';

document.getElementById('refresh').addEventListener('click', async () => {
    await refreshProgression()
    await refreshCurrentToken()
    render();
});

document.getElementById('set-progression').addEventListener('click', async () => {
    const password = document.getElementById('password').value;
    const response = await fetch(url + '/admin/progress?password='+password);
    const json = await response.json();
    progression = parseInt(json.progression);
    render();
});

//document.getElementById('reset').addEventListener('click', async () => {
 //   const password = document.getElementById('password').value;
  //  await fetch(url + '/admin/reset?password='+password);
   // await refreshProgression()
   // await refreshCurrentToken()
   // render();
//});

document.getElementById('enter').addEventListener('click', async () => {
    const password = document.getElementById('password').value;
    const response = await fetch(url + '/admin/enter?password='+password);
    const json = await response.json();
    const redirect_to = URL_REDIRECT + '?expiration=' + json.timestamp + '&signature=' + json.signature_cookie;
    console.log('redirect to', redirect_to, '...');
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
