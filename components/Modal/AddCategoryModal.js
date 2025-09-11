import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { createCategory } from '../../services/categoryService';

export default function AddCategoryModal({ 
  visible, 
  onClose, 
  onCategoryAdded, 
  token, 
  userId 
}) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
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

  const handleAddCategory = async () => {
    // Validation
    if (!categoryName.trim()) {
      Alert.alert('ข้อผิดพลาด', 'กรุณาใส่ชื่อหมวดหมู่');
      return;
    }

    if (categoryName.trim().length < 2) {
      Alert.alert('ข้อผิดพลาด', 'ชื่อหมวดหมู่ต้องมีอย่างน้อย 2 ตัวอักษร');
      return;
    }

    if (!userId) {
      Alert.alert('ข้อผิดพลาด', 'ไม่พบ userId กรุณา login ใหม่');
      return;
    }

    setLoading(true);
    try {
      const categoryData = {
        name: categoryName.trim(),
        description: description.trim(),
        user_id: userId,
      };

      const result = await createCategory(categoryData, token);
      
      Alert.alert('สำเร็จ', 'เพิ่มหมวดหมู่เรียบร้อยแล้ว', [
        {
          text: 'ตกลง',
          onPress: () => {
            setCategoryName('');
            setDescription('');
            onClose();
            if (onCategoryAdded) {
              onCategoryAdded();
            }
          },
        },
      ]);
    } catch (err) {
      console.error('Category creation error:', err);
      Alert.alert('ข้อผิดพลาด', err.message || 'ไม่สามารถเพิ่มหมวดหมู่ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCategoryName('');
    setDescription('');
    onClose();
  };

  if (!fontsLoaded) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <LinearGradient colors={['#2E7194', '#5B8BB5']} style={styles.modalContent}>
            <Text style={styles.modalTitle}>เพิ่มหมวดหมู่ใหม่</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>ชื่อหมวดหมู่ *</Text>
              <TextInput
                style={styles.input}
                placeholder="เช่น อาหาร, เดินทาง, ของใช้"
                placeholderTextColor="#aaa"
                value={categoryName}
                onChangeText={setCategoryName}
                maxLength={50}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>คำอธิบาย (ไม่บังคับ)</Text>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับหมวดหมู่นี้"
                placeholderTextColor="#aaa"
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={3}
                maxLength={200}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCancel}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>ยกเลิก</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.addButton, loading && styles.disabledButton]} 
                onPress={handleAddCategory}
                disabled={loading}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.addButtonText}>กำลังเพิ่ม...</Text>
                  </View>
                ) : (
                  <Text style={styles.addButtonText}>เพิ่มหมวดหมู่</Text>
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContent: {
    padding: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#5287b6',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'IBMPlexSansThai-Regular',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#0072C6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
