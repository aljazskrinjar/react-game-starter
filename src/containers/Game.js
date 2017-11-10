import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchOneGame, fetchPlayers } from '../actions/games/fetch'
import { connect as subscribeToWebsocket } from '../actions/websocket'
import JoinGameDialog from '../components/games/JoinGameDialog'
import { updateGame } from '../actions/games/update'
import './PlayingField.css'


const playerShape = PropTypes.shape({
  userId: PropTypes.string.isRequired,
  name: PropTypes.string
})

class Game extends PureComponent {
  static propTypes = {
    fetchOneGame: PropTypes.func.isRequired,
    fetchPlayers: PropTypes.func.isRequired,
    subscribeToWebsocket: PropTypes.func.isRequired,
    game: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      players: PropTypes.arrayOf(playerShape),
      draw: PropTypes.bool,
      updatedAt: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      started: PropTypes.bool,
      turn: PropTypes.number.isRequired,
    }),
    currentPlayer: playerShape,
    isPlayer: PropTypes.bool,
    isJoinable: PropTypes.bool,
    hasTurn: PropTypes.bool
  }

  componentWillMount() {
    const { game, fetchOneGame, subscribeToWebsocket } = this.props
    const { gameId } = this.props.match.params


    if (!game) { fetchOneGame(gameId) }
    subscribeToWebsocket()
  }

  componentWillReceiveProps(nextProps) {
    const { game } = nextProps

    if (game && !game.players[0].name) {
      this.props.fetchPlayers(game)
    }
  }
  update(index){
    const { game } = this.props
    const { hasTurn } = this.props
    const { currentPlayer } = this.props

    if (hasTurn && game.fields[index] === '' && game.winner === '') { this.props.updateGame(game,index,currentPlayer) }
  }

  turn(){
    const { hasTurn } = this.props
    if (hasTurn) {return "It's your turn"}
    else {return "Wait for your turn"}
  }

  winOrLose(){
    const { game } = this.props
    const { currentPlayer } = this.props

    if (game.winner === ''){return ""}
    if (game.winner === currentPlayer.userId){return "You win!"}
    if (game.winner !== currentPlayer.userId){return "You lose!"}
  }

  render() {
    const { game } = this.props

    if (!game) return null

    const title = game.players.map(p => (p.name || null))
      .filter(n => !!n)
      .join(' vs ')

    return (
      <div className="Game">
        <h1>TIC TAC TOE</h1>
        <h3>{title}</h3>
        <h2>{ this.turn() }</h2>
        <h2>{ this.winOrLose() }</h2>

        <div className="playingfield">
          { this.props.game.fields.map( (field,index) => <div onClick={this.update.bind(this, index)} className='field' id={ `field${index}` } key={ index }><p>{ field }</p></div>)}
        </div>

        <h2>Debug Props</h2>
        <pre>{JSON.stringify(this.props, true, 2)}</pre>

        <JoinGameDialog gameId={game._id} />
      </div>
    )
  }
}

const mapStateToProps = ({ currentUser, games }, { match }) => {
  const game = games.filter((g) => (g._id === match.params.gameId))[0]
  const currentPlayer = game && game.players.filter((p) => (p.userId === currentUser._id))[0]
  const hasTurn = !!currentPlayer && game.players[game.turn].userId === currentUser._id
  return {
    currentPlayer,
    game,
    isPlayer: !!currentPlayer,
    hasTurn,
    isJoinable: game && !currentPlayer && game.players.length < 2
  }
}

export default connect(mapStateToProps, {
  subscribeToWebsocket,
  fetchOneGame,
  fetchPlayers,
  updateGame
})(Game)
