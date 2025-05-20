import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../src/components/Button';
import InputField from '../src/components/InputField';

export default function Encrypt() {
  const [mensagem, setMensagem] = useState('');
  const [passo, setPasso] = useState('');
  const [resultado, setResultado] = useState<{ Hash: string; resultado: string } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleEncrypt = async () => {
    const deslocamento = parseInt(passo);
    if (isNaN(deslocamento)) {
      setResultado(null);
      setModalVisible(true);
      return;
    }

    try {
      const response = await axios.post('http://192.168.56.1:3000/api/criptografar', {
        texto: mensagem,
        deslocamento: deslocamento,
      });

      const { Hash, resultado } = response.data;

      setResultado({ Hash, resultado });
      setModalVisible(true);
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Erro na criptografia');
      console.error(error);
    }
  };

  const handleCopyAndRedirect = async () => {
    const hash = resultado?.Hash ?? '';
    const mensagemCriptografada = resultado?.resultado ?? '';

    await Clipboard.setStringAsync(`${hash}\n${mensagemCriptografada}`);
    setModalVisible(false);
    router.push({
      pathname: '/decrypt',
      params: {
        hash,
        mensagem: mensagemCriptografada,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔒 Criptografar</Text>

      <InputField
        placeholder="Mensagem"
        value={mensagem}
        onChangeText={setMensagem}
        style={styles.input}
      />

      <InputField
        placeholder="Passo"
        value={passo}
        onChangeText={setPasso}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.buttonWrapper}>
        <Button title="Criptografar" onPress={handleEncrypt} />
      </View>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Feather name="check-circle" size={48} color="#076921" />
            <Text style={styles.modalTitle}>
              {resultado ? 'Mensagem Criptografada' : 'Erro'}
            </Text>
            <Text style={styles.modalText}>
              {resultado
                ? 'Toque para copiar e ir para decriptografia'
                : 'O passo deve ser um número válido.'}
            </Text>

            {resultado && (
              <>
                <TouchableOpacity style={styles.resultRow} onPress={handleCopyAndRedirect}>
                  <Text style={styles.resultCopy}>{resultado.Hash}</Text>
                  <Feather name="copy" size={20} color="#076921" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.resultRow} onPress={handleCopyAndRedirect}>
                  <Text style={styles.resultCopy}>{resultado.resultado}</Text>
                  <Feather name="copy" size={20} color="#076921" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#333',
  },
  modalText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#555',
  },
  resultRow: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
    backgroundColor: '#e6f0e6',
    padding: 10,
    borderRadius: 8,
  },
  resultCopy: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
});
