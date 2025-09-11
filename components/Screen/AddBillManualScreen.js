import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createReceipt } from '../../services/receiptService';

export default function AddBillManualScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [billName, setBillName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('รายรับ');
  const [loading, setLoading] = useState(false);

  // รับ category จาก navigation params ถ้ามี
  const category = navigation?.getState?.()?.routes?.find(r => r.name === 'AddBillManual')?.params?.category;

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'IBMPlexSansThai-Regular': require('../../assets/fonts/IBMPlexSansThai-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const handleAddBill = async () => {
    if (!billName.trim() || !amount.trim() || !date.trim()) {
      Alert.alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      if (!token || !userId) {
        Alert.alert('ไม่พบ token หรือ userId กรุณา login ใหม่');
        setLoading(false);
        return;
      }
      const billData = {
        itemName: billName,
        amount: parseFloat(amount),
        date,
        userId: userId,
        category: category?.name || '',
        type,
      };
      await createReceipt(billData, token);
      Alert.alert('เพิ่มบิลสำเร็จ');
      setBillName('');
      setAmount('');
      setDate('');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) return null; // หรือ <ActivityIndicator />;

  return (
    <LinearGradient colors={['#2E7194', '#5B8BB5']} style={styles.container}>
      <Text style={styles.headerText}>เพิ่มบิลด้วยตนเอง</Text>
      
      <Text style={styles.label}>ประเภท</Text>
      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.switchButton, type === 'รายรับ' && styles.activeSwitchButton]}
          onPress={() => setType('รายรับ')}
        >
          <Text style={styles.switchText}>รายรับ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, type === 'รายจ่าย' && styles.activeSwitchButton]}
          onPress={() => setType('รายจ่าย')}
        >
          <Text style={styles.switchText}>รายจ่าย</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>ชื่อบิล</Text>
      <TextInput
        style={styles.input}
        placeholder="ชื่อบิล"
        placeholderTextColor="#aaa"
        value={billName}
        onChangeText={setBillName}
      />

      <Text style={styles.label}>จำนวนเงิน</Text>
      <TextInput
        style={styles.input}
        placeholder="จำนวนเงิน"
        placeholderTextColor="#aaa"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>วันที่</Text>
      <TextInput
        style={styles.input}
        placeholder="วันที่ (YYYY-MM-DD)"
        placeholderTextColor="#aaa"
        value={date}
        onChangeText={setDate}
      />

      <TouchableOpacity
        style={[styles.submitButton, loading && { backgroundColor: '#ccc' }]}
        onPress={handleAddBill}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>{loading ? 'กำลังเพิ่ม...' : 'เพิ่มบิล'}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
    marginBottom: 5,
    alignSelf: 'flex-start',
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#5287b6',
    fontFamily: 'IBMPlexSansThai-Regular',
    color: 'white',
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
    justifyContent: 'center',
  },
  switchButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeSwitchButton: {
    backgroundColor: '#0072C6',
  },
  switchText: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#003B73',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
  },
});
