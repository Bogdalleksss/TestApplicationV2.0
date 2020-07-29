import React from 'react'
import { StyleSheet, TextInput, Dimensions, Text, View } from 'react-native'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

class SecondActivity extends React.Component {
    state = {
        text : ''
    }

    _onChangeText = (text) => {this.setState({text})}

    componentDidMount() {
        this.setState({text : this.props.navigation.state.params.word})
    }

    render() {
        return (
            <View style={styles.container}>
              <TextInput
                value={this.state.text}
                style={styles.textInput}
                onChangeText={ text => this._onChangeText(text) } />

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
  },
  textInput: {
    width: screenWidth-40,
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 18
  }
})

export default SecondActivity