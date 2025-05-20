import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Button from '../src/components/Button';
import InputField from '../src/components/InputField';

export default function Decrypt() {
  const [hash, setHash] = useState('');
  const [mensagem, setMensagem] = useState('');
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.hash) setHash(String(params.hash));
    if (params.mensagem) setMensagem(String(params.mensagem));
  }, [params]);

  const handleDecrypt = () => {
    axios
      .post('http://192.168.56.1:3000/api/descriptografar', {
        hash: hash,
        mensagem: mensagem,
      })
      .then(function (response) {
        Alert.alert('Mensagem Original', response.data.textoDescriptografado);
        alert('Mensagem Original: ' + response.data.textoDescriptografado);
        console.log(response);
      })
      .catch(function (error) {
        alert(error.response.data.message);
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔓 Decriptografar</Text>
      <InputField
        placeholder="Hash gerada"
        value={hash}
        onChangeText={setHash}
        style={styles.input}
      />
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
