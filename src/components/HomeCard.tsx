// React関連
import * as React from 'react';
// material-ui関連
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { TableBody, TableRow, TableCell, Theme, createStyles } from '@material-ui/core';
// Route関連
import { Link } from 'react-router-dom';
// waves関連
import { base58Encode, sha256, stringToBytes } from '@waves/ts-lib-crypto';
import { accountDataByKey } from '@waves/waves-transactions/dist/nodeInteraction';
import * as waves from '../config/waves-config';
import { makeStyles } from '@material-ui/styles';

interface Props {
  data: {
    author: boolean
    city: string
    created: string
    dead: string
    detail: string
    duration: number
    genre: string
    height: number
    prize: string
    roomer: string
    roomerName: string
    status: string
    title: string
    when: string
  }
  roomKey: string
  txHash: string
}

interface Data {
  author: boolean
  city: string
  created: string
  dead: string
  detail: string
  duration: number
  genre: string
  height: number
  prize: string
  roomer: string
  roomerName: string
  status: string
  title: string
  when: string
  proposeCount: number
  adoptionRatio: string
}


const styles = makeStyles((theme: Theme) => createStyles({
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
}))


const HomeCard: React.FC<Props> = props => {
  const [state, update] = React.useState<Data>({
    author: false,
    city: '',
    created: '',
    dead: '',
    detail: '',
    duration: 0,
    genre: '',
    height: 0,
    prize: '',
    roomer: '',
    roomerName: '',
    status: '',
    title: '',
    when: '',
    proposeCount: 0,
    adoptionRatio: ''
  })

  const setDataStatus = React.useCallback(
    async () => {
      const dataStatus: {
        author: boolean
        city: string
        created: string
        dead: string
        detail: string
        duration: number
        genre: string
        height: number
        prize: string
        roomer: string
        roomerName: string
        status: string
        title: string
        when: string
      } = await props.data;
  
      const roomerKey: string = base58Encode(sha256(stringToBytes(dataStatus.roomer)));
      let total = await accountDataByKey(roomerKey + "_roomCount", waves.dAppAddress, waves.nodeUrl);
      const totalNum: number = Number(total.value);
      
      let adoptCountNum: number = 0;
      let adoptCount = await accountDataByKey(roomerKey + "_adoptCount", waves.dAppAddress, waves.nodeUrl);
      if (adoptCount === null) {
        adoptCountNum = 0;
      } else {
        adoptCountNum = Number(adoptCount.value);
      }
  
      let proposeCountNum: number = 0
      let proposeCount = await accountDataByKey(props.roomKey + "_proposals", waves.dAppAddress, waves.nodeUrl);
      if (proposeCount === null) {
        proposeCountNum = 0
      } else {
        proposeCountNum = Number(proposeCount.value);
      }
      
      let adoptionRatio: string = String((100 * (adoptCountNum / totalNum)).toFixed(2)) + " %";
      
      update({
        author: dataStatus.author,
        city: dataStatus.city,
        created: dataStatus.created,
        dead: dataStatus.dead,
        detail: dataStatus.detail,
        duration: dataStatus.duration,
        genre: dataStatus.genre,
        height: dataStatus.height,
        prize: dataStatus.prize,
        roomer: dataStatus.roomer,
        roomerName: dataStatus.roomerName,
        status: dataStatus.status,
        title: dataStatus.title,
        when: dataStatus.when,
        proposeCount: proposeCountNum,
        adoptionRatio: adoptionRatio
      });
    },
    [props.data, props.roomKey],
  )
  
  React.useEffect(() => {
    setDataStatus();
  })


  const authorFormat = (data: Data, roomKey: string, txHash: string) => {
    const classes = styles();

    function manager(address: string, roomer: string) {
      return (
        "/room/" + address + '$' + roomer + "/auth/"
      );
    }

    function txShower(hash: string) {
      return (
        "https://wavesexplorer.com/testnet/tx/" + hash
      );
    }

    function createData(title: string, info: string){
      return {title, info}
    }

    const rows = [
      createData('City', data.city),
      createData('Genre', data.genre),
      createData('Prize', String(Number(data.prize).toFixed(8)) + " WAVES"),
      createData('Dead', data.dead),
      createData('Adoption Ratio', state.adoptionRatio),
      createData('Propose Count', String(state.proposeCount)),
    ]
    return (
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <Typography component="h4" className={classes.top}>
            <b>{state.title}</b>
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
            <a href={txShower(props.txHash)} target="_blank" rel="noopener noreferrer">
              <Avatar className={classes.wwwAvatar} src="/images/search.svg"/>
            </a>
        
            <Link to={manager(props.roomKey, state.roomer)}>
              <Avatar className={classes.wwwAvatar} src="/images/pen.svg"/>
            </Link>
          </div>
        </CardActions>
      </Card>
    );
  }

  const proposerFormat = (data: Data, roomKey: string) => {
    const classes = styles();

    function proposer(address: string){
      return (
        "/room/" + address + "/proposer"
      );
    }

    function createData(title: string, info: string){
      return {title, info}
    }

    const rows = [
      createData('City', data.city),
      createData('Genre', data.genre),
      createData('Prize', String(Number(data.prize).toFixed(8)) + " WAVES"),
      createData('Deadline', data.dead),
      createData('Adoption Ratio', state.adoptionRatio),
      createData('Propose Count', String(state.proposeCount)),
    ]

    return (
      <Card className={classes.card}>
        <Link to={proposer(roomKey)}>
          <CardContent className={classes.content}>
            <Typography component="h4" className={classes.top}>
              <b>{data.title}</b>
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

  return (
    <div>
    {state.author ?
        authorFormat(state, props.roomKey, props.txHash)
        :
        proposerFormat(state, props.roomKey)
    }
    </div>
  )

}

export default HomeCard