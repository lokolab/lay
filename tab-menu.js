/**
 * Tab-menu is a JavaScript plugin for Luen library.
 *
 * Copyright (c) Krystian Pietruszka <kpietru@lokolab.net>
 * License MIT
 */

(function($) {
    $.fn.tabMenu = function(options) {
        $.assertType(options, 'undefined', 'object');
        var defaults = {
            activeTab: null,
            rememberTab: false,
            vertical: false,
            parseKey: '*',
            css: ''
        };
        var settings = $.extend(
            defaults,
            typeof options === 'undefined' ? {} : options
        );
        var id = this.getQuery();
        var verticalCss = '';
        if (settings.vertical === true) {
            var verticalCss = '/* Vertical style. */'
            + id + '{ flex-direction: column; float: left; }'
            + id + ' li { margin: 0 0 .25em auto; }'
            + id + ' li a { border: solid 1px #ccb; }'
            + id + ' ~ .js-tab-content { float: right; margin-top: 0; border: 0; }';
        }
        $('head').insertHtml(
            'beforeend',
            '<style type="text/css">'
            + id + ' { display: flex; flex-wrap: wrap; justify-content: flex-start; flex-direction: row; line-height: 1.5; list-style: none; margin: 0; padding: 0 0 0 .25em; }'
            + id + ':after { content: ""; display: table; clear: both; }'
            + id + ' li { margin: 0 .25em 0 0; padding: 0; }'
            + id + ' li a { white-space: nowrap; outline: 0; display: inline-block; padding: .125em .5em .125em .5em; margin: 0; border: solid 1px #ccb; border-bottom: 0; text-decoration: none; color: #333 !important; }'
            + id + ' .js-tab-active { cursor: default; background-color: #fff !important; }'
            + id + ' .js-tab-no-active { background-color: #e7e7d7; }'
            + id + ' .js-tab-no-active:hover { background-color: #eed !important; }'
            + id + ' ~ .js-tab-content { margin-top: -1px; border-top: solid 1px #ccb; }'
            + verticalCss
            + '/* Custom style. */'
            + settings.css
            + '</style>'
        );
        var ajaxLoad = function(href, elem) {
            if (elem.hasAttribute('data-parse-key')) {
                var parseKey = elem.getAttribute('data-parse-key');
            } else {
                var parseKey = settings.parseKey;
            }
            var div = $('<div>')
                .setAttribute('class', 'js-tab-content js-tab-content-ajax')
                .ajaxLoad(href, function(data) {
                    return $(data).find(parseKey).getHtml();
                })
                .insertAfter(id);
        };
        var callbackClick = function() {
            $(id + ' a').each(function() {
                var elem = $(this);
                elem.setAttribute('class', 'js-tab-no-active');
                elem.setAttribute('href', 'javascript:void(0)');
                $(id + ' ~ .js-tab-content-ajax').remove();
                var href = elem.getAttribute('data-temp-href');
                if (href.indexOf('#') === 0) {
                    $(href).setPropertyStyle('display', 'none');
                }
            });
            var elem = $(this);
            elem.setAttribute('class', 'js-tab-active');
            elem.removeAttribute('href');
            var href = elem.getAttribute('data-temp-href');
            if (href.indexOf('#') === 0) {
                $(href).setPropertyStyle('display', '');
                $(href).addClass('js-tab-content');
            } else {
                ajaxLoad(href, elem);
            }
            if (settings.rememberTab === true) {
                luen.setStorage('remember-tab-' + id, href);
            }
            return false;
        };
        this.find('a').each(function(i) {
            var elem = $(this);
            var href = elem.getAttribute('href');
            elem.setAttribute('href', 'javascript:void(0)');
            elem.setAttribute('data-temp-href', href);
            if (
                settings.rememberTab === true && luen.getStorage('remember-tab-' + id) === href ||
                href === settings.activeTab && settings.rememberTab === true && !luen.hasStorage('remember-tab-' + id) ||
                href === settings.activeTab && settings.rememberTab === false ||
                settings.activeTab === null && settings.rememberTab === false && i === 0
            ) {
                elem.setAttribute('class', 'js-tab-active');
                elem.removeAttribute('href');
                if (href.indexOf('#') === 0) {
                    $(href)
                        .setPropertyStyle('display', '')
                        .addClass('js-tab-content');
                } else {
                    ajaxLoad(href, elem);
                }
            } else {
                elem.setAttribute('class', 'js-tab-no-active');
                if (href.indexOf('#') === 0) {
                    $(href).setPropertyStyle('display', 'none');
                }
            }
            elem.on('click', callbackClick);
        });
    };
})(luen);
