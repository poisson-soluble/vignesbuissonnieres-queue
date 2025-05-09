const URL = 'https://backend-queue.vignes-buissonnieres.fr'; // Sans / à la fin. Dupliqué dans le /app.js et /admin/app.js
// const URL = 'http://localhost:3002';
const URL_REDIRECT = 'https://billetterie.vignes-buissonnieres.fr/create_cookie.php';

new Vue({
    el: '#app',
    computed: {
        nb_devant: function() {
            let nb_devant = this.id_token - this.progression;
            if (nb_devant < 0) nb_devant = 0;
            return nb_devant;
        },
    },
    methods: {
        newTicket: async function() {
            sessionStorage.clear();
            const response = await fetch(URL + '/new-ticket');
            const json = await response.json();

            if (json.id) {
                this.valid_but_expired = false;
                this.id_token = json.id;
                this.signature_token = json.signature;

                sessionStorage.setItem('id_token_2025', this.id_token);
                sessionStorage.setItem('signature_token_2025', this.signature_token);
            }
        },
        loadProgression: async function() {
            const response = await fetch(URL + '/progression');
            const json = await response.json();
            this.progression = parseInt(json.progression);
        },
        enter: async function() {
            const response = await fetch(URL + '/enter?id=' + this.id_token + '&signature_id=' + this.signature_token);
            if (response.status !== 200) {
                console.log('error', response);
                return;
            }
            const {timestamp, signature_cookie} = await response.json();
            console.log('json', timestamp, signature_cookie);
            if (timestamp*1000 < new Date()) {
                console.log('expired', timestamp);
                this.valid_but_expired = true;
            } else {
                const redirect_to = URL_REDIRECT + '?expiration=' + timestamp + '&signature=' + signature_cookie;
                console.log('redirect to', redirect_to, '...');
                window.location.href = redirect_to;
            }
        },
        reset: async function() {
            this.valid_but_expired = false;
            sessionStorage.clear();
            location.reload();
        }
    },
    mounted () {
        // On attends 3 secondes avant d'appeller le serveur. Évite les gens qui F5 en boucle...
        setTimeout(() =>{
            this.loadProgression();
        }, 3000);

        // On refresh toutes les 30 secondes
        setInterval(() => {
            this.loadProgression();
        }, 30000);
    },
    data: {
        progression: undefined, // Curseur d'avancement dans la queue
        id_token: sessionStorage.getItem('id_token_2025'),
        signature_token: sessionStorage.getItem('signature_token_2025'),
        valid_but_expired: false, // Peut entrer sur le site mais sa session a expiré
    },
})


