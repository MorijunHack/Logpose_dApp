import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as waves from '../config/waves-config';

import { withStyles } from '@material-ui/core/styles';

// コンポーネントの準備
import RoomCard from '../components/RoomCard'
import { accountDataByKey } from '@waves/waves-transactions/dist/nodeInteraction';

// スタイル
const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
});

class RoomList extends Component {

  constructor(props){
    super(props);
    this.renderListItem = this.renderListItem.bind(this);
  }

  async renderListItem(roomKey, txHash){
    // dataをblockchainから落とす
    const dataStr = await accountDataByKey(roomKey + "_data", waves.dAppAddress, waves.nodeUrl);
    let data = JSON.parse(dataStr.value);
    console.log(data);

    // dataの日付表記を変更
    function fixDateTime(date) {
      const arr = date.split('');
      console.log(arr);
      let arr2 = [];
      for (let i = 0; i < 10; i++) {
          arr2.push(arr[i]);
      }
      console.log(arr2);

      let arr3 = [];
      for (let j = 11; j < 16; j++) {
          arr3.push(arr[j])
      }
      console.log(arr3);

      arr2 = arr2.join(',');
      arr3 = arr3.join(',');

      let date2 = arr2 + ' ' + arr3;
      date2 = date2.replace(/,/g, '');

      return date2;
    }

    function fixDate(date){
        const arr = date.split('');
        console.log(arr);
        let arr2 = [];
        for (let i = 0; i < 10; i++) {
            arr2.push(arr[i]);
        }
        arr2 = arr2.join(',');
        arr2 = arr2.replace(/,/g, '');

        return arr2
    }

    data.created = fixDateTime(data.created);
    data.dead = fixDateTime(data.dead);
    data.when = fixDate(data.when);

    // author要素の追加
    let roomer = await accountDataByKey(roomKey + "_roomer", waves.dAppAddress, waves.nodeUrl);
    roomer = roomer.value
    const { WavesKeeper } = window;
    let watcher = await WavesKeeper.publicState();
    watcher = watcher.account.address;
    if (roomer === watcher){
      data.author = true;
    } else {
      data.author = false;
    }

    console.log(data);

    return data;
  }

  render() {
    
    // Material-ui関連
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {this.props.datas.map((data) => {
          const datas =  this.renderListItem(data.roomKey, data.txHash)
          return  <RoomCard data={datas} roomKey={data.roomKey} txHash={data.txHash} />
        })}
      </div>
    );

  }
}

// Material-ui関連
RoomList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(RoomList);