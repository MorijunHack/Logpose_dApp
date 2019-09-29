// React関連
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// firebase関連
import firebase from "firebase/app";
import 'firebase/firestore';

// material-ui関連
import { withStyles } from '@material-ui/core/styles';

// component呼び出し
import HomeList from './HomeList';



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

class Home extends Component {
  constructor (props){
    super(props);
    this.state ={
      datas: []
    };
  }

  componentWillMount(){
    const initState = async () => {
        try {
          const data = [];

          const docRef = firebase.firestore().collection("rooms");
          await docRef
              .where("dead", ">", new Date())
              .where("state", "==", "opened")
              .orderBy("dead")
              .orderBy("created")
              .get()
              .then(function(querySnapshot) {
                  querySnapshot.forEach(async function(doc) {
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
  
  render() {
    
    // Material-ui関連
    const { classes } = this.props;

    return (
      <div className={classes.root}>

        <div className={classes.imgWrapper}>
          <img src="/images/Logpose_blueTitle.png" alt="title" className={classes.titleImage}/>
        </div>

        <HomeList datas={this.state.datas} />
        
      </div>
    );
  }
}

// Material-ui関連
Home.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

// Material-uiのテーマ設定
export default withStyles(styles, { withTheme: true })(Home);
