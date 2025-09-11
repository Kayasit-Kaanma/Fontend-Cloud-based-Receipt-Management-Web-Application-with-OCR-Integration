import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditOCRBillsScreen({ route, navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  // รับ bills จาก route.params.bills (array)
  const [bills, setBills] = useState(route.params?.bills || []);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'IBMPlexSansThai-Regular': require('../../assets/fonts/IBMPlexSansThai-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...bills];
    updated[index][field] = value;
    setBills(updated);
  };

  const handleDelete = (index) => {
    const updated = bills.filter((_, i) => i !== index);
    setBills(updated);
  };

  const handleSave = () => {
  // TODO: ส่ง bills ที่แก้ไขแล้วไป backend หรือหน้าถัดไป
  Alert.alert('บันทึกสำเร็จ', 'บันทึกรายการเรียบร้อย');
  navigation.navigate('CategoryDetail', { category: route.params?.category });
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>รายการ {index + 1}</Text>
      <TextInput
        style={styles.input}
        value={item.itemName}
        onChangeText={text => handleChange(index, 'itemName', text)}
        placeholder="ชื่อรายการ"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        value={item.amount?.toString()}
        onChangeText={text => handleChange(index, 'amount', text.replace(/[^0-9.]/g, ''))}
        placeholder="ราคา"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
      />
      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.switchButton, item.type === 'รายรับ' && styles.activeSwitchButton]}
          onPress={() => handleChange(index, 'type', 'รายรับ')}
        >
          <Text style={styles.switchText}>รายรับ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, item.type === 'รายจ่าย' && styles.activeSwitchButton]}
          onPress={() => handleChange(index, 'type', 'รายจ่าย')}
        >
          <Text style={styles.switchText}>รายจ่าย</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        value={item.date?.slice(0,10) || ''}
        onChangeText={text => handleChange(index, 'date', text)}
        placeholder="วันที่ (YYYY-MM-DD)"
        placeholderTextColor="#aaa"
      />
      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={() => handleDelete(index)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>ลบ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!fontsLoaded) return null; // หรือ <ActivityIndicator />;

  return (
    <LinearGradient colors={['#2E7194', '#5B8BB5']} style={styles.container}>
      <Text style={styles.header}>แก้ไขรายการ OCR</Text>
      <FlatList
        data={bills}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderItem}
        style={styles.scrollContainer}
      />
      <TouchableOpacity style={styles.saveAllButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>บันทึกทั้งหมด</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  itemContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    padding: 10,
    borderRadius: 10,
    fontSize: 14,
    color: '#fff',
    marginBottom: 6,
    fontFamily: 'IBMPlexSansThai-Regular',
    backgroundColor: '#5287b6',
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'center',
  },
  switchButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeSwitchButton: {
    backgroundColor: '#0072C6',
  },
  switchText: {
    fontSize: 14,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'IBMPlexSansThai-Regular',
  },
  saveAllButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: 'white',
    marginLeft: 5,
    backgroundColor: '#28A745',
    padding: 5,
    borderRadius: 10,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});
