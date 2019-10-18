// React関連
import React, { Component } from 'react';

// material-ui関連
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// コンポーネントの準備
import ProposalPaper from '../components/ProposalPaper'


// スタイル
const styles = theme => ({
  root: {
  },
  genretitle: {
    marginTop: '50px',
    color: 'indigo'
},
});

const a = [];

class ProposalList extends Component {    

    constructor(props){
        super(props);
        
        const setDataStatus = async () => {
          try {
            const dataStatus = await this.props.datas;
            for (let i = 0; i<dataStatus.length; i++){
                a.push(dataStatus[i]);
            }

          } catch(error) {
            console.error(error)
          }
        }
        setDataStatus();
        
        this.state = {
            datas: a
        }
    }


    render() {
        
        // Material-ui関連
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                {this.state.datas.map((data)=>{
                    return <ProposalPaper data={data} />
                })}
            </div>
          );
    }
}

// Material-ui関連
ProposalList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ProposalList);