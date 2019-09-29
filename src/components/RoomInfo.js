import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { accountDataByKey } from '@waves/waves-transactions/dist/nodeInteraction';
import { base58Encode, sha256, stringToBytes } from '@waves/ts-lib-crypto';
import { Paper, Typography, withStyles } from '@material-ui/core';
import * as waves from '../config/waves-config';


const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: '10px auto',
        width: '80%'
    },
    paragraph: {
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20
    },
    textLeft: {
        textAlign: 'left',
    },
    contents: {
        marginTop: 15,
        marginLeft: 30,
        marginBottom: 15
    }
});

class RoomInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            roomKey: '',
            proposer: '',
            roomInfo: {},
            roomerInfo: {}
        }
        console.log(this.props);
    }

    componentWillMount(){

        console.log(this.props.roomKey);

        const id = this.props.roomKey;

        const { WavesKeeper } = window;

        const initState = async () => {
            try {
                let roomer = await accountDataByKey(id + "_roomer", waves.dAppAddress, waves.nodeUrl);
                roomer = roomer.value;
                console.log(roomer);

                const roomerKey = base58Encode(sha256(stringToBytes(roomer)));

                let proposalCount = await accountDataByKey(id + "_proposals", waves.dAppAddress, waves.nodeUrl);
                if (proposalCount === null) {
                    proposalCount = {value: 0}
                }

                let roomerMeal = await accountDataByKey(roomerKey + '_mealpolicy', waves.dAppAddress, waves.nodeUrl);
                if (roomerMeal === null) {
                    roomerMeal = {value: 'not set'};
                }
                let roomerSex = await accountDataByKey(roomerKey + '_sex', waves.dAppAddress, waves.nodeUrl);
                if (roomerSex === null){
                    roomerSex = {value: 'not set'}
                }
                let roomerAge = await accountDataByKey(roomerKey + '_age', waves.dAppAddress, waves.nodeUrl);
                if (roomerAge === null) {
                    roomerAge = {value: 'not set'}
                }
                let roomerHobby = await accountDataByKey(roomerKey + '_hobby', waves.dAppAddress, waves.nodeUrl);
                if (roomerHobby === null) {
                    roomerHobby = {value: 'not set'}
                }
                let roomerArea = await accountDataByKey(roomerKey + '_area', waves.dAppAddress, waves.nodeUrl);
                if (roomerArea === null) {
                    roomerArea = {value: 'not set'}
                }
                let roomerRoomCount = await accountDataByKey(roomerKey + '_roomCount', waves.dAppAddress, waves.nodeUrl);
                let roomerAdoptCount = await accountDataByKey(roomerKey + '_adoptCount', waves.dAppAddress, waves.nodeUrl);
                if (roomerAdoptCount === null) {
                    roomerAdoptCount = {value: 0};
                }

                const adoptionRatio = String( Math.floor( 100 * roomerAdoptCount.value / roomerRoomCount.value ) ) + '%';

                let roomData = await accountDataByKey(id + "_data", waves.dAppAddress, waves.nodeUrl);
                console.log(roomData);

                roomData = JSON.parse(roomData.value);
                console.log(roomData);

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

                const roomerData = {
                    address: roomer,
                    name: roomData.roomerName,
                    mealpolicy: roomerMeal.value,
                    sex: roomerSex.value,
                    age: roomerAge.value,
                    hobby: roomerHobby.value,
                    area: roomerArea.value,
                    roomCount: roomerRoomCount.value,
                    adoptionRatio: adoptionRatio,
                }
                console.log(roomerData);

                const roomData2 = {
                    city: roomData.city,
                    created: fixDateTime(roomData.created),
                    dead: fixDateTime(roomData.dead),
                    detail: roomData.detail,
                    genre: roomData.genre,
                    prize: String(Number(roomData.prize).toFixed(8)),
                    title: roomData.title,
                    when: fixDate(roomData.when),
                    proposalCount: proposalCount.value
                }
                console.log(roomData2);

                this.setState({
                    roomKey: id,
                    roomInfo: roomData2,
                    roomerInfo: roomerData
                });
                console.log(this);

            } catch(error) {
                console.error(error);
            }
        }
        initState();

        console.log(this);
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.textLeft}>
                <Paper className={classes.root} elevation={1}>
                    <Typography variant="headline" component="h2">
                        Request Information
                    </Typography>
                    <div className={classes.contents}>
                        <Typography variant="headline" component="h3">
                            "{this.state.roomInfo.title}"
                        </Typography>
                        
                        <ul>
                            <li>
                                <Typography component="p" className={classes.paragraph}>
                                    <b>Prize :</b>  {this.state.roomInfo.prize}　WAVES
                                </Typography>
                            </li>
                            <li>
                                <Typography component="p" className={classes.paragraph}>
                                    <b>Genre :</b>  {this.state.roomInfo.genre}
                                </Typography>
                            </li>
                            <li>
                                <Typography component="p" className={classes.paragraph}>
                                    <b>When :</b>  {this.state.roomInfo.when}
                                </Typography>
                            </li>
                            <li>
                                <Typography component="p" className={classes.paragraph}>
                                    <b>Deadline :</b>  {this.state.roomInfo.dead}  
                                </Typography>
                            </li>
                            <li>
                                <Typography component="p" className={classes.paragraph}>
                                    <b>Number of Proposals :</b>  {this.state.roomInfo.proposalCount}  
                                </Typography>
                            </li>
                        </ul>
                        
                        <Typography variant="headline" component="h3">
                            Request Description 
                        </Typography>
                        <Typography component="p" className={classes.paragraph}>
                            {this.state.roomInfo.detail}
                        </Typography>
                    </div>
                </Paper>

                <Paper className={classes.root} elevation={1}>
                    <Typography variant="headline" component="h2">
                        Requester Information
                    </Typography>
                    <div className={classes.contents}>
                        <Typography variant="headline" component="h3">
                            {this.state.roomerInfo.name}
                        </Typography>
                        <ul>
                            <li>
                                <Typography component="p" className={classes.paragraph}>
                                    <b>Age :</b>  {this.state.roomerInfo.age}
                                </Typography>
                            </li>
                            <li>
                                <Typography component="p" className={classes.paragraph}>
                                    <b>Gender :</b>  {this.state.roomerInfo.sex}
                                </Typography>
                            </li>
                            <li>
                                <Typography component="p" className={classes.paragraph}>
                                    <b>Living Area :</b>  {this.state.roomerInfo.area}
                                </Typography>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <Typography component="p" className={classes.paragraph}>
                                    <b>Foods or Foodstuffs requester can't eat :</b>  {this.state.roomerInfo.mealpolicy}
                                </Typography>
                            </li>
                            <li>
                                <Typography component="p" className={classes.paragraph}>
                                    <b>Hobby :</b>  {this.state.roomerInfo.hobby}
                                </Typography>
                            </li>
                            <li>
                                <Typography component="p" className={classes.paragraph}>
                                    <b>Adoption Ratio :</b>  {this.state.roomerInfo.adoptionRatio} (number of requests :  {this.state.roomerInfo.roomCount})
                                </Typography>
                            </li>
                        </ul>
                    </div>
                </Paper>
            </div>
        );
    }
}

// Material-ui関連
RoomInfo.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles, { withTheme: true })(RoomInfo);