import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, AppRegistry } from 'react-native';
import { BookingListView } from './src/views/BookingListView';

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <BookingListView />
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