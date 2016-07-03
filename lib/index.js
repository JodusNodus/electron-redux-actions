"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = electronShare;

var _isElectronRenderer = require("is-electron-renderer");

var _isElectronRenderer2 = _interopRequireDefault(_isElectronRenderer);

var _electron = require("electron");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function electronShare(store) {
  var channel = "@electron-redux-actions";
  var currWindow = _isElectronRenderer2.default ? _electron.remote.getCurrentWindow().id : null;

  var handler = function handler(event, action) {
    return store.dispatch(action);
  };

  if (_isElectronRenderer2.default) {
    _electron.ipcRenderer.on(channel, handler);
  } else {
    _electron.ipcMain.on(channel, handler);
  }

  return function (next) {
    return function (action) {
      var newAction = action;
      var windows = (_isElectronRenderer2.default ? _electron.remote.BrowserWindow : _electron.BrowserWindow).getAllWindows();
      if (!action.fromWindow && !action.fromMain && !action.private) {
        if (_isElectronRenderer2.default) {
          newAction = _extends({}, action, {
            fromMain: false,
            fromWindow: currWindow
          });
          _electron.ipcRenderer.send(channel, newAction);
          windows = windows.filter(function (win) {
            return win.id != currWindow;
          });
        } else {
          newAction = _extends({}, action, {
            fromMain: true,
            fromWindow: 0
          });
        }
        windows.forEach(function (win) {
          win.webContents.send(channel, newAction);
        });
      }

      next(action);
    };
  };
}