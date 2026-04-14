import { Text, View, StyleSheet } from 'react-native'
import React, { Component } from 'react'

export default class control extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>control</Text>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
  },
});
