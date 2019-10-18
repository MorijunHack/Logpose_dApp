// React関連
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// css読み込み
import './index.css';

// App読み込み
import App from './App';
import * as serviceWorker from './serviceWorker';

// firebase関連
import config from './config/firebase-config';
import firebase from 'firebase';

// Material-UI
import { createMuiTheme, MuiThemeProvider  } from '@material-ui/core/styles';
import { blueGrey, indigo } from '@material-ui/core/colors';

// Router関連
import { BrowserRouter as Router } from 'react-router-dom';



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
