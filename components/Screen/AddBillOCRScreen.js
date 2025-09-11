import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Font from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { uploadReceiptImage } from '../../services/ocrService';

export default function AddBillOCRScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [galleryPhoto, setGalleryPhoto] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setGalleryPhoto(result.assets[0]);
      // Process OCR immediately after selecting image
      Alert.alert('เลือกภาพสำเร็จ', 'กำลังประมวลผล OCR...');
      try {
        const token = await AsyncStorage.getItem('token');
        const image = {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'receipt.jpg',
        };
        const resultOCR = await uploadReceiptImage(image, token);
        const bills = resultOCR.saved || [];
        const category = navigation?.getState?.()?.routes?.find(r => r.name === 'AddBillOCR')?.params?.category;
        Alert.alert('อัปโหลดสำเร็จ', 'ประมวลผล OCR สำเร็จ');
        navigation.navigate('EditOCRBillsScreen', { bills, category });
      } catch (err) {
        Alert.alert('OCR Error', err.message);
      }
    }
  };

  const handleUploadImage = async () => {
    if (!galleryPhoto) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const image = {
        uri: galleryPhoto.uri,
        type: 'image/jpeg',
        name: 'receipt.jpg',
      };
      const resultOCR = await uploadReceiptImage(image, token);
      const bills = resultOCR.saved || [];
      const category = navigation?.getState?.()?.routes?.find(r => r.name === 'AddBillOCR')?.params?.category;
      setLoading(false);
      Alert.alert('อัปโหลดสำเร็จ', 'ประมวลผล OCR สำเร็จ');
      navigation.navigate('EditOCRBillsScreen', { bills, category });
    } catch (err) {
      setLoading(false);
      Alert.alert('OCR Error', err.message);
    }
  };

  React.useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'IBMPlexSansThai-Regular': require('../../assets/fonts/IBMPlexSansThai-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (!fontsLoaded) return null; // หรือ <ActivityIndicator />;

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const takedPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(takedPhoto);
      // Process OCR immediately after taking photo
      Alert.alert('ถ่ายรูปสำเร็จ', 'กำลังประมวลผล OCR...');
      try {
        const token = await AsyncStorage.getItem('token');
        const image = {
          uri: takedPhoto.uri,
          type: 'image/jpeg',
          name: 'receipt.jpg',
        };
        const result = await uploadReceiptImage(image, token);
        const bills = result.bills || [];
        const category = navigation?.getState?.()?.routes?.find(r => r.name === 'AddBillOCR')?.params?.category;
        navigation.navigate('EditOCRBillsScreen', { bills, category });
      } catch (err) {
        Alert.alert('OCR Error', err.message);
      }
    }
  };

  const handleRetakePhoto = () => setPhoto(null);

  if (photo) {
    return (
      <LinearGradient colors={['#2E7194', '#5B8BB5']} style={styles.container}>
        <View style={styles.box}>
          <Image source={{ uri: 'data:image/jpg;base64,' + photo.base64 }} style={styles.previewContainer} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetakePhoto}>
            <Text style={styles.buttonText}>ถ่ายใหม่</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" ref={cameraRef}>
        <View style={styles.cameraButtonContainer}>
          <TouchableOpacity style={styles.galleryButton} onPress={handlePickImage}>
            <Entypo name="image" size={40} color="#fff" />
            <Text style={styles.galleryText}>เลือกภาพ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
            <Entypo name="circle" size={68} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  box: {
    borderRadius: 15,
    padding: 10,
    width: '95%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    alignSelf: 'center',
    marginTop: 50,
  },
  previewContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: "center",
    width: '100%',
    paddingHorizontal: 60,
    marginTop: 20,
  },
  cameraButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  captureButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    borderRadius: 10,
    bottom: 10,
  },
  galleryButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#0078FE',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 20,
    marginLeft: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    bottom: 6
  },
  galleryText: {
    fontSize: 12,
    color: 'white',
    marginTop: 5,
    fontFamily: 'IBMPlexSansThai-Regular',
  },
  retakeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  permissionButton: {
    backgroundColor: '#0072C6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansThai-Regular',
    color: '#fff',
  },
  permissionText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'IBMPlexSansThai-Regular',
  },
});
