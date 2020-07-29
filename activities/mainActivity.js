import React from 'react'
import { StyleSheet, Dimensions, View } from 'react-native'
import { WebView } from 'react-native-webview'
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';

var config = {
    databaseURL: "https://testapplication-72fc7.firebaseio.com",
    projectId: "testapplication-72fc7",
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

class MainActivity extends React.Component {
    state = {
        url : '',
        secret: '',
        task: '',
        isChecked : false
    }

    _onNavigationStateChange = async (webViewState) => {

        const resultMain = webViewState.url.indexOf('main')
        const resultMoney = webViewState.url.indexOf('money')

        if(!this.state.isChecked) {
            if(resultMain > 0)  { 
                this.setStoreData('isChecked', {isChecked : true}, 'true')
                this.props.navigation.navigate('Second',{ word: this.state.secret })
            }
            if(resultMoney > 0 ) {
                this.setStoreData('url', {url : this.state.task}, this.state.task)
                this.setStoreData('isChecked', {isChecked : true}, 'false')
            }
        } else if(webViewState.url.indexOf('mline') <= 0)  {
            this.setStoreData('url', {url : webViewState.url}, webViewState.url)
        }   

    }

    getStoreData = async (key) => {
        try {
            return await AsyncStorage.getItem(key)
        } catch(e) {
            console.log(e)
        }
    }

    setStoreData = async (key, change, value) => {
        try {
            await AsyncStorage.setItem(key, value)
            this.setState(change)
        } catch(e) {
            console.log(e)
        }
    }

    _readUserData = async () => {
        await firebase.database().ref('url/').once('value')
                .then(res => {
                    this.setState({
                        url : res.val().splash_url,
                        secret : res.val().secret,
                        task : res.val() .task_url
                    })

                    this.setState({isChecked : false})
                })
                .catch(rej => console.log(rej))
    }

    componentDidMount() {
        
        this.getStoreData('url').then(res => this.setState({ url : res, task : res }))
        this.getStoreData('isChecked').then(res => {
            this.setState({isChecked : res === 'true' ? false : true})
            if(!this.state.isChecked || this.state.url == 'about:blank') this._readUserData()
        })

    }

    componentWillUnmount() {
        this.setState = (state,callback) => { return }
    }

    render() {
        const screenWidth = Dimensions.get('window').width
        const screenHeight = Dimensions.get('window').height

        return (
            <View style={styles.container}>
              <WebView
                source={{uri: this.state.url}}
                onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                style={{ marginTop: 20, width: screenWidth, height: screenHeight-20}}
              />    
            </View>
          )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default MainActivity