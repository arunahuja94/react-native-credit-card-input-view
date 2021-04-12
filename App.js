import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
// You can import from local files
import { CardView } from './index';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 30,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        Change code in the editor and watch it change on your phone! Save to get
        a shareable url.
      </Text>
      <CardView
        number="4410235123791414"
        cvc="121"
        expiry="12/25"
        brand="visa"
        postalCode="Yes"
        name="Arun Ahuja"
        display={true}
        flipDirection="h"
        onPressfunc={() => alert('clicked')}
        onLongPressfunc={() => alert('Long clicked')} />
    </View>
  );
}
