'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;
var errorMessages = {
    required: 'This field is required',
    numeric: 'This value must be a number',
    email: 'This value must be an email address'
};
var validatorFns = {
    required: function required(v) {
        return v !== undefined && v !== null && v !== '';
    },
    numeric: function numeric(v) {
        return (/^string|number$/.test(typeof v === 'undefined' ? 'undefined' : _typeof(v)) && !isNaN(v)
        );
    },
    email: function email(v) {
        return (/.+@.+\..+/.test(v)
        );
    }
};
var isValid = function isValid(validatorName, value) {
    return validatorFns[validatorName](value);
};
var validate = function validate(validators, value) {
    var errorKey = validators.find(function (validator) {
        return !isValid(validator, value);
    });
    return {
        valid: !errorMessages[errorKey],
        errorMessage: errorMessages[errorKey]
    };
};
exports.errorMessages = errorMessages;
exports.isValid = isValid;
exports.validate = validate;