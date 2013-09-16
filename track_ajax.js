;
(function (window, document) {
	var originalXMLHttpRequest = window.XMLHttpRequest;
	var TrackAjax = {
		init: function () {
			if (!this._has()) {
				return;
			}
			
			this.initAjax();
			this.initJSONP();
			
			this.initEvents();
		},
		has: function () {
			return !(originalXMLHttpRequest && new originalXMLHttpRequest.addEventListener);
		},
		_counters: [],
		updateCounters: function () {
			if (window.Ya && window.Ya.Metrika) {
				this._counters = window.Ya.Metrika.counters();
			}
			
			return this._counters;
		},
		initAjax: function () {
			window.XMLHttpRequest = function (params) {
				var obj = new originalXMLHttpRequest(params);
				var that = this;
				obj.addEventListener('readystatechange', function (e) {
					if (e.readyState >= 3 && e.status >= 400) {
						that.send('Ajax errors', that.isCrossDomain() ? 'Crossdomain ajax' : 'Ajax', e.status, e.url, 1);
					}
				}, false);
				
				return obj;
			};
		},
		initJSONP: function () {
			document.addEventListener('error', function (e) {
				var target = e.target;
				var tagName = ('' + target.tagName).toLowerCase();
				
				if (target && tagName == 'SCRIPT') { // TODO
					var src = '' + el.src;
					if (src.search(/(\?|&)callback=/) !== -1) {
						that.send('Ajax errors', 'JSONP', src, 1);
					}
				}
				
			}, true);
		},
		_buffer: [],
		send: function () {
			this.updateCounters();
			
			if (arguments[0]) {
				this._buffer.push(arguments);
			}
			
			if (this._counter.length) {
				for (var n = 0; n < this._buffer[n]; n++) {
					for (var i = 0; i < this._counters.length; i++) {
						window['yaCounter' + this._counters[i]].params.apply(this, buf[n]);
					}
				}
				
				this._buffer = [];
			}
		},
		getDomain: function (url) {
			return domain; // TODO
		},
		isCrossDomain: function (url) {
			return this.getDomain(window.location.href) == this.getDomain(url);
		},
		sameDomain: function (url1, url2) {
			return this.getDomain(url1) == this.getDomain(url2);
		}
	};
})(this, document);