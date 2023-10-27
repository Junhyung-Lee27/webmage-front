import reportWebVitals from "./reportWebVitals";

import "./index.css";
import App from "./App";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import store from "./store/store";
import { Provider } from "react-redux";

// 유지되는 store 값이 다시 redux에 저장될 때까지 UI재렌더링을 지연시킴
// loading : 로딩 과정에서 보여줄 컴포넌트
// persistor : 로컬스토리지에 저장할 스토어
import { PersistGate } from "redux-persist/integration/react";

// 유지하고 싶은 redux store를 인자로 넣으면 persistor 객체 반환
import { persistStore } from "redux-persist";

export let persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
