'use strict';
(function (U) {

    U.forEach(U.getElements('.large'), function(button){
        U.addClass(button, 'small');
    });

})(window.burza.utils);
