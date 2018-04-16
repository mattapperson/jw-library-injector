import { Container } from 'unstated';
import { libs } from '../libs'

export class MediaContainer extends Container {
  constructor() {
    super();
    console.log('MediaContainer init')
    this.state = {
      videoSource: false,
      settingsError: 'missing',
      selectedCamera: libs.app.settings.get('media.camera'),
      selectedScreen: libs.app.settings.get('media.screen'),
      selectedAudio: libs.app.settings.get('media.mic'),
      screenSources: [],
      cameraSources: [],
      audioSources: [],
      currentlyStreamingVideo: libs.app.settings.get('media.camera')
    }

    libs.inputs.getScreenSources().then(sources => {
      this.setState({
        screenSources: sources
      })
    })

    libs.inputs.getCameraSources().then(sources => {
      this.setState({
        cameraSources: sources
      })
    })

    libs.inputs.getAudioSources().then(sources => {
      this.setState({
        audioSources: sources
      })
    })



    setTimeout(() => {
      this.initFeed();
    }, 10)
  }

  async initFeed() {
    const cameraSetting = this.state.selectedCamera;
    const screenSetting = this.state.selectedScreen;
    const audioSetting = this.state.selectedAudio;

    await libs.room.startRoom({
      name: 'smtjoy'
    })
    libs.room.setAttachPoints('videoInputPreview', 'audioOutput')

    if (!cameraSetting || !screenSetting || !audioSetting) {
      return this.setState({
        settingError: 'missing'
      })
    }

    if (!await libs.inputs.cameraExists(cameraSetting)) {
      return this.setState({
        settingsError: 'camera'
      })
    }
    if (!await libs.inputs.screenExists(screenSetting)) {
      return this.setState({
        settingsError: 'screen'
      })
    }
    if (!await libs.inputs.audioExists(audioSetting)) {
      return this.setState({
        settingsError: 'mic'
      })
    }

    await libs.room.setVideoSource(cameraSetting.config)
    await libs.room.setAudioSource(audioSetting.config)

    let supported = navigator.mediaDevices.getSupportedConstraints();
    console.log('supported: ', supported) // LEAVE THIS TILL TESTED AT HALL!!! MIGHT USE TO CONTROL PTZ...

    this.setState({
      settingsError: false,
      videoSource: 'camera'
    })
  }

  switchMedia = (forceMediaMode) => {
    if (typeof forceMediaMode === 'string') {
      this.setState({
        currentlyStreamingVideo: forceMediaMode === 'screen' ? this.state.selectedScreen : this.state.selectedCamera
      })
    } else {
      var currentlyUsingCamera = this.state.currentlyStreamingVideo.value === this.state.selectedCamera.value
      this.setState({
        currentlyStreamingVideo: currentlyUsingCamera ? this.state.selectedScreen : this.state.selectedCamera
      })
    }

    return libs.room.setVideoSource(this.state.currentlyStreamingVideo.config)
    //return libs.room.setVideoSource(this.state.cameraSources[1])

  }

  selectCamera = (camera) => {
    libs.app.settings.set('media.camera', camera)
    this.setState({
      selectedCamera: camera
    })
    this.initFeed();
  }
  selectAudio = (mic) => {
    libs.app.settings.set('media.mic', mic)
    this.setState({
      selectedAudio: mic
    })
    this.initFeed();

  }
  selectScreen = (screen) => {
    libs.app.settings.set('media.screen', screen)
    this.setState({
      selectedScreen: screen
    })
    this.initFeed();
  }
}