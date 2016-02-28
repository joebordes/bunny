var AutocompleteMarkup = {
    createEmptyDropdown: function createEmptyDropdown() {
        var dropdown = document.createElement('div');
        return dropdown;
    },
    createDropdownItem: function createDropdownItem(value, content) {
        var item = document.createElement('div');
        item.setAttribute('value', value);
        item.innerHTML = content;
        return item;
    },
    createDropdownItemsFromData: function createDropdownItemsFromData(data) {
        var callback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        for (var key in data) {
            var item = this.createDropdownItem(key, data[key]);
            if (callback !== null) {
                callback(item, key, data[key]);
            }
        }
    },
    removeDropdownItems: function removeDropdownItems(dropdown) {
        while (dropdown.firstChild) {
            dropdown.removeChild(dropdown.firstChild);
        }
    }
};

var AutocompleteDecorator = {

    theme: {
        bs4: {
            classPrefix: '',

            dropdownClass: ['dropdown-menu', 'w-100'],
            dropdownItemClass: 'dropdown-item',
            showClass: 'open'

        }
    },

    buildClass: function buildClass(el, classProperty, theme) {
        var del = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

        var cls = this.theme[theme][classProperty + 'Class'];
        if (typeof cls === 'string') {
            if (del) {
                el.classList.remove(cls);
            } else {
                el.classList.add(cls);
            }
        } else {
            for (var k = 0; k < cls.length; k++) {
                if (del) {
                    el.classList.remove(cls[k]);
                } else {
                    el.classList.add(cls[k]);
                }
            }
        }
    },
    decorateDropdown: function decorateDropdown(dropdown) {
        var theme = arguments.length <= 1 || arguments[1] === undefined ? 'bs4' : arguments[1];

        this.buildClass(dropdown, 'dropdown', theme);
    },
    decorateDropdownItem: function decorateDropdownItem(item) {
        var theme = arguments.length <= 1 || arguments[1] === undefined ? 'bs4' : arguments[1];

        this.buildClass(item, 'dropdownItem', theme);
    },
    showDropdown: function showDropdown(el_to_apply_class) {
        var theme = arguments.length <= 1 || arguments[1] === undefined ? 'bs4' : arguments[1];

        this.buildClass(el_to_apply_class, 'show', theme);
    },
    hideDropdown: function hideDropdown(el_to_apply_class) {
        var theme = arguments.length <= 1 || arguments[1] === undefined ? 'bs4' : arguments[1];

        this.buildClass(el_to_apply_class, 'show', theme, true);
    }
};

/**
 * Base object Ajax
 */

var Ajax = {

    /**
     * Sends an async HTTP (AJAX) request or if last parameter is false - returns created instance
     * with ability to modify native XMLHttpRequest (.request property) and manually send request when needed.
     *
     * @param {string} method - HTTP method (GET, POST, HEAD, ...)
     * @param {string} url - URI for current domain or full URL for cross domain AJAX request
     *        Please note that in cross domain requests only GET, POST and HEAD methods allowed as well as
     *        only few headers available. For more info visit
     *        https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
     * @param {object} data - key: value pair of data to send. Data is automatically URL encoded
     * @param {callback(responseText)} on_success - callback on response with status code 200
     * @param {callback(responseText, responseStatusCode)} on_error = null - custom handler
     *        for response with status code different from 200
     * @param {object} headers = {} - key: value map of headers to send
     * @param {boolean} do_send = true - instantly makes requests
     *
     * @returns {Object}
     */

    create: function create(method, url, data, on_success) {
        var on_error = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
        var headers = arguments.length <= 5 || arguments[5] === undefined ? {} : arguments[5];
        var do_send = arguments.length <= 6 || arguments[6] === undefined ? true : arguments[6];

        var t = Object.create(this);
        t.method = method;
        t.url = url;
        t.data = data;
        t.request = new XMLHttpRequest();
        t.onSuccess = on_success;
        t.onError = on_error;
        t.headers = headers;
        t.request.onreadystatechange = function () {
            if (t.request.readyState === XMLHttpRequest.DONE) {
                if (t.request.status === 200) {
                    t.onSuccess(t.request.responseText);
                } else {
                    if (t.onError !== null) {
                        t.onError(t.request.responseText, t.request.status);
                    } else {
                        console.error('Bunny AJAX error: unhandled error with response status ' + t.request.status + ' and body: ' + t.request.responseText);
                    }
                }
            }
        };

        if (do_send) {
            t.send();
        }

        return t;
    },

    /**
     * Should be called on instance created with factory Ajax.create() method
     * Opens request, applies headers, builds data URL encoded string and sends request
     */
    send: function send() {

        this.request.open(this.method, this.url);

        for (var header in this.headers) {
            this.request.setRequestHeader(header, this.headers[header]);
        }

        var str_data = '';
        for (var name in this.data) {
            str_data = str_data + name + '=' + encodeURIComponent(this.data[name]) + '&';
        }
        this.request.send(str_data);
    },

    /**
     * Sends a form via ajax POST with header Content-Type: application/x-www-form-urlencoded
     * Data is automatically taken form all form input values
     *
     * @param {object} form_el - Form document element
     * @param {callback(responseText)} on_success - callback for status code 200
     * @param {callback(responseText, responseStatusCode)} on_error = null - custom handler for non 200 status codes
     * @param {object} headers = {'Content-Type': 'application/x-www-form-urlencoded'} - key: value map of headers
     */
    sendForm: function sendForm(form_el, on_success) {
        var on_error = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
        var headers = arguments.length <= 3 || arguments[3] === undefined ? { 'Content-Type': 'application/x-www-form-urlencoded' } : arguments[3];

        var data = {};
        form_el.querySelectorAll('[name]').forEach(function (input) {
            data[input.getAttribute('name')] = input.value;
        });
        this.create('POST', form_el.getAttribute('action'), data, on_success, on_error, headers, true);
    },

    /**
     * Sends a form via ajax POST with header Content-Type: multipart/form-data which is required for file uploading
     * Data is automatically taken form all form input values
     *
     * @param {object} form_el - Form document element
     * @param {callback(responseText)} on_success - callback for status code 200
     * @param {callback(responseText, responseStatusCode)} on_error = null - custom handler for non 200 status codes
     * @param {object} headers = {'Content-Type': 'multipart/form-data'} - key: value map of headers
     */
    sendFormWithFiles: function sendFormWithFiles(form_el, on_success) {
        var on_error = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
        var headers = arguments.length <= 3 || arguments[3] === undefined ? { 'Content-Type': 'multipart/form-data' } : arguments[3];

        this.sendForm(form_el, on_success, on_error, headers);
    },

    /**
     * Sends a simple GET request. By default adds header X-Requested-With: XMLHttpRequest
     * which allows back-end applications to detect if request is ajax.
     * However for making a cross domain requests this header might not be acceptable
     * and in this case pass an empty object {} as a last argument to send no headers
     *
     * @param {string} url - URI or full URL for cross domain requests
     * @param {callback(responseText)} on_success - callback for status code 200
     * @param {callback(responseText, responseStatusCode)} on_error = null - custom handler for non 200 status codes
     * @param headers = {'X-Requested-With': 'XMLHttpRequest'} key: value map of headers
     */
    get: function get(url, on_success) {
        var on_error = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
        var headers = arguments.length <= 3 || arguments[3] === undefined ? { 'X-Requested-With': 'XMLHttpRequest' } : arguments[3];

        this.create('GET', url, {}, on_success, on_error, headers, true);
    }

};

var AutocompleteController = {
    inputDelay: function inputDelay(handler, ms) {
        var timer = 0;
        (function () {
            clearTimeout(timer);
            timer = setTimeout(handler, ms);
        })();
    },
    attachInputTypeEvent: function attachInputTypeEvent(container_id) {
        var data_handler = arguments.length <= 1 || arguments[1] === undefined ? JSON.parse : arguments[1];
        var ajax_headers = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        var ac = Autocomplete.get(container_id);
        var timer = 0;
        ac._picked = false;
        ac.input.addEventListener('input', function () {
            var input = this;
            clearTimeout(timer);
            if (input.value.length >= ac.options.minCharLimit) {
                timer = setTimeout(function () {
                    var ajax_url = ac.ajaxUrl.replace('{search}', encodeURI(input.value));
                    Ajax.get(ajax_url, function (data) {
                        var $data = data_handler(data);
                        if ($data.length !== 0) {
                            Autocomplete.setItems(container_id, $data);
                            Autocomplete.show(container_id);
                        } else {
                            Autocomplete.hide(container_id);
                        }
                    }, function (response_text, status_code) {
                        if (ac.options.ajaxErrorHandler !== null) {
                            ac.options.ajaxErrorHandler(response_text, status_code);
                        }
                        Autocomplete.hide(container_id);
                    }, ajax_headers);
                }, ac.options.inputDelay);
            }
        });
    },
    attachInputFocusEvent: function attachInputFocusEvent(container_id) {
        var ac = Autocomplete.get(container_id);
        ac.input.addEventListener('focus', function (e) {
            ac._valueOnFocus = this.value;
        });
    },
    attachInputOutEvent: function attachInputOutEvent(container_id) {
        var ac = Autocomplete.get(container_id);
        ac.input.addEventListener('blur', function (e) {
            var input = this;
            setTimeout(function () {
                if (!ac._picked) {
                    // if item was not picked from list
                    if (ac.options.allowCustomInput) {
                        // custom input allowed, keep input value as is
                        // if there is hidden input set it to options default value (empty)
                        if (ac.hiddenInput !== null) {
                            ac.hiddenInput.value = ac.options.defaultCustomHiddenInputValue;
                        }
                    } else {
                        // custom input not allowed, restore default
                        if (ac._valueOnFocus !== input.value) {
                            // restore default only if value changed
                            Autocomplete.restoreDefaultValue(container_id);
                        }
                    }
                }
                ac._picked = false;
                Autocomplete.hide(container_id);
            }, 100);
        });
    },
    attachItemSelectEvent: function attachItemSelectEvent(container_id) {
        var ac = Autocomplete.get(container_id);
        for (var k = 0; k < ac.dropdownItems.length; k++) {
            ac.dropdownItems[k].addEventListener('click', function () {
                var attr_val = this.getAttribute('value');
                if (attr_val === null) {
                    attr_val = this.innerHTML;
                }
                ac._picked = true;
                Autocomplete.hide(container_id);
                ac.input.value = this.innerHTML;
                if (ac.hiddenInput !== null) {
                    ac.hiddenInput.value = attr_val;
                }
                for (var i = 0; i < ac.itemSelectHandlers.length; i++) {
                    ac.itemSelectHandlers[i](attr_val, this.innerHTML);
                }
            });
        }
    }
};

var Autocomplete = {

    _autocompleteContainers: [],
    _options: {
        theme: 'bs4',
        minCharLimit: 2,
        inputDelay: 300,
        allowCustomInput: false,
        defaultCustomHiddenInputValue: '',
        ajaxHeaders: {},
        ajaxErrorHandler: null
    },

    /**
     *
     * @param {string} input_id
     * @param {string} hidden_input_id
     * @param {string} ajax_url
     * @param {object} options
     */
    create: function create(input_id, hidden_input_id, ajax_url) {
        var data_handler = arguments.length <= 3 || arguments[3] === undefined ? JSON.parse : arguments[3];
        var options = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

        for (var i in this._options) {
            if (options[i] === undefined) {
                options[i] = this._options[i];
            }
        }

        if (ajax_url.indexOf('{search}') === -1) {
            console.error('BunnyJS Autocomplete.create() error: ajax_url must contain a {search}');
            return false;
        }

        var container_id = input_id + '_autocomplete';

        var container = document.getElementById(container_id);

        if (container === null) {
            console.error('BunnyJS Autocomplete.create() error: container for input with ID "' + input_id + '_autocomplete" not found.' + 'Input must be inside a container.');
            return false;
        }

        var input = document.getElementById(input_id);

        var default_value = input.getAttribute('value');

        var hidden_input = document.getElementById(hidden_input_id);

        var default_hidden_value = null;
        if (hidden_input !== null) {
            default_hidden_value = hidden_input.value;
        }

        var dropdown = AutocompleteMarkup.createEmptyDropdown();
        AutocompleteDecorator.decorateDropdown(dropdown, options.theme);

        this._autocompleteContainers[container_id] = {
            ajaxUrl: ajax_url,
            container: container,
            input: input,
            hiddenInput: hidden_input,
            dropdown: dropdown,
            dropdownItems: [],
            itemSelectHandlers: [],
            defaultValue: default_value,
            defaultHiddenValue: default_hidden_value,
            dataHandler: data_handler,
            _picked: false, // is picked from list, used in blur (focus out) event
            _onFocusValue: default_value, // value on focus
            options: options
        };

        container.appendChild(dropdown);

        AutocompleteController.attachInputTypeEvent(container_id, data_handler, options.ajaxHeaders);
        AutocompleteController.attachInputFocusEvent(container_id);
        AutocompleteController.attachInputOutEvent(container_id);
    },
    get: function get(container_id) {
        return this._autocompleteContainers[container_id];
    },
    setItems: function setItems(container_id, data) {
        var cont = this._autocompleteContainers[container_id];
        AutocompleteMarkup.removeDropdownItems(cont.dropdown);
        AutocompleteMarkup.createDropdownItemsFromData(data, function (item) {
            AutocompleteDecorator.decorateDropdownItem(item, cont.options.theme);
            cont.dropdownItems.push(item);
            cont.dropdown.appendChild(item);
        });
        AutocompleteController.attachItemSelectEvent(container_id);
    },
    show: function show(container_id) {
        AutocompleteDecorator.showDropdown(this._autocompleteContainers[container_id].container, this._autocompleteContainers[container_id].options.theme);
    },
    hide: function hide(container_id) {
        AutocompleteDecorator.hideDropdown(this._autocompleteContainers[container_id].container, this._autocompleteContainers[container_id].options.theme);
    },
    onItemSelect: function onItemSelect(container_id, handler) {
        this._autocompleteContainers[container_id].itemSelectHandlers.push(handler);
    },
    restoreDefaultValue: function restoreDefaultValue(container_id) {
        var ac = this.get(container_id);
        ac.input.value = this.get(container_id).defaultValue;
        if (ac.defaultHiddenValue !== null) {
            ac.hiddenInput.value = ac.defaultHiddenValue;
        }
    }
};

Autocomplete.create('country', 'country_id', 'https://restcountries.eu/rest/v1/name/{search}', function (response_data) {
    // Result for autocomplete should be an assoc array in format id: value
    // in this example free service is used to search countries and data it provides does not match required format for autocomplete.
    // With Autocomplete.create() 4th argument data_handler response text can be formatted manually.
    // For better performance server should return data in id: value format.
    data = JSON.parse(response_data);
    var result = {};
    data.forEach(function (country) {
        result[country.alpha2Code] = country.name;
    });
    return result;
});