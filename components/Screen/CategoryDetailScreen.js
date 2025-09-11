import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getReceipts } from '../../services/receiptService';

export default function CategoryDetailScreen({ route, navigation }) {
  const { category } = route.params;
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [net, setNet] = useState(0);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        if (!token || !userId) return;
        const data = await getReceipts(token);
        // filter by userId and category.name
        const filtered = data.filter(bill => bill.userId === userId && bill.category === category.name);
        const incomeSum = filtered.filter(bill => bill.type === 'รายรับ').reduce((sum, bill) => sum + bill.amount, 0);
        const expenseSum = filtered.filter(bill => bill.type === 'รายจ่าย').reduce((sum, bill) => sum + bill.amount, 0);
        setIncome(incomeSum);
        setExpense(expenseSum);
        setNet(incomeSum - expenseSum);
        // latest: sort by date desc, pick first
        if (filtered.length > 0) {
          const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
          setLatest(sorted[0]);
        } else {
          setLatest(null);
        }
      } catch (err) {
        setIncome(0);
        setExpense(0);
        setLatest(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [category]);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'IBMPlexSansThai-Regular': require('../../assets/fonts/IBMPlexSansThai-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null; // หรือ <ActivityIndicator />

  return (
    <LinearGradient colors={['#2E7194', '#5B8BB5']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{category.name}</Text>
      </View>
      <View style={styles.summaryBox}>
        <Text style={styles.bodyText}>รายรับทั้งหมด</Text>
        <Text style={styles.details}>{loading ? '...' : `${income} บาท`}</Text>
        <Text style={styles.bodyText}>รายจ่ายทั้งหมด</Text>
        <Text style={styles.details}>{loading ? '...' : `${expense} บาท`}</Text>
        <Text style={styles.bodyText}>ยอดสุทธิ</Text>
        <Text style={styles.details}>{loading ? '...' : `${net} บาท`}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddBillManual', { category })}>
          <Text style={styles.buttonText}>เพิ่มบิล (กรอกเอง)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddBillOCR', { category })}>
          <Text style={styles.buttonText}>เพิ่มบิล (OCR)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BillHistory', { category })}>
          <Text style={styles.buttonText}>ดูประวัติ</Text>
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
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginTop: -50,
    marginBottom: 10,
    backgroundColor: '#5287b6',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
  headerText: {
    fontSize: 22,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
  },
  summaryBox: {
    backgroundColor: '#5287b6',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  bodyText: {
    fontSize: 14,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
    left: 24,
    marginBottom: -25,
  },
  details: {
    fontSize: 14,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
    textAlign: 'right',
    bottom: 22.5,
    top: 2.5,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#5287b6',
    padding: 15,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'IBMPlexSansThai-Regular',
  },
});
