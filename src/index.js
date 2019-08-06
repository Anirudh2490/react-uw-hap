import React from "react";
import ReactDOM from "react-dom";
// import "./index.css";
import App from "./component/App";
import * as serviceWorker from "./serviceWorker";
import { CreateStore } from "./store";
import Firebase, { FirebaseContext } from "./component/Firebase";
import { Provider } from "react-redux"
import ContentFul, {ContentFulContext} from './component/ContentFul'

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <ContentFulContext.Provider value={new ContentFul()}>
    <Provider store={CreateStore}>
     {App()}
    </Provider>
    </ContentFulContext.Provider>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
