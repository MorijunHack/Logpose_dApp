import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { accountDataByKey } from '@waves/waves-transactions/dist/nodeInteraction';
import { Grid } from '@material-ui/core';


// スタイル
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

    render() {

        // Material-ui関連
        const { classes } = this.props;

        return (
            <div>
                <h2>Proposal</h2>
                <div className={classes.textLeft}>
                    <Paper className={classes.root} elevation={1}>
                        <Typography variant="headline" component="h3">
                            {this.props.data.ansTitle}
                        </Typography>
                        <Grid container sm="3" justify="center">
                            <Typography component="p" className={classes.paragraph}>
                                <b>Description : </b>
                            </Typography>
                        </Grid>
                        <Grid container sm="9">
                            <Typography component="p" className={classes.paragraph}>
                                {this.props.data.ansDetail}
                            </Typography>
                        </Grid>
                        <Grid container sm="3" justify="center">
                            <Typography component="p" className={classes.paragraph}>
                                <b>URL : </b>
                            </Typography>
                        </Grid>
                        <Grid container sm="9">
                            <Typography component="p" className={classes.paragraph}>
                                {this.props.data.url}
                            </Typography>
                        </Grid>
                        <Grid container sm="3" justify="center">
                            <Typography component="p" className={classes.paragraph}>
                                evaluation of proposer : 
                            </Typography>
                        </Grid>
                        <Grid container sm="9">
                            <Typography component="p" className={classes.paragraph}>
                                {this.props.average}
                            </Typography>
                        </Grid>
                    </Paper>
                </div>
            </div>
        );
    }
}

// Material-ui関連
ProposalPaper.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};


// Material-uiのテーマ設定
export default withStyles(styles, { withTheme: true })(ProposalPaper);