import { Container } from 'unstated';
import { libs } from '../libs'
const dialog = require('electron').remote.dialog

export class UsersContainer extends Container {
  state = {
    list: []
  };

  constructor() {
    super();
    libs.users.getWatchedUser$().forEach((users => {
      this.setState({
        list: users
      })
    }))
    libs.users.getWatchedUser$().filter(user => user.status !== 'offline').forEach((users => {
      this.setState({
        activeList: users
      })
    }))
    libs.users.getWatchedUser$().filter(user => user.status !== 'offline').forEach((users => {
      this.setState({
        online: users.reduce((acc, current) => acc + current.online, 0)
      })
    }))
  }

  toggleComment = (user) => {
    return (commentingState) => {
      libs.users.setCommentingStatus(user, commentingState);
    }
  }

  remove(user) {
    return () => {
      console.log(dialog)
      dialog.showMessageBox({
        type: 'question',
        buttons: ['Cancel', 'Remove User'],
        title: 'WARNING!!',
        message: `Are you sure you want to **permanently** remove ${user.fullName}'s access to stream the meetings?`
      }, function (response) {
        if (response === 1) { // Runs the following if 'Yes' is clicked
          console.log('remove user')
        }
      })
    }
  }
}