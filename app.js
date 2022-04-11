const URL = 'https://app-27708ea6-829f-4a95-ad6e-dcfe60ec21d6.cleverapps.io';
// const url = 'http://localhost:3002';

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
        },
        reset: async function() {
            sessionStorage.clear();
            location.reload();
        }
    },
    mounted () {
        setInterval(() => {
            this.loadProgression();
        }, 3000);
    },
    data: {
        progression: undefined,
        id_token: sessionStorage.getItem('id_token'),
        signature_token: sessionStorage.getItem('signature_token'),
    },
})


