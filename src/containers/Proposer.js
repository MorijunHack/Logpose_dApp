// React関連
import React, { Component } from 'react';

// material-ui関連
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import 'date-fns';

// firebase関連
import firebase from "firebase/app";
import 'firebase/firestore';

// waves関連
import * as waves from '../config/waves-config';
import { base58Encode, sha256, stringToBytes } from '@waves/ts-lib-crypto'
import { currentHeight, accountDataByKey } from '@waves/waves-transactions/dist/nodeInteraction';

// component関連
import RoomInfo from '../components/RoomInfo';

// スタイル
const styles = theme => ({
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
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: '10px auto',
        width: '80%'
    },
    textLeft: {
        textAlign: 'left',
    },
    paragraph: {
        marginTop: 10,
        marginBottom: 10,
    },

    // Form
    formControl: {
        margin: theme.spacing.unit,
        minWidth: '80%'
    },
});

class Proposer extends Component {

    constructor(props){
        super(props);
        const id = this.props.match.params.id;

        this.state = {
            author: false,
            roomKey: id,
            roomer: '',
            proposer: '',
            ansTitle: '',
            ansDetail: '',
            url: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount(){
        const { WavesKeeper } = window;

        const initState = async () => {
            try {
                let roomer = await accountDataByKey(this.state.roomKey + "_roomer", waves.dAppAddress, waves.nodeUrl);
                roomer = roomer.value;

                let proposalCount = await accountDataByKey(this.state.roomKey + "_proposals", waves.dAppAddress, waves.nodeUrl);
                if (proposalCount === null) {
                    proposalCount = {value: 0}
                }

                const proposerState = await WavesKeeper.publicState();

                let proposer = proposerState.account.address;

                if (roomer === proposer){
                    this.setState({
                        author: true,
                        roomer: roomer,
                        proposer: proposer,
                    });
                } else {
                    this.setState({
                        roomer: roomer,
                        proposer: proposer,
                    });
                }

            } catch(error) {
                console.error(error);
            }
        }
        await initState();
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    async handleSubmit() {
        const { WavesKeeper } = window;
        const now = await currentHeight(waves.nodeUrl);
        
        const data = {
            status: "posted",
            room: this.state.roomKey,
            roomer: this.state.roomer,
            proposer: this.state.proposer,
            title: this.state.ansTitle,
            detail: this.state.ansDetail,
            url: this.state.url,
            height: now,
        }

        if (this.state.author){
            alert('Author cannot propose your own request');
            this.setState({
                roomKey: '',
                roomInfo: {},
                proposer: '',
                ansTitle: '',
                ansDetail: '',
                url: ''
            });
        } else {
            WavesKeeper.signAndPublishTransaction({
                type: 16,
                data: {
                    fee: {
                        "tokens": "0.05",
                        "assetId": "WAVES"
                    },
                    dApp: waves.dAppAddress,
                    call: {
                            function: 'createProposal',
                            args: [
                                {type: "string",value: data.room},
                                {type: "string", value: JSON.stringify(data)},
                                {type: "string",value: data.title},
                                {type: "integer",value: data.height},
                            ]
                        }, payment: []
                }
            }).then(async (tx) => {
    
                // txhashを求める
                const res = JSON.parse(tx);
                const txid = res["id"];
    
                // proposeKeyを求める
                const contributor = this.state.proposer;
                const proposeKey = "propose_" + base58Encode(sha256(stringToBytes(contributor + data.title + JSON.stringify(data))));
    
                // firestoreに書き込む
                const firedata = {
                    txHash: txid,
                    proposeKey: proposeKey,
                    status: "posted",
                    roomKey: this.state.roomKey,
                    contributorAddress: contributor,
                    roomerAddress: this.state.roomer,
                    // propose: {title: this.state.ansTitle, detail: this.state.ansDetail, url: this.state.url},
                    created: new Date()
                }
    
                const db = firebase.firestore().collection('users').doc(firedata.roomerAddress).collection("rooms").doc(firedata.roomKey).collection("proposals").doc(firedata.proposeKey);
                db.set(firedata).then(function() {
                    alert('Your Propose has been sent Successfully!\nTxid:  ' + txid);
                });
        
                // ステートを戻す
                this.setState({
                    roomKey: '',
                    roomInfo: {},
                    proposer: '',
                    ansTitle: '',
                    ansDetail: '',
                    url: ''
                });
            }).catch((error) => {
                    console.error("Something went wrong", error);
            });
        }
    }

  
  
  render() {
    
    // Material-ui関連
    const { classes } = this.props;

    return (
      <div>
        <RoomInfo roomKey={this.state.roomKey} />
        
        <h1>Proposal Create Form</h1>

        <form autoComplete="off">
            <FormControl className={classes.formControl}>
                <TextField
                    id="ansTitle"
                    name="ansTitle"
                    label="Title of Proposal"
                    className={classes.textField}
                    value={this.state.ansTitle}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    type="text"
                    required="true"
                />
            </FormControl>

            <FormControl className={classes.formControl}>
                <TextField
                    id="ansDetail"
                    name="ansDetail"
                    label="Detail of your proposal"
                    className={classes.textField}
                    value={this.state.ansDetail}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    multiline="true"
                    rows="7"
                    type="text"
                    required="true"
                />
            </FormControl>

            <FormControl className={classes.formControl}>
                <TextField
                    id="url"
                    name="url"
                    label="URL (optional)"
                    className={classes.textField}
                    value={this.state.url}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    type="text"
                />
            </FormControl>
        </form>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.handleSubmit}
        >
          Send Proposal
        </Button>
      </div>
    );
  }
}

// Material-ui関連
Proposer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Proposer);