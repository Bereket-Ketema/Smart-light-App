import { Text, View, StyleSheet } from 'react-native'
import React, { Component } from 'react'

export default class settings extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>settings</Text>
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