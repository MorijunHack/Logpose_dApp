import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { Grid } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
// Route関連
import { Link } from 'react-router-dom';
import { TableBody, TableRow, TableCell } from '@material-ui/core';


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

class ProposalPaperContent extends Component {
  constructor(props){
    super(props);

    console.log(this.props);

    this.state = this.props.data
    
    // const setDataStatus = async () => {
    //   try {
    //     const dataStatus = await this.props.data;
    //     this.setState(dataStatus);
    //   } catch(error) {
    //     console.error(error)
    //   }
    // }
    // setDataStatus();
  }

  

  render(){
    // Material-ui関連
    const { classes } = this.props;

    console.log(this.state);

    return (
      <div>
        <h2>Proposal</h2>
            {/* <div className={classes.textLeft}>
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
            </div> */}
      </div>
    )

   
  }
}

ProposalPaperContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ProposalPaperContent);
