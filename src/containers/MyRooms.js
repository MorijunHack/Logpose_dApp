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
import { Card, CardContent, CardActions, Typography, Avatar, Button } from '@material-ui/core';

import SendIcon from '@material-ui/icons/Send';

import { Link } from 'react-router-dom';

// // Redux関連
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import * as actions from '../actions';


// スタイル
const styles = theme => ({
  // Cards
  card: {
    width: 330,
    margin: 10,
  },
  empty: {
    width: 330,
    height: 0,
    margin: 0,
    padding: 0,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  
  // Avatar Icons
  avatar: {
    margin: 10,
  },
  wwwAvatar: {
    margin: 10,
    backgroundColor: '#6c1df2',
    padding: 7,
    boxSizing: 'border-box',
  },
  row: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
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
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  // Form
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },

  titleImage: {
    width: '30%',
    maxWidth: '200px',
    margin: '50px auto'
  }
});

class MyRooms extends Component {
    componentWillMount(){
        this.setState({
            invalid: true,
            address: '',
            datas: []
        });

        const { WavesKeeper } = window;
        const idUrl = this.props.match.params.id;

        const initState = async () => {
            try {
                const state = await WavesKeeper.publicState();
                const address = state.account.address;

                if (address === idUrl) {
                    this.setState({
                      address: address,
                      invalid: false
                    });
                    console.log(address);

                    const data = [];

                    const docRef = firebase.firestore().collection("users").doc(this.state.address).collection("rooms");
                    await docRef
                        .where("roomerAddress", "==", this.state.address)
                        .orderBy("limit", "desc")
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
                }
            }catch(error){
                console.error(error);
            }
        }
        initState();
        
    }

    constructor (props){
      super(props);
      // this.renderValidComponent = this.renderValidComponent.bind(this);
      this.renderInvalidComponent = this.renderInvalidComponent.bind(this);
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

    function proposer(address){
      return (
        "/room/" + address + "/proposer"
      );
    }

    function shower(address) {
      return (
        "/room/" + address
      )
    }

    return (
      <div className={classes.root}>
        {this.state.invalid &&
          this.renderInvalidComponent(classes)
        }

        <img src="/images/Logpose_blueTitle.png" alt="title" className={classes.titleImage}/>
        {this.state.datas.map((data)=>{
          return <div className={classes.cards}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="headline" component="h4">
                  {data.title}
                </Typography>
                {data.city !== '' &&
                  <Typography className={classes.title} color="textSecondary">
                    {data.city}
                  </Typography>
                }
                {data.genre !== '' &&
                  <Typography className={classes.title} color="textSecondary">
                    {data.genre}
                  </Typography>
                }
                {data.prize !== '' &&
                  <Typography className={classes.title} color="textSecondary">
                    {data.prize}
                  </Typography>
                }
                {data.limit !== '' &&
                  <Typography className={classes.title} color="textSecondary">
                    {data.limit.second}
                  </Typography>
                }
              </CardContent>
              <CardActions>
                <div className={classes.row}>
                  {data.roomKey !== '' &&
                    <Link to={proposer(data.roomKey)}>
                      <SendIcon className={classes.wwwAvatar} />
                    </Link>
                  }
                  {data.roomKey !== '' &&
                    <Link to={shower(data.roomKey)}>
                      <Avatar className={classes.wwwAvatar} src="/images/www.svg"/>
                    </Link>
                  }
                </div>
              </CardActions>
            </Card>
          </div>
        })};
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
