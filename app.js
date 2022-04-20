const URL = 'https://app-27708ea6-829f-4a95-ad6e-dcfe60ec21d6.cleverapps.io';
// const URL = 'http://localhost:3002';
const URL_REDIRECT = 'https://billetterie.vignes-buissonnieres.fr/create_cookie.php';

new Vue({
    el: '#app',
    computed: {
        nb_devant: function() {
            if (!this.progression) {
                return undefined;
            }

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

                sessionStorage.setItem('id_token', this.id_token);
                sessionStorage.setItem('signature_token', this.signature_token);
            }
        },
        loadProgression: async function() {
            const response = await fetch(URL + '/progression');
            const json = await response.json();
            this.progression = parseInt(json.progression);
        },
        enter: async function() {
            const response = await fetch(URL + '/enter?id=' + this.id_token + '&signature_id=' + this.signature_token);
            const json = await response.json();
            console.log('json', json);
            if (json.timestamp > new Date()) {
                console.log('expired', json.timestamp);
                this.valid_but_expired = true;
            } else {
                const redirect_to = URL_REDIRECT + '?expiration=' + json.timestamp + '&signature=' + json.signature_cookie;
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
        this.loadProgression();
        setInterval(() => {
            this.loadProgression();
        }, 3000); // TODO passer à 30 secondes
    },
    data: {
        progression: undefined, // Curseur d'avancement dans la queue
        id_token: sessionStorage.getItem('id_token'),
        signature_token: sessionStorage.getItem('signature_token'),
        valid_but_expired: false, // Peut entrer sur le site mais sa session a expiré
    },
})


