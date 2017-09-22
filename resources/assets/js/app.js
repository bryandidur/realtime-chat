require('./bootstrap.js');

import Chat from './chat';

/*
|---------------------------------------
| Simple route system
|---------------------------------------
|
 */
var route = $(location).attr('pathname');

switch (route) {
    case '/':
        Chat();
    break;
}
