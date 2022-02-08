/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from "react";
import LoginAndSignUp from "./screens/LoginAndSignUp";
import { Loading } from "./Loading";
import { useLoading } from "./Loading";
const App = () => {
  const { showLoading, setshowLoading } = useLoading();

  const fakeTimeOut = () => {
    setTimeout(() => {
      setshowLoading(false);
    }, 2000);
  };

  useEffect(() => {
    fakeTimeOut();
  }, []);

  return showLoading ? <Loading /> : <LoginAndSignUp />;
};

export default App;
