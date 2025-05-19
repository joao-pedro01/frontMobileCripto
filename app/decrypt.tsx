import axios from 'axios';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Button from '../src/components/Button';
import InputField from '../src/components/InputField';

export default function Decrypt() {
  const [mensagem, setMensagem] = useState('');

  const handleDecrypt = () => {
    axios.post('http://192.168.15.24:3000/api/descriptografar', {
      hash: mensagem
    }).then(function (response) {
      Alert.alert('Mensagem Original', response.data.textoDescriptografado);
      console.log(response);
    }).catch(function (error) {
      alert(error.response.data.message);
      console.error(error);
    });

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔓 Decriptografar</Text>
      <InputField
        placeholder="Mensagem Criptografada"
        value={mensagem}
        onChangeText={setMensagem}
        style={styles.input}
      />
      <View style={styles.buttonWrapper}>
        <Button title="Decriptografar" onPress={handleDecrypt} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    marginBottom: 16,
  },
  buttonWrapper: {
    marginTop: 16,
  },
});
