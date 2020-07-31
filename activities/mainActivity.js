import React from 'react'
import { StyleSheet, Dimensions, Linking, View } from 'react-native'
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
        deepURL: '',
        isChecked : false
    }

    _onNavigationStateChange = async (webViewState) => {

        const resultMain = webViewState.url.indexOf('main')
        const resultMoney = webViewState.url.indexOf('money')
        const resuldDeep = this.state.deepURL.indexOf('deep')
        const deepParam = this.state.deepURL.replace(/^comtestmyapplication:\/\/test\?deep\=/g, '')

        if(!this.state.isChecked) {
            if(resuldDeep <= 0) {
                if(resultMain > 0)  { 
                    this.setStoreData('isChecked', {isChecked : true}, 'true')
                    this.props.navigation.navigate('Second',{ word: this.state.secret })
                }
                if(resultMoney > 0 ) {
                    this.setState({url : this.state.task})
                    this.setStoreData('url', {url : this.state.task}, this.state.task)
                    this.setStoreData('isChecked', {isChecked : true}, 'false')
                }
            } else {
                const goURL = `https://navsegda.net/?deep=${deepParam}`

                this.setState({url : goURL})
                this.setStoreData('url', {url : goURL}, goURL)
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
                    this.getStoreData('url').then(resUrl => {
                        this.setState({ 
                            url : resUrl == 'about:blank' ? res.val().splash_url : resUrl, 
                            task : resUrl == 'about:blank' ? res.val().task_url : resUrl,
                            secret : res.val().secret,
                            isChecked : false
                        })
                    })
                })
                .catch(rej => console.log(rej))
    }

    _getUrl = async () => {
        try {
            return await Linking.getInitialURL()
        } catch(e) {
            console.log(e)
        }
    }

    componentDidMount() {
        
        this.getStoreData('url').then(res => {
            if(res != 'about:blank') this.setState({ url : res, task : res })
        })
        this.getStoreData('isChecked').then(res => {
            this.setState({isChecked : res === 'true' ? false : true})
            this.setState({test : res})
        })

        this._readUserData()
        
        this._getUrl().then(res => this.setState({deepURL : res != null ? res : 'comtestmyapplication://test'}))
            .catch(err => console.log(err))

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
                style={{ width: screenWidth, height: screenHeight}}
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