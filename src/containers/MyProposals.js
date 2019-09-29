// React関連
import React, { Component } from 'react';

// material-ui関連
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// component呼び出し
import ProposalList from './ProposalList';

// firebase関連
import firebase from "firebase/app";
import 'firebase/firestore';

// スタイル
const styles = theme => ({
    button: {
        marginTop: 30,
        marginBottom: 20,
        marginRight: 10,
        fontSize: 16,
        padding: 10,
        width: 250,
    },
    title: {
        color: 'indigo'
    },
    areaField: {
        width: '33%',
    },

    // Form
    formControl: {
        margin: theme.spacing.unit,
        minWidth: '80%'
    },

    cal: {
        width: '160px',
        marginRight: 20
    },

    prize: {
        width: '20%',
        marginRight: 20
    },
    genreSelector: {
        width: '290px',
        textAlign: 'left'
    }
});

class RoomManage extends Component {

    constructor(props){
        super(props);

        const { WavesKeeper } = window;
        let lister = [];

        const getDatas = async () => {
            try {
                const user = await WavesKeeper.publicState();
                const fireProp = firebase.firestore().collection("users").doc(user.account.address).collection("proposals");
                await fireProp.orderBy("created", "desc").get().then(function(querysnapshot){
                    querysnapshot.forEach(async function(doc){
                        lister.push(doc.data())
                    })
                })
                return lister
                
            } catch(error) {
                console.error(error);
            }
        }
        
        this.state = {
            datas: getDatas()
        }
        
    }
  
  
  render() {
    
    // Material-ui関連
    const { classes } = this.props;

    return (
      <div>
        <h1 className={classes.title}>MyProposals</h1>

        <ProposalList datas={this.state.datas} />

      </div>
    );
  }
}


// Material-ui関連
RoomManage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(RoomManage);