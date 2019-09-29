import React, { Component } from 'react';
import PropTypes from 'prop-types';

import firebase from "firebase/app";
import 'firebase/firestore';

import { withStyles } from '@material-ui/core/styles';

import RoomList from './RoomList';


// スタイル
const styles = theme => ({
  title: {
    fontSize: 14,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    margin: '0 auto'
  },
  titleImage: {
    width: '30%',
    maxWidth: 350,
    margin: '20px auto'
  },
  imgWrapper: {
    width: '100%'
  }
});

class MyRooms extends Component {
  constructor (props){
    super(props);
    this.state ={
      invalid: true,
      address: '',
      datas: []
    };
    // this.renderValidComponent = this.renderValidComponent.bind(this);
    this.renderInvalidComponent = this.renderInvalidComponent.bind(this);
  }

  componentWillMount(){
      const { WavesKeeper } = window;
      // const idUrl = this.props.match.params.id;

      const initState = async () => {
          try {
              const state = await WavesKeeper.publicState();
              const address = state.account.address;
              this.setState({
                address: address,
                invalid: false
              });
              console.log(address);

              const data = [];

              const docRef = firebase.firestore().collection("users").doc(address).collection("rooms");
              await docRef
                  .where("roomerAddress", "==", address)
                  .orderBy("dead", "desc")
                  .orderBy("created", "desc")
                  .get()
                  .then(function(querySnapshot) {
                      querySnapshot.forEach(function(doc) {
                          console.log(doc.id, " => ", doc.data());
                          data.push(doc.data());
                      });
                      console.log(data)
                  })
                  .catch(function(error) {
                      console.log("Error getting documents: ", error);
                  });
              this.setState({datas: data});
              console.log(this.state.datas)
          }catch(error){
              console.error(error);
          }
      }
      initState();
      
  }

    renderInvalidComponent(classes) {
      return (
        <div>
          <h2>Your access is denied.</h2>
        </div>
      );
    }
  
  render() {
    
    // Material-ui関連
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {this.state.invalid &&
          this.renderInvalidComponent(classes)
        }

        <div className={classes.imgWrapper}>
          <img src="/images/Logpose_blueTitle.png" alt="title" className={classes.titleImage}/>
        </div>

        <RoomList datas={this.state.datas} />
        
      </div>
    );
  }
}

// Material-ui関連
MyRooms.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

// Material-uiのテーマ設定
export default withStyles(styles, { withTheme: true })(MyRooms);
