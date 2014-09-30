var TrackAjax = (function(window, document) {
    var originalXMLHttpRequest = window.XMLHttpRequest,
        buffer = [],
        hasXHR = !!(originalXMLHttpRequest && new originalXMLHttpRequest().addEventListener),
        link = document.createElement('a'),
        inited = false;

    function isCrossdomain(url) {
        link.href = url;
        return window.location.host !== link.host;
    }

    return {
        start: function(counterId) {
            var that = this;

            if(!hasXHR || inited) {
                return;
            }

            that._counterId = counterId;

            inited = true;
            buffer = [];
            that._xhrs = [];

            that._onxhrerror = function(e) {
                that._sendError('Xhr errors', window.location.href, 'error');
            };

            that._onxhrload = function(e) {
                var target = e.target;
                that._sendError(isCrossdomain(e.url) ? 'Crossdomain xhr errors' : 'Xhr errors', window.location.href, target.status, target.responseURL);
            };

            window.XMLHttpRequest = function(params) {
                var xhr = new originalXMLHttpRequest(params);
                that._xhrs.push(xhr);

                xhr.addEventListener('load', that._onxhrload, false);
                xhr.addEventListener('error', that._onxhrerror, false);

                return xhr;
            };

            // JSONP
            that._onerror = function(e) {
                var target = e.target,
                     tagName = ('' + target.tagName).toLowerCase();

                if(target && tagName === 'script') {
                    var src = target.src;
                    if(src && src.search(/(\?|&)callback=/) !== -1) {
                        that._sendError('JSONP errors', window.location.href, src);
                    }
                }
            };

            document.addEventListener('error', that._onerror, true);
        },
        stop: function() {
            if(inited) {
                for(var i = 0; i < this._xhrs.length; i++) {
                    this._xhrs[i].removeEventListener('error', this._onxhrerror, false);
                    this._xhrs[i].removeEventListener('load', this._onxhrload, false);
                }
                this._xhrs = [];
                window.XMLHttpRequest = originalXMLHttpRequest;

                document.removeEventListener('error', this._onxhrerror, false);

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
            buffer.push(Array.prototype.slice.call(arguments, 0));

            var counterId = this._getCounterId(),
                ya = window['yaCounter' + counterId];
            if(counterId && ya) {
                for(var i = 0; i < buffer.length; i++) {
                    ya.params.apply(ya, [].concat(buffer[i], 1));
                }

                buffer = [];
            }
        }
    }
})(this, document);
