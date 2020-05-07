import React from 'react';
import ReactDom from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';

import store from './src/store/index';
import LoginComponent from './src/components/login/index';
import PlanetsComponent from './src/components/planets/index';
import './style.css';

class AppContainer extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    let { store } = this.context;
    store.subscribe(() => {
      this.forceUpdate();
    })
  }

  render() {
    return (
        <Router>
          <div>
            <Route exact path="/" component={LoginComponent} />
            <Route path="/planets" component={PlanetsComponent} />
          </div>
        </Router>
    )
  }
}

AppContainer.contextTypes = {
  store: PropTypes.object
};

ReactDom.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('app-container')
);
