// React関連
import * as React from 'react';

// firebase関連
import firebase from "firebase/app";
import 'firebase/firestore';

// material-ui関連
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

// component呼び出し
import HomeList from './HomeList';



// スタイル
const styles = makeStyles((theme: Theme) => createStyles({
  title: {
    fontSize: 14,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    margin: '0 auto'
  },
  titleImage: {
    width: '30%',
    maxWidth: 350,
    margin: '20px auto'
  },
  imgWrapper: {
    width: '100%'
  }
}))
  

const Home: React.FC = () => {
  interface Datas {
    datas: {options?: firebase.firestore.SnapshotOptions | undefined}[]
  }

  const [state, update] = React.useState<Datas>({
    datas: []
  })

  const initState = async () => {
    try {
      const data: {options?: firebase.firestore.SnapshotOptions | undefined}[] = [];

      const docRef = firebase.firestore().collection("rooms");
      await docRef
          .where("dead", ">", new Date())
          .where("state", "==", "opened")
          .orderBy("dead")
          .orderBy("created")
          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(async function(doc) {
                data.push(doc.data());
              });
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });
      update({datas: data});
    }catch(error){
        console.error(error);
    }
  }
  initState();

  const classes: Record<"title" | "root" | "titleImage" | "imgWrapper", string> = styles()

  return (
    <div className={classes.root}>

      <div className={classes.imgWrapper}>
        <img src="/images/Logpose_blueTitle.png" alt="title" className={classes.titleImage}/>
      </div>

      <HomeList datas={state.datas} />
      
    </div>
  );
}

export default Home
