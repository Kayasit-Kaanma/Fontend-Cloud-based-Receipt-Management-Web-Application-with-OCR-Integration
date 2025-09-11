import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { register } from '../../services/userService';

export default function RegisterScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'IBMPlexSansThai-Regular': require('../../assets/fonts/IBMPlexSansThai-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'รหัสผ่านทั้งสองช่องไม่ตรงกัน');
      return;
    }
    setLoading(true);
    try {
      const res = await register(email, password, name);
      if (
        res.success ||
        res.token ||
        (res.message && res.message.toLowerCase().includes('registered'))
      ) {
        Alert.alert('Register Success', 'You can now login.', [
          {
            text: 'OK',
            onPress: () => navigation && navigation.navigate && navigation.navigate('Login'),
          },
        ]);
      } else {
        Alert.alert('Register Failed', res.message || 'Could not register');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null; // หรือ <ActivityIndicator />
  }

  return (
    <LinearGradient colors={['#2E7194', '#5B8BB5']} style={styles.container}>
      <Text style={styles.title}>ลงทะเบียน</Text>

      <TextInput
        style={styles.input}
        placeholder="อีเมล"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="ชื่อผู้ใช้"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="รหัสผ่าน"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="ยืนยันรหัสผ่าน"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: '#ccc' }]}
        onPress={handleRegister}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    fontFamily: 'IBMPlexSansThai-Regular',
  },
  title: {
    fontSize: 26,
    marginTop: 90,
    marginBottom: 21,
    color: 'white',
    fontFamily: 'IBMPlexSansThai-Regular',
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#5287b6',
    fontFamily: 'IBMPlexSansThai-Regular',
    color: 'white',
  },
  button: {
    backgroundColor: '#0072C6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'IBMPlexSansThai-Regular',
  },
});
