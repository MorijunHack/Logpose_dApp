import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';

// Material-UIアイコン取得
// import Search from '@material-ui/icons/Search';

// Redux関連
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

// AnimeList取得
// import AnimeList from '../containers/AnimeList';

// スタイル
const styles = theme => ({
  titleImage: {
    width: '100%',
    maxWidth: 350,
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

  // Form
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});


// const current_year = (new Date()).getFullYear();
// const current_cour = Math.ceil((new Date()).getMonth() / 3);

class Home extends React.Component {

  // ここだけでしか使わないのでRedux未使用;
  state = {
    cityname: '',
    options: [],
    selectedOption: null
  };

  handleChange = event => {
    this.setState({
      cityname: event.target.value,
      options: actions.getCities(event.target.value)
      // selectedOption
    });
    // console.log(`Option selected:`, selectedOption);
  };

  enterDown(event) {
      let list = actions.getCities(event.target.value);
      console.log(list);
      this.setState({
        options: list
      })
  }
  
  render() {

    // redux関連
    const { actions } = this.props;
    // const { selectedOption } = this.state.selectedOption;
    
    // Material-ui関連
    const { classes } = this.props;

    return (
      <div>
        <img src="/images/Logpose_blueTitle.png" alt="title" className={classes.titleImage}/>
        <form autoComplete="off">
          <FormControl className={classes.formControl}>
            <InputLabel shrink>都市名</InputLabel>
            <Select
              value={this.state.cityname}
              onChange={this.handleChange}
              onKeyDown={this.enterDown}
              options={this.state.options}
            />
          </FormControl>
        </form>
        {/* <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => actions.getAnimes(this.state.year, this.state.cour)}
        >
          {this.state.year}年（{cours_detail_month[this.state.cour-1]}）<br/>のアニメを検索
          <Search className={classes.rightIcon}/>
        </Button> */}
        {/* <AnimeList/> */}
      </div>
    );
  }
}

// Material-ui関連
Home.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

// Redux関連
const mapState = (state, ownProps) => ({
});
function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

// Material-uiのテーマ設定＋Redux設定
export default connect(mapState, mapDispatch)(
  withStyles(styles, { withTheme: true })(Home)
);