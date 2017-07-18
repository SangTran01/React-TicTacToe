"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    //TODO change showModal true and turn to null

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = {
      showModal: true,
      gameBoard: ["", "", "", "", "", "", "", "", ""],
      winner: null,
      selected: null,
      maxPlayer: "x",
      minPlayer: "o"
    };

    _this.handleCloseModal = _this.handleCloseModal.bind(_this);
    return _this;
  }

  App.prototype.resetBoard = function resetBoard() {
    this.setState({ showModal: true });
    this.setState({
      gameBoard: ["", "", "", "", "", "", "", "", ""],
      winner: null,
      selected: null,
      maxPlayer: "x",
      minPlayer: "o"
    });
  };

  App.prototype.handleCloseModal = function handleCloseModal() {
    this.setState({ showModal: false });
  };

  App.prototype.chooseX = function chooseX() {
    this.setState({ selected: "x" });
    this.setState({ showModal: false });
  };

  App.prototype.chooseO = function chooseO() {
    this.setState({ selected: "o" });
    this.setState({ showModal: false });
  };

  App.prototype.tie = function tie(board) {
    var moves = board.join("").replace(/ /g, "");
    if (moves.length === 9) {
      return true;
    }
    return false;
  };

  App.prototype.winner = function winner(board, player) {
    if (board[0] === player && board[1] === player && board[2] === player || board[3] === player && board[4] === player && board[5] === player || board[6] === player && board[7] === player && board[8] === player || board[0] === player && board[3] === player && board[6] === player || board[1] === player && board[4] === player && board[7] === player || board[2] === player && board[5] === player && board[8] === player || board[0] === player && board[4] === player && board[8] === player || board[2] === player && board[4] === player && board[6] === player) {
      return true;
    } else {
      return false;
    }
  };

  App.prototype.copyBoard = function copyBoard(board) {
    return board.slice(0);
  };

  //steps
  //1. copy board
  //2. have player move first
  //3. check if won
  //4. have a.i. move
  //5. check if won
  //6. update gameboard with copy using setState

  App.prototype.validMove = function validMove(move, player, board) {
    var newBoard = this.copyBoard(board);
    if (newBoard[move] === "") {
      newBoard[move] = player;
      return newBoard;
    } else return null;
  };

  //this assumes a.i is 'o' change it
  //going down from 100 if 'o'

  App.prototype.findAiMoveO = function findAiMoveO(board) {
    var move = null;
    var bestMoveScore = 100;
    //Test Every Possible Move if the game is not already over.
    if (this.winner(board, "x") || this.winner(board, "o" || this.tie(board))) {
      return null;
    }
    for (var i = 0; i < board.length; i++) {
      var newBoard = this.validMove(i, this.state.minPlayer, board);
      //If validMove returned a valid game board
      if (newBoard) {
        var moveScore = this.maxScore(newBoard);
        if (moveScore < bestMoveScore) {
          bestMoveScore = moveScore;
          move = i;
        }
      }
    }
    return move;
  };

  App.prototype.findAiMoveX = function findAiMoveX(board) {
    var move = null;
    var bestMoveScore = -100;
    //Test Every Possible Move if the game is not already over.
    if (this.winner(board, "x") || this.winner(board, "o" || this.tie(board))) {
      return null;
    }
    for (var i = 0; i < board.length; i++) {
      var newBoard = this.validMove(i, this.state.maxPlayer, board);
      //If validMove returned a valid game board
      if (newBoard) {
        var moveScore = this.minScore(newBoard);
        if (moveScore > bestMoveScore) {
          bestMoveScore = moveScore;
          move = i;
        }
      }
    }
    return move;
  };

  //for minPlayer

  App.prototype.minScore = function minScore(board) {
    if (this.winner(board, "x")) {
      return 10;
    } else if (this.winner(board, "o")) {
      return -10;
    } else if (this.tie(board)) {
      return 0;
    } else {
      var bestMoveValue = 100;
      var move = 0;
      for (var i = 0; i < board.length; i++) {
        var newBoard = this.validMove(i, this.state.minPlayer, board);
        if (newBoard) {
          var predictedMoveValue = this.maxScore(newBoard);
          if (predictedMoveValue < bestMoveValue) {
            bestMoveValue = predictedMoveValue;
            move = i;
          }
        }
      }
      return bestMoveValue;
    }
  };

  //for maxPlayer

  App.prototype.maxScore = function maxScore(board) {
    if (this.winner(board, "x")) {
      return 10;
    } else if (this.winner(board, "o")) {
      return -10;
    } else if (this.tie(board)) {
      return 0;
    } else {
      var bestMoveValue = -100;
      var move = 0;
      for (var i = 0; i < board.length; i++) {
        var newBoard = this.validMove(i, this.state.maxPlayer, board);
        if (newBoard) {
          var predictedMoveValue = this.minScore(newBoard);
          if (predictedMoveValue > bestMoveValue) {
            bestMoveValue = predictedMoveValue;
            move = i;
          }
        }
      }
      return bestMoveValue;
    }
  };

  App.prototype.gameLoop = function gameLoop(playerMove, currentPlayer) {
    //initally check tile if x,o,  or someone won before adding symbol to tile
    if (this.state.gameBoard[playerMove] === "x" || this.state.gameBoard[playerMove] === "o" || this.state.winner) {
      //return if tile already clicked
      return;
    }
    var player = currentPlayer;
    var currentGameBoard = this.validMove(playerMove, player, this.state.gameBoard);
    if (this.winner(currentGameBoard, player)) {
      this.setState({
        gameBoard: currentGameBoard,
        winner: player
      });
      return;
    }
    if (this.tie(currentGameBoard)) {
      this.setState({
        gameBoard: currentGameBoard,
        winner: "d"
      });
      return;
    }
    //a.i player
    //player = this.state.minPlayer;
    if (currentPlayer === "o") {
      player = "x";
      currentGameBoard = this.validMove(this.findAiMoveX(currentGameBoard), player, currentGameBoard);
      if (this.winner(currentGameBoard, player)) {
        this.setState({
          gameBoard: currentGameBoard,
          winner: player
        });
        return;
      }
      if (this.tie(currentGameBoard)) {
        this.setState({
          gameBoard: currentGameBoard,
          winner: "d"
        });
        return;
      }
    } else {
      player = "o";
      currentGameBoard = this.validMove(this.findAiMoveO(currentGameBoard), player, currentGameBoard);
      if (this.winner(currentGameBoard, player)) {
        this.setState({
          gameBoard: currentGameBoard,
          winner: player
        });
        return;
      }
      if (this.tie(currentGameBoard)) {
        this.setState({
          gameBoard: currentGameBoard,
          winner: "d"
        });
        return;
      }
    }

    this.setState({ gameBoard: currentGameBoard });
  };

  App.prototype.render = function render() {
    var _this2 = this;

    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "menu" },
        React.createElement(
          ReactModal,
          {
            isOpen: this.state.showModal,
            contentLabel: "chooseSymbol",
            className: "Modal",
            overlayClassName: "Overlay"
          },
          React.createElement(
            "h2",
            null,
            "X or O?"
          ),
          React.createElement(
            "button",
            { onClick: this.chooseX.bind(this) },
            "X"
          ),
          React.createElement(
            "button",
            { onClick: this.chooseO.bind(this) },
            "O"
          )
        ),
        React.createElement(
          "h1",
          null,
          "Tic Tac Toe"
        ),
        React.createElement(Announcement, { winner: this.state.winner }),
        React.createElement(ResetButton, { reset: this.resetBoard.bind(this) })
      ),
      this.state.gameBoard.map(function (value, i) {
        return React.createElement(Tile, {
          key: i,
          loc: i,
          value: value,
          gameLoop: _this2.gameLoop.bind(_this2),
          player: _this2.state.selected === "x" ? _this2.state.maxPlayer : _this2.state.minPlayer
        });
      })
    );
  };

  return App;
}(React.Component); //end of class App

var Announcement = function (_React$Component2) {
  _inherits(Announcement, _React$Component2);

  function Announcement() {
    _classCallCheck(this, Announcement);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  Announcement.prototype.render = function render() {
    return React.createElement(
      "div",
      { className: this.props.winner ? "visible" : "hidden" },
      React.createElement(
        "h2",
        null,
        "Game Over"
      ),
      React.createElement(
        "h2",
        null,
        this.props.winner,
        " wins"
      )
    );
  };

  return Announcement;
}(React.Component);

var Tile = function (_React$Component3) {
  _inherits(Tile, _React$Component3);

  function Tile() {
    _classCallCheck(this, Tile);

    return _possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
  }

  Tile.prototype.tileClick = function tileClick(props) {
    console.log(props);
    props.gameLoop(props.loc, props.player);
  };

  Tile.prototype.render = function render() {
    var _this5 = this;

    return React.createElement(
      "div",
      {
        className: "tile " + this.props.loc,
        onClick: function onClick() {
          _this5.tileClick(_this5.props);
        }
      },
      React.createElement(
        "p",
        null,
        this.props.value
      )
    );
  };

  return Tile;
}(React.Component);

var ResetButton = function (_React$Component4) {
  _inherits(ResetButton, _React$Component4);

  function ResetButton() {
    _classCallCheck(this, ResetButton);

    return _possibleConstructorReturn(this, _React$Component4.apply(this, arguments));
  }

  ResetButton.prototype.render = function render() {
    return React.createElement(
      "button",
      { onClick: this.props.reset },
      "Reset"
    );
  };

  return ResetButton;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.querySelector(".container"));