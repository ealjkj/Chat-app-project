import { applyMiddleware, createStore } from "redux";
import reducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));

// typeof window === "object" &&
// typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
// ? window.__REDUX_DEVTOOLS_EXTENSION__()
// : (f) => f

sagaMiddleware.run(rootSaga);

export default store;
