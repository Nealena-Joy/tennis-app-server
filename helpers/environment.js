let APIURL = '';

switch (window.location.hostname) {
    case 'localhost' || '127.0.0.1':
        APIURL = 'http://localhost:5000';
        break;
    case 'tennis-app-njr.herokuapp.com':
        APIURL = 'https://tennis-app-njr.herokuapp.com'
}

export default APIURL;