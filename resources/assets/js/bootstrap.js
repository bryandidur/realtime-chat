import Echo from 'laravel-echo'

window.Pusher = require('pusher-js');

// Laravel Echo initialization
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'your-app-key',
    cluster: 'your-app-cluster',
    encrypted: true
});

// jQuery AJAX setup
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        'X-Requested-With': 'XMLHttpRequest'
    }
});
