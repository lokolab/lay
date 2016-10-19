/**
 * Scroll-dom is a JavaScript plugin for Luen library.
 *
 * Copyright (c) Krystian Pietruszka <kpietru@lokolab.net>
 * License MIT
 */

(function($) {

    /** @type {Luen} */
    window._scrollDomDocument = null;

    /** @type {!boolean} */
    window._scrollDomOneSwitcher = false;

    /**
     * @param {!undefined, !Object} options
     *
     * @return {Luen} The invoked object.
     */
    $.ns.scrollDom = function(options) {
        $.assertType(options, 'undefined', 'object');
        var defaults = {
            callbackOneDown: function() {},
            callbackOneUp: function() {},
            callbackDown: function() {},
            callbackUp: function() {}
        };
        // Global settings.
        this.settings = $.extend(
            defaults,
            typeof options === 'undefined' ? {} : options
        );
        $(document).on('scroll', $.ns.scrollDom);
        if (_scrollDomDocument === null) {
            _scrollDomDocument = this;
            return this;
        }
        // http://stackoverflow.com/a/1223463
        if (typeof($.ns.scrollDom.y) === 'undefined') {
            $.ns.scrollDom.y = window.pageYOffset;
        }
        var diffY = $.ns.scrollDom.y - window.pageYOffset;
        if (diffY < 0) {
            // scroll down
            if (_scrollDomOneSwitcher === false) {
                _scrollDomOneSwitcher = true;
                _scrollDomDocument.settings.callbackOneDown();
            }
            _scrollDomDocument.settings.callbackDown();
        } else if (diffY > 0) {
            // scroll up
            if (_scrollDomOneSwitcher === true) {
                _scrollDomOneSwitcher = false;
                _scrollDomDocument.settings.callbackOneUp();
            }
            _scrollDomDocument.settings.callbackUp();
        }
        $.ns.scrollDom.y = window.pageYOffset;
        return _scrollDomDocument;
    };
})(luen);

