// React関連
import React, { Component } from 'react';
// material-ui関連
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { TableBody, TableRow, TableCell } from '@material-ui/core';
// Route関連
import { Link } from 'react-router-dom';
// waves関連
import { base58Encode, sha256, stringToBytes } from '@waves/ts-lib-crypto';
import { accountDataByKey } from '@waves/waves-transactions/dist/nodeInteraction';
import * as waves from '../config/waves-config';


const styles = {
  // Cards
  card: {
    width: 330,
    height: 460,
    margin: 10,
  },
  top: {
    height: '50px',
    color: 'indigo'
  },
  title: {
    fontSize: 14,
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
  list: {
    margin: '0 auto',
  },
  content: {
    paddingBottom: 0
  }
};

class HomeCard extends Component {
  constructor(props){
    super(props);
    this.state = {}
    
    const setDataStatus = async () => {
      try {
        const dataStatus = await this.props.data;
        const roomerKey = base58Encode(sha256(stringToBytes(dataStatus.roomer)), waves.dAppAddress, waves.nodeUrl);
        let total = await accountDataByKey(roomerKey + "_roomCount", waves.dAppAddress, waves.nodeUrl);
        if (total === null) {
          total = {value: 1}
        }
        let adoptCount = await accountDataByKey(roomerKey + "_adoptCount", waves.dAppAddress, waves.nodeUrl);
        if (adoptCount === null) {
          adoptCount = {value: 0}
        }

        let proposeCount = await accountDataByKey(this.props.roomKey + "_proposals", waves.dAppAddress, waves.nodeUrl);
        if (proposeCount === null) {
          proposeCount = {value: 0}
        }
        dataStatus.proposeCount = proposeCount.value
        dataStatus.adoptionRatio = String((100 * (adoptCount.value * 1 / total.value * 1)).toFixed(2)) + " %"
        this.setState(dataStatus);
      } catch(error) {
        console.error(error)
      }
    }
    setDataStatus();
  }

  authorFormat(data, roomKey, txHash, classes){
    function manager(address, roomer) {
      return (
        "/room/" + address + '$' + roomer + "/auth/"
      );
    }

    function txShower(hash) {
      return (
        "https://wavesexplorer.com/testnet/tx/" + hash
      );
    }

    function createData(title, info){
      return {title, info}
    }

    const rows = [
      createData('City', data.city),
      createData('Genre', data.genre),
      createData('Prize', String(Number(data.prize).toFixed(8)) + " WAVES"),
      createData('Dead', data.dead),
      createData('Adoption Ratio', this.state.adoptionRatio),
      createData('Propose Count', this.state.proposeCount),
    ]
    return (
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <Typography variant="headline" component="h4" className={classes.top}>
            {this.state.title}
          </Typography>
          <Typography className={classes.title} color="textSecondary">
            <TableBody className={classes.list}>
              {rows.map(row => (
                <TableRow key={row.title}>
                  <TableCell component="td" scope="row" size="small">{row.title}</TableCell>
                  <TableCell align="right">{row.info}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Typography>
        </CardContent>
        <CardActions>
          <div className={classes.row}>
            <a href={txShower(this.props.txHash)} target="_blank">
              <Avatar className={classes.wwwAvatar} src="/images/search.svg"/>
            </a>
        
            <Link to={manager(this.props.roomKey, this.state.roomer)}>
              <Avatar className={classes.wwwAvatar} src="/images/pen.svg"/>
            </Link>
          </div>
        </CardActions>
      </Card>
    );
  }

  proposerFormat(data, roomKey, classes){
    
    function proposer(address){
      return (
        "/room/" + address + "/proposer"
      );
    }

    function createData(title, info){
      return {title, info}
    }

    const rows = [
      createData('City', data.city),
      createData('Genre', data.genre),
      createData('Prize', String(Number(data.prize).toFixed(8)) + " WAVES"),
      createData('Deadline', data.dead),
      createData('Adoption Ratio', this.state.adoptionRatio),
      createData('Propose Count', this.state.proposeCount),
    ]

    return (
      <Card className={classes.card}>
        <Link to={proposer(roomKey)}>
          <CardContent className={classes.content}>
            <Typography variant="headline" component="h4" className={classes.top}>
              {data.title}
            </Typography>
            <Typography className={classes.title} color="textSecondary">
              <TableBody className={classes.list}>
                {rows.map(row => (
                  <TableRow key={row.title}>
                    <TableCell component="th" scope="row" size="small">{row.title}</TableCell>
                    <TableCell align="right">{row.info}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Typography>
          </CardContent>
        </Link>
      </Card>
    );
  }

  render(){
    // Material-ui関連
    const { classes } = this.props;

    return (
        <div>
        {this.state.author ?
            this.authorFormat(this.state, this.props.roomKey, this.props.txHash, classes)
            :
            this.proposerFormat(this.state, this.props.roomKey, classes)
        }
        </div>
    )
  }
}

HomeCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(HomeCard);