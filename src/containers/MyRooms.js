// React関連
import React, { Component } from 'react';

// material-ui関連
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// component呼び出し
import RoomList from './RoomList';

// firebase関連
import firebase from "firebase/app";
import 'firebase/firestore';


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

              const data = [];

              const docRef = firebase.firestore().collection("users").doc(address).collection("rooms");
              await docRef
                  .where("roomerAddress", "==", address)
                  .orderBy("dead", "desc")
                  .orderBy("created", "desc")
                  .get()
                  .then(function(querySnapshot) {
                      querySnapshot.forEach(function(doc) {
                          data.push(doc.data());
                      });
                  })
                  .catch(function(error) {
                      console.log("Error getting documents: ", error);
                  });
              this.setState({datas: data});
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
