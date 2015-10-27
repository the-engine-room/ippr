'use strict';
(function (U) {

    U.forEach(U.getElements('.large'), function(button){
        U.addClass(button, 'medium');
    });

})(window.burza.utils);
