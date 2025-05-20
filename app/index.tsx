import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../src/components/Button';
import InputField from '../src/components/InputField';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    axios.post('http://192.168.56.1:3000/api/usuarios', {
      userName: usuario,
      password: senha
    }).then(function (response) {
      router.push('/encrypt');

      console.log(response);
    }).catch(function (error) {
      alert(error.response.data.message);
      console.error(error);
    });
    
    
    if (usuario === 'admin' && senha === '123') {
    } else {
      // alert('Usuário ou s÷enha inválidos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Login</Text>

      <InputField
        placeholder="Usuário"
        value={usuario}
        onChangeText={setUsuario}
        style={styles.input}
      />

      <InputField
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.buttonWrapper}>
        <Button title="Entrar" onPress={handleLogin} />
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
