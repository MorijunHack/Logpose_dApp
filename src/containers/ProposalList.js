import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as waves from '../config/waves-config';

import { withStyles } from '@material-ui/core/styles';

// コンポーネントの準備
import ProposalPaper from '../components/ProposalPaper'
import { accountDataByKey } from '@waves/waves-transactions/dist/nodeInteraction';
import { base58Encode, sha256, stringToBytes } from '@waves/ts-lib-crypto'


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

    async renderListItem(data){
        const proposerKey = base58Encode(sha256(stringToBytes(data.proposer)));

        const count = await accountDataByKey(proposerKey + '_evaluateCount', waves.dAppAddress, waves.nodeUrl);
        if (count === null) {
            count = {value: 1}
        }
        const total = await accountDataByKey(proposerKey + '_evaluateTotal', waves.dAppAddress, waves.nodeUrl);
        if (total === null) {
            total = {value: 0}
        }

        data.average = String((total.value / count.value).toFixed(3)) + " %";

        console.log(data);

        return data
    }

    render() {
        
        // Material-ui関連
        const { classes } = this.props;

        return (
        <div className={classes.root}>
            {this.props.datas.map((data) => {
                const datas =  this.renderListItem(this.props.data)
                return  <ProposalPaper data={datas} roomKey={data.roomKey} txHash={data.txHash} />
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