'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.withSwalInstance = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _sweetalert = require('sweetalert2');

var _sweetalert2 = _interopRequireDefault(_sweetalert);

var _lodash = require('lodash.pick');

var _lodash2 = _interopRequireDefault(_lodash);

var _mousetrap = require('mousetrap');

var _mousetrap2 = _interopRequireDefault(_mousetrap);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _outsideTargetHandlerFactory = require('./utils/outsideTargetHandlerFactory');

var _outsideTargetHandlerFactory2 = _interopRequireDefault(_outsideTargetHandlerFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ALLOWS_KEYS = ['title', 'text', 'type', 'customClass', 'showCancelButton', 'showConfirmButton', 'confirmButtonText', 'confirmButtonColor', 'confirmButtonClass', 'cancelButtonClass', 'cancelButtonText', 'buttonsStyling', 'reverseButtons', 'imageUrl', 'html', 'animation',
	'input',
	'inputValue', 'inputPlaceholder', 'showLoaderOnConfirm'];

var REMOVED_KEYS = ['timer', 'allowOutsideClick', 'allowEscapeKey'];

var OVERWRITE_PROPS = {
	allowOutsideClick: false,
	allowEscapeKey: false

	// reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
};var ALLOWS_INPUT_TYPES = ['button', 'checkbox', 'color', 'date', 'datetime', 'datetime-local', 'email', 'file', 'hidden', 'image', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week'];

function warningRemoved(props) {
	REMOVED_KEYS.forEach(function (key) {
		(0, _warning2.default)(props[key] === undefined, '%s has been removed from sweetalert-react, pass `show` props and use event hook instead.', '`' + key + '`');
	});
}

var withSwalInstance = exports.withSwalInstance = function withSwalInstance(swalInstance) {
	var _class, _temp;

	return _temp = _class = function (_Component) {
		_inherits(SweetAlert, _Component);

		/* eslint-disable react/no-unused-prop-types */
		function SweetAlert(props, context) {
			_classCallCheck(this, SweetAlert);

			var _this = _possibleConstructorReturn(this, (SweetAlert.__proto__ || Object.getPrototypeOf(SweetAlert)).call(this, props, context));

			_this._show = false;
			_this._swal = swalInstance;
			return _this;
		}
		/* eslint-enable react/no-unused-prop-types */

		_createClass(SweetAlert, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				this.setupWithProps(this.props);

				if (this.props.onOutsideClick) {
					this.registerOutsideClickHandler(this.props.onOutsideClick);
				}
			}
		}, {
			key: 'componentWillReceiveProps',
			value: function componentWillReceiveProps(props) {
				this.setupWithProps(props);

				var oldOutsideClickHandler = this.props.onOutsideClick;
				var newOutsideClickHandler = props.onOutsideClick;

				if (oldOutsideClickHandler !== newOutsideClickHandler) {
					if (oldOutsideClickHandler && newOutsideClickHandler) {
						this.unregisterOutsideClickHandler();
						this.registerOutsideClickHandler(newOutsideClickHandler);
					} else if (oldOutsideClickHandler && !newOutsideClickHandler) {
						this.unregisterOutsideClickHandler();
					} else if (!oldOutsideClickHandler && newOutsideClickHandler) {
						this.registerOutsideClickHandler(newOutsideClickHandler);
					}
				}
			}
		}, {
			key: 'componentWillUnmount',
			value: function componentWillUnmount() {
				this.unregisterOutsideClickHandler();
				this.unbindEscapeKey();
			}
		}, {
			key: 'setupWithProps',
			value: function setupWithProps(props) {
				var _this2 = this;

				warningRemoved(props);
				var show = props.show,
					onConfirm = props.onConfirm,
					onCancel = props.onCancel,
					onClose = props.onClose,
					onEscapeKey = props.onEscapeKey;

				if (show) {
					this._swal(_extends({}, (0, _lodash2.default)(props, ALLOWS_KEYS), OVERWRITE_PROPS)).then(function (result) {
						if (result.value) {
							console.log(result);
							_this2.handleClickConfirm(onConfirm(result));
						} else if (result.dismiss === _this2._swal.DismissReason.cancel) {
							_this2.handleClickCancel(onCancel, result.dismiss);
						}
					});
					this._show = true;
					if (onEscapeKey) this.bindEscapeKey(onEscapeKey);
				} else {
					this.handleClose(onClose);
				}
			}
		}, {
			key: 'registerOutsideClickHandler',
			value: function registerOutsideClickHandler(handler) {
				this._outsideClickHandler = (0, _outsideTargetHandlerFactory2.default)(document.getElementsByClassName('sweet-alert')[0], handler);
				this.enableOutsideClick();
			}
		}, {
			key: 'unregisterOutsideClickHandler',
			value: function unregisterOutsideClickHandler() {
				this.disableOutsideClick();
				this._outsideClickHandler = null;
			}
		}, {
			key: 'enableOutsideClick',
			value: function enableOutsideClick() {
				var fn = this._outsideClickHandler;
				if (fn) {
					document.addEventListener('mousedown', fn);
					document.addEventListener('touchstart', fn);
				}
			}
		}, {
			key: 'disableOutsideClick',
			value: function disableOutsideClick() {
				var fn = this._outsideClickHandler;
				if (fn) {
					document.removeEventListener('mousedown', fn);
					document.removeEventListener('touchstart', fn);
				}
			}
		}, {
			key: 'bindEscapeKey',
			value: function bindEscapeKey(onEscapeKey) {
				_mousetrap2.default.bind('esc', onEscapeKey);
			}
		}, {
			key: 'unbindEscapeKey',
			value: function unbindEscapeKey() {
				_mousetrap2.default.unbind('esc');
			}
		}, {
			key: 'handleClickConfirm',
			value: function handleClickConfirm(onConfirm) {
				if (onConfirm) {
					onConfirm(result);
				}
			}
		}, {
			key: 'handleClickCancel',
			value: function handleClickCancel(onCancel) {
				if (onCancel) {
					onCancel();
				}
			}
		}, {
			key: 'handleClose',
			value: function handleClose(onClose) {
				if (this._show) {
					this._swal.close();
					this.unbindEscapeKey();
					if (onClose) onClose();
					this._show = false;
				}
			}
		}, {
			key: 'render',
			value: function render() {
				return null;
			}
		}]);

		return SweetAlert;
	}(_react.Component), _class.propTypes = {
		// sweetalert option
		title: _propTypes2.default.string.isRequired,
		text: _propTypes2.default.string,
		type: _propTypes2.default.oneOf(['warning', 'error', 'success', 'info', 'question']),
		customClass: _propTypes2.default.string,
		showCancelButton: _propTypes2.default.bool,
		showConfirmButton: _propTypes2.default.bool,
		confirmButtonText: _propTypes2.default.string,
		confirmButtonColor: _propTypes2.default.string,
		confirmButtonClass: _propTypes2.default.string,
		cancelButtonText: _propTypes2.default.string,
		cancelButtonClass: _propTypes2.default.string,
		reverseButtons: _propTypes2.default.bool,
		buttonsStyling: _propTypes2.default.bool,
		imageUrl: _propTypes2.default.string,
		html: _propTypes2.default.bool,
		animation: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.oneOf(['pop', 'slide-from-top', 'slide-from-bottom'])]),
		input: _propTypes2.default.oneOf(ALLOWS_INPUT_TYPES),
		inputPlaceholder: _propTypes2.default.string,
		inputValue: _propTypes2.default.string,
		showLoaderOnConfirm: _propTypes2.default.bool,

		// custom option
		show: _propTypes2.default.bool,
		onConfirm: _propTypes2.default.func,
		onCancel: _propTypes2.default.func,
		onClose: _propTypes2.default.func,
		onEscapeKey: _propTypes2.default.func,
		onOutsideClick: _propTypes2.default.func }, _class.defaultProps = {
		// sweetalert option
		text: null,
		type: null,
		customClass: null,
		showCancelButton: false,
		showConfirmButton: true,
		confirmButtonText: 'OK',
		confirmButtonColor: '#aedef4',
		cancelButtonText: 'Cancel',
		cancelButtonClass: null,
		confirmButtonClass: null,
		buttonsStyling: true,
		reverseButtons: false,
		imageUrl: null,
		html: false,
		animation: true,
		input: null,
		inputPlaceholder: "",
		inputValue: "",
		showLoaderOnConfirm: false,

		// custom option
		show: false
	}, _temp;
};

exports.default = withSwalInstance(_sweetalert2.default);
