import { Text, View, StyleSheet } from 'react-native'

export default function Control() {
  return (
      <View style={styles.container}>
        <Text>control</Text>
      </View>
    )
  }



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
  },
});
