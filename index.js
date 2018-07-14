import './ReactotronConfig';
import BackgroundTask from 'react-native-background-task'

import React from 'react';
import { AppRegistry } from 'react-native';
import App from './source/App';



BackgroundTask.define(() => {
    console.log('Hello from a background task')
    BackgroundTask.finish()
  })
  class index extends React.Component {
    componentDidMount() {
      BackgroundTask.schedule()
    }
    render() {
        return <Text>Hello world</Text>
      }
    }

  
AppRegistry.registerComponent('MyTracking', () => App);
