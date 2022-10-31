import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import Video from '../pages/Video';
import UploadVideo from '../pages/UploadVideo';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/video/:id" exact component={Video} />
    <Route path="/upload" exact component={UploadVideo} />
  </Switch>
);

export default Routes;
