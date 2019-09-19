import React, { Component } from 'react';
import PropTypes from 'prop-types';

import firebase from "firebase/app";
import 'firebase/firestore';

import { withStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';

// コンポーネントを引き出す
import RoomCard from '../components/RoomCard'

// Redux関連
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';


// スタイル
const styles = theme => ({
  titleImage: {
    width: '100%',
    maxWidth: 350,
  },
  
  button: {
    marginTop: 30,
    marginBottom: 20,
    fontSize: 16,
    padding: 10,
    width: 250,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  root: {
  },

  // Form
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

class MyRooms extends Component {
    componentWillMount(){
        this.setState({
            invalid: false,
            address: '',
            data: []
        });

        const { WavesKeeper } = window;
        const idUrl = this.props.match.params.id;

        const initState = async () => {
            try {
                const state = await WavesKeeper.publicState();
                const address = state.account.address;

                if (address === idUrl) {
                    this.setState({address: address});
                    console.log(address);

                    const data = [];

                    const docRef = firebase.firestore().collection("users").doc(this.state.address).collection("rooms");
                    docRef
                        .where("roomerAddress", "==", this.state.address)
                        .orderBy("limit", "desc")
                        .orderBy("created", "desc")
                        .get()
                        .then(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {
                                console.log(doc.id, " => ", doc.data());
                                data.push(doc);
                            });
                            console.log(data)
                        })
                        .catch(function(error) {
                            console.log("Error getting documents: ", error);
                        });
                    console.log(data);
                    
                    console.log(this.state.data)
                } else {
                    this.setState({invalid: true});
                }
            }catch(error){
                console.error(error);
            }
        }
        initState();
        
    }
  
  render() {

    // redux関連
    const { actions } = this.props;
    // const { selectedOption } = this.state.selectedOption;
    
    // Material-ui関連
    const { classes } = this.props;

    return (
      <div>
        <img src="/images/Logpose_blueTitle.png" alt="title" className={classes.titleImage}/>
        {/* <form autoComplete="off">
          <FormControl className={classes.formControl}>
            <InputLabel shrink>都市名</InputLabel>
            <Select
              value={this.state.cityname}
              onChange={this.handleChange}
              onKeyDown={this.enterDown}
              options={this.state.options}
            />
          </FormControl>
        </form> */}
        
      </div>
    );
  }
}

// Material-ui関連
MyRooms.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

// Material-uiのテーマ設定＋Redux設定
export default withStyles(styles, { withTheme: true })(MyRooms);
