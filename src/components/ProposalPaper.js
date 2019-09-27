import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import firebase from "firebase/app";
import 'firebase/firestore';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { accountDataByKey } from '@waves/waves-transactions/dist/nodeInteraction';
import { Grid } from '@material-ui/core';
import { base58Encode, sha256, stringToBytes } from '@waves/ts-lib-crypto';

import * as waves from '../config/waves-config';

import ProposalPaperContent from './ProposalPaperContent';

const styles = theme => ({
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
      margin: 10,
    },
    textLeft: {
      textAlign: 'left',
    },
    paragraph: {
      marginTop: 10,
      marginBottom: 10,
    },
});
class ProposalPaper extends Component {
    constructor(props){
        super(props);
        console.log(this.props.data)

        

        this.state = this.props.data;

        // this.renderProposals = this.renderProposals.bind(this);

        console.log(this.state);
    }

    render() {

        // Material-ui関連
        const { classes } = this.props;

        console.log(this.state);

        let n = 0;

        return (
            <div>
                <h2>Proposal</h2>
                <div className={classes.textLeft}>
                    <Paper className={classes.root} elevation={1}>
                        <Typography variant="headline" component="h3">
                            {this.state.title}
                        </Typography>
                        <Grid container sm="3" justify="center">
                            <Typography component="p" className={classes.paragraph}>
                                <b>Description : </b>
                            </Typography>
                        </Grid>
                        <Grid container sm="9">
                            <Typography component="p" className={classes.paragraph}>
                                {this.state.detail}
                            </Typography>
                        </Grid>
                        <Grid container sm="3" justify="center">
                            <Typography component="p" className={classes.paragraph}>
                                <b>URL : </b>
                            </Typography>
                        </Grid>
                        <Grid container sm="9">
                            <Typography component="p" className={classes.paragraph}>
                                {this.state.url}
                            </Typography>
                        </Grid>
                        <Grid container sm="3" justify="center">
                            <Typography component="p" className={classes.paragraph}>
                                evaluation of proposer : 
                            </Typography>
                        </Grid>
                        <Grid container sm="9">
                            <Typography component="p" className={classes.paragraph}>
                                {this.state.average}
                            </Typography>
                        </Grid>
                    </Paper>
                </div>
            </div>
        );
    }
}

ProposalPaper.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles, { withTheme: true })(ProposalPaper);