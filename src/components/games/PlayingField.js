// src/components/games/CreateGameButton.js
import React, { PureComponent } from 'react'
import './PlayingField.css'
import { connect } from 'react-redux'

class PlayingField extends PureComponent {

  render() {
    return (
      <div className="playingfield">
        <div className='field' id='0'>{ this.props.game.fields[0] } </div>
        <div className='field' id='1'>{ this.props.game.fields[1] } </div>
        <div className='field' id='2'>{ this.props.game.fields[2] } </div>
        <div className='field' id='3'>{ this.props.game.fields[3] } </div>
        <div className='field' id='4'>{ this.props.game.fields[4] } </div>
        <div className='field' id='5'>{ this.props.game.fields[5] } </div>
        <div className='field' id='6'>{ this.props.game.fields[6] } </div>
        <div className='field' id='7'>{ this.props.game.fields[7] } </div>
        <div className='field' id='8'>{ this.props.game.fields[8] } </div>
      </div>
    )
  }
}


const mapStateToProps = ({ games }) => ({ games })
export default connect(mapStateToProps)(PlayingField)
