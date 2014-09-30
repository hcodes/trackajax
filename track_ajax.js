var TrackAjax = (function (window, document) {
    var originalXMLHttpRequest = window.XMLHttpRequest,
        buffer = [],
        hasXHR = !!(originalXMLHttpRequest && new originalXMLHttpRequest.addEventListener),
        link = document.createElement('a'),
        inited = false;

    function isCrossDomain(url) {
        link.href = url;
        return window.location.host !== link.host;
    }

    return {
        on: function (counterId) {
            var that = this;

            if(hasXHR || inited) {
                return;
            }

            that._counterId = counterId;

            inited = true;
            buffer = [];
            that._xhrs = [];

            // Ajax and crossdomain ajax
            that._onreadychange = function(e) {
                if(e.readyState >= 3 && e.status >= 400) {
                    that._sendError(isCrossDomain(e.url) ? 'Crossdomain' : 'Samedomain', e.status, e.url, 1);
                }
            };

            window.XMLHttpRequest = function(params) {
                var xhr = new originalXMLHttpRequest(params);
                that._xhrs.push(xhr);
                xhr.addEventListener('readystatechange', that._onreadychange, false);

                return xhr;
            };

            // JSONP
            that._onerror = function(e) {
                var target = e.target,
                     tagName = ('' + target.tagName).toLowerCase();

                if(target && tagName === 'script') {
                    var src = '' + el.src;
                    if(src.search(/(\?|&)callback=/) !== -1) {
                        that._sendError('JSONP', src, 1);
                    }
                }
            };

            document.addEventListener('error', onerror, true);
        };

        off: function() {
            if(inited) {
                for(var i = 0; i < this._xhrs.length; i++) {
                    this._xhrs[i].removeEventListener('readystatechange', this._onreadychange, false);
                }

                this._xhrs = [];
                window.XMLHttpRequest = originalXMLHttpRequest;

                document.removeEventListener('error', this._onerror, true);

                buffer = [];
                delete this._counterId;
                inited = false;
            }
        },
        _getCounterId: function() {
            var id = this._counterId,
                wya = window.Ya;

            if(id) {
                return id;
            } else if(wya && wya.Metrika && wya.Metrika.counters) {
                var buf = wya.Metrika.counters();
                return buf && buf[0].id;
            }

            return false;
        },
        _sendError: function() {
            if(arguments[0]) {
                buffer.push(arguments);
            }

            var counterId = this._getCounterId(),
                ya;

            if(counterId) {
                ya = window['yaCounter' + counterId];
                for (var i = 0; i < buffer.length; i++) {
                    ya.params.apply(ya, ['Ajax errors'].concat(buffer[i]));
                }

                buffer = [];
            }
        }
    }
})(this, document);
