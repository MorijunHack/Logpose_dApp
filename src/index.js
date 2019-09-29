import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import config from './config/firebase-config';
import firebase from 'firebase';

// Material-UI
import { createMuiTheme, MuiThemeProvider  } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

// Router関連
import { BrowserRouter as Router } from 'react-router-dom';

import { blueGrey, indigo } from '@material-ui/core/colors';

// Material-UIテーマカスタマイズ
const theme = createMuiTheme({
  palette: {
    type: 'light', // light or dark
    primary: indigo, // primaryのカラー
    secondary: blueGrey, // secondaryのカラー
  },
});

firebase.initializeApp(config);


ReactDOM.render(
  <MuiThemeProvider theme={theme} >
    <Router>
      <App/>
    </Router>
  </MuiThemeProvider>
  , document.getElementById('root'));

serviceWorker.unregister();
