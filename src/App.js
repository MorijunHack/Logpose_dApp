import React, { Component } from 'react';

// コンテナ読み込み
import ResponsiveDrawer from './containers/ResponsiveDrawer';
import Notification from './containers/Notification';
import Home from './containers/Home';
import Info from './containers/Info';
import MyPage from './containers/MyPage';
import RoomCreate from './containers/RoomCreate';
import RoomEdit from './containers/RoomEdit';
import ProposalCreate from './containers/ProposalCreate';
import MyRooms from './containers/MyRooms';


// コンポーネント読み込み
import WrapMainContent from './components/WrapMainContent'

// 共通スタイル読み込み
import './App.css';

// Route関連
import { Route, Switch } from 'react-router-dom';

// 不明なRouteは全てNotFound
const NotFound = () => {
  return(
    <h2>ページが見つかりません</h2>
  )
}


class App extends Component {

  render() {
    return (
      <div className="App">
        <Notification/>
        <ResponsiveDrawer className="ResponsiveDrawer">
          <Switch>
            <Route exact path="/" component={WrapMainContent(Home)} />
            <Route exact path="/info" component={WrapMainContent(Info)}/>
            <Route exact path="/user/:id" component={WrapMainContent(MyPage)}/>
            <Route exact path="/rooms/:id" component={WrapMainContent(MyRooms)}/>
            <Route exact path="/room_create" component={WrapMainContent(RoomCreate)}/>
            <Route exact path="/room_edit" component={WrapMainContent(RoomEdit)}/>
            <Route exact path="/propose" component={WrapMainContent(ProposalCreate)}/>
            <Route component={WrapMainContent(NotFound)}/>
          </Switch>
        </ResponsiveDrawer>
      </div>
    );
  }
}


// React-Router情報取得
export default App;