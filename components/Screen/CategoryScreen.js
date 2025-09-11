import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { deleteCategory, getCategories, updateCategory } from '../../services/categoryService';
import AddCategoryModal from '../Modal/AddCategoryModal';

export default function CategoryScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

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
    const getAuth = async () => {
      const t = await AsyncStorage.getItem('token');
      const uid = await AsyncStorage.getItem('userId');
      if (t) setToken(t);
      if (uid) setUserId(uid);
    };
    getAuth();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories(token);
      setCategories(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getCategories(token);
      setCategories(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token]);

  const handleAdd = async () => {
    setShowAddModal(true);
  };

  const handleCategoryAdded = () => {
    fetchCategories();
  };

  const handleEdit = async (id) => {
    setLoading(true);
    try {
      await updateCategory(id, { name: editingName }, token);
      setEditingId(null);
      setEditingName('');
      fetchCategories();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'ยืนยันการลบ',
      'คุณต้องการลบหมวดหมู่นี้หรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ลบ',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await deleteCategory(id, token);
              fetchCategories();
              Alert.alert('สำเร็จ', 'ลบหมวดหมู่เรียบร้อยแล้ว');
            } catch (err) {
              Alert.alert('ข้อผิดพลาด', err.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {editingId === item._id ? (
        <>
          <TextInput
            style={styles.editInput}
            value={editingName}
            onChangeText={setEditingName}
            placeholderTextColor="#ccc"
          />
          <TouchableOpacity style={styles.saveButton} onPress={() => handleEdit(item._id)}>
            <Text style={styles.saveButtonText}>บันทึก</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => { setEditingId(null); setEditingName(''); }}>
            <Text style={styles.cancelButtonText}>ยกเลิก</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate('CategoryDetail', { category: item })}>
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={() => { setEditingId(item._id); setEditingName(item.name); }}>
            <Text style={styles.editButtonText}>แก้ไข</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
            <Text style={styles.deleteButtonText}>ลบ</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  if (!fontsLoaded) return null; // หรือ <ActivityIndicator />;

  return (
    <LinearGradient colors={['#2E7194', '#5B8BB5']} style={styles.container}>
      <View style={styles.header}>
      </View>
      <Text style={styles.title}>หมวดหมู่ (Category)</Text>
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAdd}
        activeOpacity={0.7}
      >
        <Text style={styles.addButtonText}>+ เพิ่มหมวดหมู่ใหม่</Text>
      </TouchableOpacity>

      <FlatList
        data={categories}
        keyExtractor={item => item._id?.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2E7194']}
            tintColor="#2E7194"
          />
        }
        style={styles.flatList}
      />

      <AddCategoryModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCategoryAdded={handleCategoryAdded}
        token={token}
        userId={userId}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0072C6',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 50,
  },
  settingsButton: {
    fontSize: 16,
    color: '#fff',
    textDecorationLine: 'underline',
    fontFamily: 'IBMPlexSansThai-Regular',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'IBMPlexSansThai-Regular',
  },
  addButton: {
    backgroundColor: '#0072C6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'IBMPlexSansThai-Regular',
    fontWeight: 'bold',
  },
  flatList: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5287b6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryButton: {
    flex: 1,
  },
  categoryText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'IBMPlexSansThai-Regular',
  },
  editButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 5,
  },
  editButtonText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'IBMPlexSansThai-Regular',
  },
  deleteButton: {
    backgroundColor: '#ff4d4f',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'IBMPlexSansThai-Regular',
  },
  editInput: {
    flex: 1,
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#28A745',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 5,
  },
  saveButtonText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'IBMPlexSansThai-Regular',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'IBMPlexSansThai-Regular',
  },
});
