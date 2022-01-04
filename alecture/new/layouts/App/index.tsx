import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';

const Login = loadable(() => import('@new/pages/Login'));
const Signup = loadable(() => import('@new/pages/Signup'));
const Workspace = loadable(() => import('@new/layouts/Workspace'));

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login"></Redirect>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/workspace" component={Workspace} />

      {/* <Route path="/workspace/channel" component={Channel} />
      <Route path="/workspace/dm" component={DirectMessage} /> */}
    </Switch>
  );
};

export default App;
