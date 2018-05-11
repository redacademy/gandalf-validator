'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;
;
var errorMessages = {
    required: 'This field is required',
    numeric: 'This value must be a number',
    email: 'This value must be an email address',
    minLength: function minLength(v) {
        return 'This field must have at least ' + v + ' characters';
    },
    maxLength: function maxLength(v) {
        return 'This field must be ' + v + ' characters or less';
    },
    min: function min(v) {
        return 'This value must be ' + v + ' or more';
    },
    max: function max(v) {
        return 'This value must be ' + v + ' or less';
    },
    regex: function regex(v) {
        return 'This value is invalid';
    }
};
var validatorFns = {
    required: function required(v) {
        return v !== undefined && v !== null && v !== '';
    },
    numeric: function numeric(v) {
        return (/^string|number$/.test(typeof v === 'undefined' ? 'undefined' : _typeof(v)) && !isNaN(v)
        );
    },
    // RFC 2822 compliant, minus square brackets and double quotes
    // http://www.regular-expressions.info/email.html
    email: function email(v) {
        return (/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i.test(v)
        );
    },
    minLength: function minLength(v, l) {
        var str = v.toString();
        return str.length >= l;
    },
    maxLength: function maxLength(v, l) {
        var str = v.toString();
        return str.length <= l;
    },
    min: function min(v, l) {
        var num = parseInt(v, 10);
        return num >= l;
    },
    max: function max(v, l) {
        var num = parseInt(v, 10);
        return num <= l;
    },
    regex: function regex(v, r) {
        return r.test(v);
    }
};
var isValid = function isValid(validator, value) {
    if (typeof validator === 'string') {
        return validatorFns[validator](value);
    }
    return validatorFns[validator.name](value, validator.value);
};
var getErrorMessage = function getErrorMessage(validator) {
    if (!validator) return '';
    if (typeof validator === 'string') return errorMessages[validator];
    if (validator.message) return validator.message;
    if (typeof errorMessages[validator.name] === 'function') {
        return errorMessages[validator.name](validator.value);
    }
    return errorMessages[validator.name];
};
var validate = function validate(validators, value) {
    var firstFailedValidator = validators.find(function (validator) {
        return !isValid(validator, value);
    });
    return {
        valid: !firstFailedValidator,
        errorMessage: getErrorMessage(firstFailedValidator)
    };
};
exports.errorMessages = errorMessages;
exports.isValid = isValid;
exports.validate = validate;