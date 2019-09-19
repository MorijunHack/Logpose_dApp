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


const styles = {
  // Cards
  card: {
    width: 330,
    marginTop: 10,
    marginBottom: 10,
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
  twitterAvatar: {
    margin: 10,
    backgroundColor: '#1da1f2',
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
};

class RoomCard extends Component {

  constructor(props){
    super(props);
    this.setState({
      city: this.props.city,
      title: this.props.title,
      genre: this.props.genre,
      prize: this.props.prize,
      limit: this.props.limit,
      proposer: "/room/" + this.props.roomKey + "/proposer",
      show: "/room/" + this.props.roomKey
    });
  }

  render(){

    // Material-ui関連
    const { classes } = this.props;

    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="headline" component="h2">
              {this.props.title}
            </Typography>
            {this.props.city !== '' &&
              <Typography className={classes.title} color="textSecondary">
                {this.props.city}
              </Typography>
            }
            {this.props.genre !== '' &&
              <Typography className={classes.title} color="textSecondary">
                {this.props.genre}
              </Typography>
            }
            {this.props.prize !== '' &&
              <Typography className={classes.title} color="textSecondary">
                {this.props.prize}
              </Typography>
            }
            {this.props.limit !== '' &&
              <Typography className={classes.title} color="textSecondary">
                {this.props.limit}
              </Typography>
            }
          </CardContent>
          <CardActions>
            <div className={classes.row}>
              {this.state.proposer !== '' &&
                <Link to={this.state.proposer}>
                  <SendIcon className={classes.wwwAvatar} />
                </Link>
              }
              {this.state.show !== '' &&
                <Link to={this.state.show}>
                  <Avatar className={classes.wwwAvatar} src="/images/www.svg"/>
                </Link>
              }
            </div>
          </CardActions>
        </Card>
      </div>
    );
  }
}

RoomCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RoomCard);