import React, { Component } from 'react';
import * as cssReset from '../public/atlaskit.css';
import * as Dropzone from 'react-dropzone'

import { libs } from '../libs';

export default class IndexPage extends Component {
  constructor(props) {
    super(props);

    this.validExtensions = ['.jpg', '.mpeg', '.mp4', '.mp3']
    this.state = {
      dragOver: false
    }

  }
  onDrop(acceptedFiles) {
    libs.app.filesDropped(acceptedFiles)
    this.setState({ dragOver: false })
  }
  onDragOver() {
    this.setState({ dragOver: true })
  }

  onDragLeave() {
    this.setState({ dragOver: false })
  }
  render() {
    const dzStyle = {
      position: 'fixed',
      top: '1px',
      left: '1px',
      right: '1px',
      bottom: '1px',
      borderRadius: '3px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#087D9B',
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      fontSize: '24px',
      lineHeight: '1em',
      userSelect: 'none',
      cursor: 'default'
    }
    const dzActiveStyle = {
      backgroundColor: 'green',
      borderColor: 'green'
    }

    const titleStyle = {
      fontSize: 20,
      marginBottom: 10
    }

    const subtitleStyle = {
      fontSize: 10,
      clear: 'both',
      color: 'rgba(255,255,255,0.5)',
      padding: '0px 20px',
      lineHeight: '1.75em'
    }

    const snippetStyle = {
      backgroundColor: this.state.dragOver ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
      borderRadius: 2,
      padding: '2px 5px',
      display: 'inline block',
      marginRight: '2px'
    }

    return (
      <Dropzone
        disableClick
        style={dzStyle}
        activeStyle={dzActiveStyle}
        onDrop={this.onDrop.bind(this)}
        onDragOver={this.onDragOver.bind(this)}
        onDragLeave={this.onDragLeave.bind(this)}
        accept={this.validExtensions.join(', ')}
      >
        <div style={{ padding: 30 }}>
          <div style={titleStyle}>Drag & Drop Files Here</div>
          <div style={subtitleStyle}>
            Must be of type {(() => this.validExtensions.map((ext, index) => <span key={index} style={snippetStyle}>{ext}</span>))()}
          </div>
        </div>
      </Dropzone>
    )
  }
}