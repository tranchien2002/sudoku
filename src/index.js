import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Board from './Board.js';
import Menu from './Menu.js';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import Arweave from 'arweave/web';
var _ = require('lodash');
var stopWatch;
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initial: 0,
      loggedIn: false,
      timeCounter: 0,
      start: false,
    };
    this.keyUpload = React.createRef();
  }

  async componentDidMount() {
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
    });
    this.setState({ arweave: arweave });
  }

  handleGeneration = (initial) => {
    this.setState({ initial: initial });
  };

  uploadKey = async (e) => {
    let dataFile = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = async (e) => {
      const jwk = JSON.parse(fileReader.result);
      console.log(jwk);
      this.setState({ jwk: jwk });
      const arweave = this.state.arweave;
      if (arweave) {
        arweave.wallets.jwkToAddress(jwk).then(async (address) => {
          this.setState({ address: address, loggedIn: true });
        });
      }
    };
    if (dataFile) {
      fileReader.readAsText(dataFile);
    }
  };

  login = () => {
    this.keyUpload.current.click();
  };

  startGame = () => {
    if (!this.state.start) {
      this.setState({ timeCounter: 0, start: true });
      stopWatch = setInterval(() => {
        this.setState({ timeCounter: this.state.timeCounter + 1 });
        // console.log(1);
      }, 1000);
    } else {
      this.setState({ timeCounter: 0 });
    }
  };

  endGame = () => {
    this.setState({ start: false });
  };

  renderMenu = () => {
    // if (this.state.loggedIn) {
    return <Menu onGenerate={this.handleGeneration} startGame={this.startGame} />;
    // } else {
    //   return (
    //     <div>
    //       <Button onClick={this.login.bind(this)}>Login</Button>
    //       <input
    //         type='file'
    //         onChange={this.uploadKey}
    //         style={{ display: 'none' }}
    //         ref={this.keyUpload}
    //       />
    //     </div>
    //   );
    // }
  };

  render() {
    return (
      <div className='game'>
        <div className='game-board'>
          <div className='leaderboard'>
            <div className='container'>
              <div className='row'>
                <div className='name'>Player1</div>
                <div className='score'>430</div>
              </div>

              <div className='row'>
                <div className='name'>Player2</div>
                <div className='score'>580</div>
              </div>

              <div className='row'>
                <div className='name'>Player3</div>
                <div className='score'>310</div>
              </div>

              <div className='row'>
                <div className='name'>Player4</div>
                <div className='score'>640</div>
              </div>

              <div className='row'>
                <div className='name'>Player5</div>
                <div className='score'>495</div>
              </div>
            </div>
          </div>
          <Board key={_.random(0, 10000)} initial={this.state.initial} />
          <p>Timer: {this.state.timeCounter}</p>
          <div className='game-menu'>
            <div className='game-menu'>{this.renderMenu()}</div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById('root'));
