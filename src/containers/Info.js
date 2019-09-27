import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// スタイル
const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    margin: '20px auto',
    width: '80%'
  },
  textLeft: {
    textAlign: 'left',
  },
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
  },
});


class Info extends React.Component {

  render() {

    // Material-ui関連
    const { classes } = this.props;

    return (
      <div>
        <h2>Logposeについて</h2>
        <div className={classes.textLeft}>

        <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h3">
              私が感じる旅行における課題
            </Typography>
            <Typography component="p" className={classes.paragraph}>
              最初に言うと、Logposeは私のためのアプリケーションです。皆さんは、旅行や出張の際に、細かく情報蒐集して行程を作りたいタイプですか？私は真逆です。
              旅先で行き当たりばったりな出会いや出来事を楽しみたいのであって、何があるか知っているところでインスタ映えを狙いたいわけではないのです。
              そんな私のニーズは基本的に何も調べずに行っても楽しめる状況。細かく言うと下記のようなものです。
              <ul>
                <li>特に旅行を楽しむ場合、情報に対して受け身でいたい</li>
                <li>信頼できる情報を手早く得たい</li>
                <li>予定に縛られたくない</li>
                <li>現地ならではの体験をしたい</li>
              </ul>
              これらを解決できるアプリを構想していると、キュレーションサイトに投稿する人のニーズに触れました。
              <ul>
                <li>貢献に報いられたい</li>
                <li>自分が貢献できたか結果を知りたい</li>
                <li>教える相手を選びたい</li>
              </ul>
              そこで、これらを解決するためのアプリケーションを作ってみようと思いました。
            </Typography>
          </Paper>
        
          <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h3">
              Logposeとは
            </Typography>
            <Typography component="p" className={classes.paragraph}>
              旅行先に関する有益な情報をもらうためのマンツーマンキュレーションサイトです。WAVESという仮想通貨を媒介したお礼の支払いシステムが特徴であり、ログインはWavesKeeperを使用します。
              これはDEMOサイトなので、WAVESもテストネットになります。
            </Typography>
            <Typography component="p" className={classes.paragraph}>
              ※ テストネット用のトークン配布サイト（https://wavesexplorer.com/testnet/faucet）から無料でトークンを落としてテストすることが可能です。
              <ol>
                <li>旅行者は質問"Room"を立ち上げて、行きたい都市と知りたい情報を投稿し、同時に報酬をdAppsに預託します。</li>
                <li>都市に詳しい現地人や先輩旅行者が、Roomに対して提案（Proposal）を投稿します。</li>
                <li>"Roomer"は、期限までにProposalからどれかを採用（Adoption）します。これと同時に採用された提案者にトークンが送られます。</li>
                <li>自分のdApps内保有トークンはマイページから確認でき、いつでも引き出せます。（全額引き落としが原則）</li>
                <li>Roomerは、採用したProposalの提案者に後から点数をつけることができます。</li>
              </ol>
            </Typography>
          </Paper>
          
          <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h3">
              構成要素
            </Typography>
            <Typography component="p" className={classes.paragraph}>
              本アプリでは下記技術を用いており、各サービスの仕様変更ならびに障害発生時には、本アプリの提供・公開を中断する場合もございます。予めご了承下さい。
            </Typography>
            <Typography component="div" className={classes.paragraph}>
              <ul>
                <li>Firebase Hosting</li>
                <li>World Cities API</li>
                <li>Google Translation API</li>
                <li>React・Redux・Material-UI</li>
                <li>WAVES Platform・RIDE</li>
              </ul>
            </Typography>
          </Paper>
          
          <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h3">
              本アプリの目的
            </Typography>
            <Typography component="p" className={classes.paragraph}>
              このアプリはプログラミング初心者の製作者が1ヶ月で製作したポートフォリオであり、サービス提供のみを目的としているわけではありません。反響次第ではちゃんと実装してローンチしようと思っています。
            </Typography>
            <Typography component="p" className={classes.paragraph}>
              コードは公開しているので、質問やツッコミなどいただければ幸いです。
            </Typography>
          </Paper>
          <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h3">
              ソース
            </Typography>
            <Typography component="p" className={classes.paragraph}>
              ソース：
              <a href="#" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </Typography>
          </Paper>
          
          <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h3">
              自己紹介
            </Typography>
            <Typography component="p" className={classes.paragraph}>
              <a href="https://twitter.com/EGmorimo" target="_blank" rel="noopener noreferrer">
                @EGmorimo
              </a>
            </Typography>
            <Typography component="p" className={classes.paragraph}>
              企業に対するイノベーションコンサル、エンジニアコミュニティの代表などをしていましたが、サイファーパンク＆ブロックチェーンの世界に魅了され、勢いでコンサルをやめてエンジニアにジョブチェンジしようと修行中です。<br/>
              Reactを軸足としつつ、ブロックチェーン界隈でフルスタックな経験をしたいと思っています。<br/>
              Ruby and Railsで簡単なECサイト構築経験がありますが、基本的にはブロックチェーンの社会実装におけるユースケースを生み出したいと思っています。
            </Typography>
            <Typography component="p" className={classes.paragraph}>
              日本のエンジニアさんの活躍の場を世界に広げるEastgateというイベント団体を立ち上げてます。
              <ul>
                <li><a href="https://www.eastgate.tokyo/submission" target="_blank" rel="noopener noreferrer">Eastgate HACKATHON</a></li>
                <li><a href="https://www.fastgrow.jp/articles/eastgatehackason-morimoto" target="_blank" rel="noopener noreferrer">FastGrow記事</a></li>
              </ul>
            </Typography>
            <Typography component="p" className={classes.paragraph}>
              ご指摘・ご質問などは、
              <a href="https://twitter.com/EGmorimo" target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
              もしくは
              <a href="https://www.facebook.com/EG.morijun" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
              よりご連絡下さい。
            </Typography>
          </Paper>
        
        </div>
      </div>
    );
  }
}

// Material-ui関連
Info.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};


// Material-uiのテーマ設定
export default withStyles(styles, { withTheme: true })(Info);