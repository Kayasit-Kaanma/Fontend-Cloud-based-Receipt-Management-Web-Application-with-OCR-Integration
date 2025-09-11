import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getReceipts } from '../../services/receiptService';

export default function BillHistoryScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  // รับ category จาก navigation params ถ้ามี
  const category = navigation?.getState?.()?.routes?.find(r => r.name === 'BillHistory')?.params?.category;

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'IBMPlexSansThai-Regular': require('../../assets/fonts/IBMPlexSansThai-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        if (!token || !userId) throw new Error('ไม่พบ token หรือ userId กรุณา login ใหม่');
        const data = await getReceipts(token);
        // console.log('All receipts from backend:', data);
        // filter by userId เท่านั้น ไม่ filter category
        let filtered = data.filter(bill => bill.userId === userId);
        setBills(filtered);
      } catch (err) {
        setBills([]);
        // สามารถแจ้งเตือน error ได้ถ้าต้องการ
        console.log('BillHistoryScreen error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, [category]);

  const renderItem = ({ item }) => (
    <View style={[styles.transactionBox, item.type === 'รายรับ' ? styles.incomeBox : styles.expenseBox]}>
      <Text style={styles.transactionType}>{item.type}</Text>
      <Text style={styles.transactionDate}>
        {new Date(item.date).toLocaleDateString('th-TH')} - {new Date(item.date).toLocaleTimeString('th-TH')}
      </Text>
      <Text style={styles.transactionName}>{item.itemName}</Text>
      <Text style={styles.transactionAmount}>
        {item.type === 'รายรับ' ? '+' : '-'}{item.amount} บาท
      </Text>
    </View>
  );

  if (!fontsLoaded) return null; // หรือ <ActivityIndicator />;

  return (
    <LinearGradient colors={['#2E7194', '#5B8BB5']} style={styles.container}>
      <Text style={styles.headerText}>ประวัติค่าใช้จ่าย</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
        </View>
      ) : bills.length === 0 ? (
        <Text style={styles.errorText}>ไม่พบข้อมูลธุรกรรม</Text>
      ) : (
        <FlatList
          data={bills}
          keyExtractor={item => item._id?.toString()}
          renderItem={renderItem}
          style={styles.flatList}
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>ย้อนกลับ</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
    marginBottom: 10,
    marginTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
    textAlign: 'center',
  },
  flatList: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  transactionBox: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'left',
  },
  incomeBox: {
    backgroundColor: 'rgba(72, 201, 176, 0.8)',
  },
  expenseBox: {
    backgroundColor: 'rgba(235, 87, 87, 0.8)',
  },
  transactionType: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
  },
  transactionDate: {
    fontSize: 14,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#f1f1f1',
  },
  transactionName: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
  },
  transactionAmount: {
    fontSize: 18,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
  },
  backButton: {
    backgroundColor: '#003B73',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 50,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
  },
});
