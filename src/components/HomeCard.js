import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
// Route関連
import { Link } from 'react-router-dom';
import { TableBody, TableRow, TableCell } from '@material-ui/core';
import { base58Encode, sha256, stringToBytes } from '@waves/ts-lib-crypto';
import { accountDataByKey } from '@waves/waves-transactions/dist/nodeInteraction';
import * as waves from '../config/waves-config';


const styles = {
  // Cards
  card: {
    width: 330,
    height: 400,
    margin: 10,
  },
  top: {
    height: '40px'
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
    margin: '20px auto'
  }
};

class HomeCard extends Component {
  constructor(props){
    super(props);
    this.state = {}
    
    const setDataStatus = async () => {
      try {
        const dataStatus = await this.props.data;
        this.setState(dataStatus);
      } catch(error) {
        console.error(error)
      }
    }
    setDataStatus();

    console.log(this.state);

    this.authorFormat = this.authorFormat.bind(this);
    this.proposerFormat = this.proposerFormat.bind(this);
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
      createData('Deadline', data.dead),
      createData('Created', data.created),
    ]
    return (
      <Card className={classes.card}>
        <CardContent>
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
        <CardActions>
          <div className={classes.row}>
            <a href={txShower(txHash)} target="_blank">
              <Avatar className={classes.wwwAvatar} src="/images/search.svg"/>
            </a>
        
            <Link to={manager(roomKey, data.roomer)}>
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
      createData('Created', data.created),
    ]

    return (
      <Card className={classes.card}>
        <Link to={proposer(roomKey)}>
          <CardContent>
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

    console.log(this.state);

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