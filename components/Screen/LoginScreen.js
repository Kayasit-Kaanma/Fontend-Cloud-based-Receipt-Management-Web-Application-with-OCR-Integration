import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// Adding TouchableOpacity to the import statement
// ...existing code...
import { login } from '../../services/userService';

export default function LoginScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await login(email, password);
      if (
        res.token ||
        (res.message && (
          res.message.toLowerCase().includes('success') ||
          res.message.toLowerCase().includes('login')
        ))
      ) {
        // Save token and userId to AsyncStorage
        if (res.token) await AsyncStorage.setItem('token', res.token);
        if (res.user && res.user._id) await AsyncStorage.setItem('userId', res.user._id);
        Alert.alert('Login Success', 'Welcome!', [
          {
            text: 'OK',
            onPress: () => navigation && navigation.navigate && navigation.navigate('Categories'),
          },
        ]);
      } else {
        Alert.alert('Login Failed', res.message || 'Invalid credentials');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) return null; // หรือ <ActivityIndicator />

  return (
    <LinearGradient colors={['#2E7194', '#5B8BB5']} style={styles.container}>
      <Text style={styles.title}>เข้าสู่ระบบ</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="อีเมล"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="รหัสผ่าน"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: '#ccc' }]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation && navigation.navigate && navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>ยังไม่มีบัญชี? สมัครสมาชิก</Text>
        </TouchableOpacity>
      </View>
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
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    width: '100%',
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
  registerButton: {
    marginTop: 8,
    padding: 8,
    width: '100%',
    alignItems: 'center',
  },
  registerText: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'IBMPlexSansThai-Regular',
  },
});
