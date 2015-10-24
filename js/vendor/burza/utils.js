/*global ActiveXObject: false */
'use strict';
(function (window, scope) {

    var _config = {};
    var _self = {};

    _self.EMAIL_REGEXP = /^[A-Za-z0-9](([_\.\-\+]?[a-zA-Z0-9_]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;

    _config.eventType = (function (element) {
        if (element.addEventListener && element.removeEventListener) {
            return 1;
        } else if (element.attachEvent && element.detachEvent) {
            return 2;
        } else {
            return 0;
        }
    }(window));

    _self.createElement = function (element) {
        return window.document.createElement(element);
    };

    _self.getElement = function (element, selector) {
        if (arguments.length === 1) {
            selector = element;
            element = window.document;
        }
        return element.querySelector(selector);
    };

    _self.getElements = function (element, selector) {
        if (arguments.length === 1) {
            selector = element;
            element = window.document;
        }
        return element.querySelectorAll(selector);
    };

    _self.addEvent = function (element, event, callback) {
        if (!element) {
            return;
        }
        if (_config.eventType === 1) {
            element.addEventListener(event, callback, false);
        } else if (_config.eventType === 2) {
            element.attachEvent('on' + event, callback);
        } else {
            element['on' + event] = callback;
        }
        return;
    };

    _self.removeEvent = function (element, event, callback) {
        if (_config.eventType === 1) {
            element.removeEventListener(event, callback, false);
        } else if (_config.eventType === 2) {
            element.detachEvent('on' + event, callback);
        } else if (element['on' + event] === callback) {
            element['on' + event] = null;
        }
        return;
    };

    _self.hasClass = function (element, className) {
        if (element.classList) {
            return element.classList.contains(className);
        }
        return (' ' + element.className + ' ').indexOf(' ' + className + ' ') >= 0;
    };

    _self.addClass = function (element, className) {
        if (_self.hasClass(element, className)) {
            return;
        }
        if (element.classList) {
            element.classList.add(className);
        } else {
            element.className += ' ' + className;
        }
        return;
    };

    _self.removeClass = function (element, className) {
        if (element.classList) {
            return element.classList.remove(className);
        }
        element.className = element.className.replace(new RegExp('(^|\\b)' + className + '(\\b|$)', 'g'), ' ');
        return element.className;
    };

    _self.toggleClass = function (element, className, turnOn) {
        if (turnOn === true) {
            return _self.addClass(element, className);
        } else if (turnOn === false) {
            return _self.removeClass(element, className);
        }
        return _self.toggleClass(element, className, _self.hasClass(element, className));
    };

    _self.forEach = function (list, callback) {
        var i,
            length = list.length;
        for (i = 0; i < length; i++) {
            callback(list[i], i, list);
        }
    };

    _self.map = function (list, callback) {
        var i,
            mapped = [],
            length = list.length;
        for (i = 0; i < length; i++) {
            mapped.push(callback(list[i], i, list));
        }
        return mapped;
    };

    _self.noop = function () {};

    _self.is = {
        defined: function (value) {
            return typeof value !== 'undefined';
        },
        undefined: function (value) {
            return typeof value === 'undefined';
        },
        boolean: function (value) {
            return typeof value === 'boolean';
        },
        string: function (value) {
            return typeof value === 'string';
        },
        number: function (value) {
            return typeof value === 'number';
        },
        array: function (value) {
            return Array.isArray(value);
        },
        object: function (value) {
            return value !== null && typeof value === 'object';
        },
        function: function (value) {
            return typeof value === 'function';
        },
        date: function (value) {
            var toString = Object.prototype.toString;
            return toString.call(value) === '[object Date]';
        },
        regExp: function (value) {
            var toString = Object.prototype.toString;
            return toString.call(value) === '[object RegExp]';
        }
    };

    _self.keys = function (value) {
        return Object.keys(value);
    };

    _self.extend = function (destination) {
        return objectExtend(destination, [].slice.call(arguments, 1), false);
    };

    _self.merge = function (destination) {
        return objectExtend(destination, [].slice.call(arguments, 1), true);
    };

    function objectExtend (destination, sources, deep) {
        var i, j, source, keys, keysLength, key,
            length = sources.length;

        for (i = 0; i < length; i++) {
            source = sources[i];
            if (!_self.is.object(source) && !_self.is.function(source)) {
                continue;
            }
            keys = _self.keys(source);
            keysLength = keys.length;
            for (j = 0; j < keysLength; j++) {
                key = keys[j];
                var object = source[key];

                if (deep && _self.is.object(object)) {
                    if (_self.is.date(object)) {
                        destination[key] = new Date(object.valueOf());
                    } else if (_self.is.regExp(object)) {
                        destination[key] = new RegExp(object);
                    } else {
                        if (!_self.is.object(destination[key])) {
                            destination[key] = _self.is.array(object) ? [] : {};
                        }
                        objectExtend(destination[key], object, true);
                    }
                } else {
                    destination[key] = object;
                }
            }
        }
        return destination;
    }

    _self.debounce = function (fn, delay) {
        delay = delay || 250;
        var timer = null;
        return function () {
            var context = this, args = arguments;
            window.clearTimeout(timer);
            timer = window.setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    };

    _self.throttle = function (fn, threshhold, scope) {
        threshhold = threshhold || 250;
        var last, deferTimer;
        return function () {
            var context = scope || this;
            var now = +new Date(),
                args = arguments;
            if (last && now < last + threshhold) {
                window.clearTimeout(deferTimer);
                deferTimer = window.setTimeout(function () {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    };

    _self.raf = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                function (f) { window.setTimeout(f, 1000 / 60); };

    _self.getScroll = function () {
        return window.pageYOffset || window.document.body.scrollTop || window.document.documentElement.scrollTop || 0;
    };
    _self.vw = function () {
        return window.innerWidth || window.document.documentElement.clientWidth || window.document.body.clientWidth || 0;
    };
    _self.vh = function () {
        return window.innerHeight || window.document.documentElement.clientHeight || window.document.body.clientHeight || 0;
    };


    _self.getScrollbarWidth = function () {
        var scrollDiv = document.createElement('div');
        scrollDiv.style.position = 'absoute';
        scrollDiv.style.top = '-9999px';
        scrollDiv.style.width = '50px';
        scrollDiv.style.height = '50px';
        scrollDiv.style.overflow = 'scroll';
        _self.getElement('body').appendChild(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        _self.getElement('body').removeChild(scrollDiv);
        return scrollbarWidth;
    };


    _self.serialize = function (form) {
        var field, s = [];
        if (typeof form === 'object' && form.nodeName === 'FORM') {
            var len = form.elements.length;
            for (var i=0; i<len; i++) {
                field = form.elements[i];
                if (field.name && !field.disabled && field.type !== 'file' && field.type !== 'reset' && field.type !== 'submit' && field.type !== 'button') {
                    if (field.type === 'select-multiple') {
                        for (var j=form.elements[i].options.length-1; j>=0; j--) {
                            if(field.options[j].selected) {
                                s[s.length] = encodeURIComponent(field.name) + '=' + encodeURIComponent(field.options[j].value);
                            }
                        }
                    } else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                        s[s.length] = encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value);
                    }
                }
            }
        }
        return s.join('&').replace(/%20/g, '+');
    };


    _self.ajax = function (url, method, data, callback) {

        method = typeof(method) !== 'undefined' ? method : 'GET';
        var httpRequest;

        if (window.XMLHttpRequest) {
            httpRequest = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            try {
                httpRequest = new ActiveXObject('Msxml2.XMLHTTP');
            }
            catch (e) {
                try {
                    httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
                }
                catch (e) {}
            }
        }

        if (typeof(data) !== 'undefined' && data !== null) {
            url = url+'?'+data;
        }

        httpRequest.open(method, url, true);
        httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        if (method === 'POST') {

            httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            httpRequest.send(data);

        } else {

            httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            httpRequest.send();

        }

        httpRequest.onreadystatechange = function(){
            if (httpRequest.readyState === 4) {
                callback(httpRequest);
            }
        };


    };

    window[scope] = window[scope] || {};
    window[scope].utils = _self;

})(window, 'burza');
