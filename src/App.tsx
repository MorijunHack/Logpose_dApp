// React関連
import * as React from 'react';

// component読み込み
import ResponsiveDrawer from './containers/ResponsiveDrawer';
import Home from './containers/Home';
import Info from './containers/Info';
import MyPage from './containers/MyPage';
import RoomCreate from './containers/RoomCreate';
import MyRooms from './containers/MyRooms';
import RoomManage from './containers/RoomManage';
import Proposer from './containers/Proposer';
import MyProposals from './containers/MyProposals';
import WrapMainContent from './components/WrapMainContent'

// css読み込み
import './App.css';

// Route関連
import { Route, Switch, Redirect } from 'react-router-dom';


// 不明なRouteは全てNotFound
const NotFound = () => {
  return(
    <Redirect to="/" />
  )
}


const App: React.FC = () => {
  return (
    <div className="App">
      <ResponsiveDrawer className="ResponsiveDrawer">
        <Switch>
          <Route exact path="/" component={WrapMainContent(Home)} />
          <Route exact path="/info" component={WrapMainContent(Info)}/>
          <Route exact path="/user" component={WrapMainContent(MyPage)} />
          <Route exact path="/proposals" component={WrapMainContent(MyProposals)} />
          <Route exact path="/rooms" component={WrapMainContent(MyRooms)}/>
          <Route exact path="/room_create" component={WrapMainContent(RoomCreate)}/>
          <Route exact path="/room/:id/auth" component={WrapMainContent(RoomManage)}/>
          <Route exact path="/room/:id/proposer" component={WrapMainContent(Proposer)}/>
          <Route component={WrapMainContent(NotFound)}/>
        </Switch>
      </ResponsiveDrawer>
    </div>
  );
}

// React-Router情報取得
export default App;