## Why
In my electron app I wanted to control the Tray from the main process so that the app could operate without an open window. So i used redux in the main process and then made all async calls from the main process. But if a browser window was open it should receive the same information at the same time without having to make duplicate calls.

## What
The middleware sends all the actions to all other processes using the middleware including the browser windows and the main process. This way all processes receive the same actions. You can use this functionality to react to other processes' actions or dispatch actions to communicate between processes.

## Install
`npm install --save electron-redux-actions`

## Use
```
import { createStore, applyMiddleware } from 'redux'
import electronMiddleware from "electron-redux-actions"
import rootReducer from '../reducers'

const enhancer = applyMiddleware(electronMiddleware)

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer)
}
```

Each action, foreign to the process has 2 extra key's:
- **fromMain**, *bool*, wheter or not the action was dispatched from the main process.
- **fromWindow**, *number*, the window ID of the process where the action was dispatched.

To exclude an action from being dispatched to other processes just set `private` to `true` in the action.
