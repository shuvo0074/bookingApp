import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, AppRegistry } from 'react-native';

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

AppRegistry.registerComponent('main', () => App);

export default App; 