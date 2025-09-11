import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddBillManualScreen from '../components/Screen/AddBillManualScreen';
import AddBillOCRScreen from '../components/Screen/AddBillOCRScreen';
import BillHistoryScreen from '../components/Screen/BillHistoryScreen';
import CategoryDetailScreen from '../components/Screen/CategoryDetailScreen';
import CategoryScreen from '../components/Screen/CategoryScreen';
import EditOCRBillsScreen from '../components/Screen/EditOCRBillsScreen';
import LoginScreen from '../components/Screen/LoginScreen';
import RegisterScreen from '../components/Screen/RegisterScreen';


const Stack = createStackNavigator();
export default function Index() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Categories" component={CategoryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddBillManual" component={AddBillManualScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddBillOCR" component={AddBillOCRScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditOCRBillsScreen" component={EditOCRBillsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BillHistory" component={BillHistoryScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}