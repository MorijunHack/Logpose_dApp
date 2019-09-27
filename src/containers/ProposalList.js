import React, { Component } from 'react';
import PropTypes from 'prop-types';

import firebase from "firebase/app";
import 'firebase/firestore';

import * as waves from '../config/waves-config';

import { withStyles } from '@material-ui/core/styles';

// コンポーネントの準備
import ProposalPaper from '../components/ProposalPaper'
import { accountDataByKey } from '@waves/waves-transactions/dist/nodeInteraction';
import { base58Encode, sha256, stringToBytes } from '@waves/ts-lib-crypto'


// スタイル
const styles = theme => ({
  root: {
  },
  genretitle: {
    marginTop: '50px',
    color: 'indigo'
},
});

const a = [];

class ProposalList extends Component {    

    constructor(props){
        super(props);

        console.log(this.props.datas)
        
        const setDataStatus = async () => {
          try {
            const dataStatus = await this.props.datas;
            console.log(dataStatus)
            // this.setState({datas: dataStatus});
            // console.log(this.state)

            for (let i = 0; i<dataStatus.length; i++){
                a.push(dataStatus[i]);
            }
            // a.greet = 'hello'
            console.log(a)
          } catch(error) {
            console.error(error)
          }
        }
        setDataStatus();

        console.log(a)
        
        this.state = {
            datas: a
        }

        console.log(this.state)
    
        // this.getDatas = this.getDatas.bind(this);
    }


    render() {
        
        // Material-ui関連
        const { classes } = this.props;

        console.log(a)
        console.log(this)
        console.log(this.state)
        console.log(this.state.datas)

        const ddd = this.state

        console.log(ddd)

        console.log(ddd.datas)

        return (
            <div className={classes.root}>
                {this.state.datas.map((data)=>{
                    return <ProposalPaper data={data} />
                })}
            </div>
          );
    }
}

// Material-ui関連
ProposalList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ProposalList);