import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeBaseProvider, Box, Button } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_HOST } from '@/constants/API_HOST';
import Login from '@/components/login';
import Reg from '@/components/reg';

export default function ProfileScreen() {
    const [user, setUser] = useState({ name: '', email: '', subscription: false, subscriptionExpires: 2025-12-24, dailyUsage: 0, lastUsageReset: 2025-2-13 });
    const handleSubscription = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                alert("Ошибка: Вы не авторизованы");
                return;
            }
    
            const response = await axios.post(API_HOST+'/subscribe', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            if (response.data.success) {
                alert("Подписка успешно оформлена!");
                setUser({ ...user, subscription: true, subscriptionExpires: response.data.subscriptionExpires });
            } else {
                alert("Ошибка при оформлении подписки.");
            }
        } catch (error) {
            console.error("Ошибка подписки:", error);
            alert("Ошибка при оформлении подписки.");
        }
    };
    
    useEffect(() => {
        const fetchUserData = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;
            
            try {
                const response = await axios.get(API_HOST+'/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Ошибка при получении данных пользователя:', error);
            }
        };
        
        fetchUserData();
    }, []);
    const [page, setPage] = useState('login')
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    useEffect(() => {
      const checkToken = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          console.log(token);
          if (!token) {
            if(page == 'home') setPage("login");
            setIsAuthenticated(false)
          } else {
            setPage("home");
            setIsAuthenticated(true)
          }
        } catch (error) {
          console.error("Ошибка при получении токена:", error);
          setPage("login");
        }
      };
  
      checkToken();
    }, [page, isAuthenticated]);
    const logout = () => {
      setIsAuthenticated(false);
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('userName');
      setPage('home')
    };
  
    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <NativeBaseProvider>
                {!isAuthenticated ? (page == 'login' ? <Login changePage={setPage}></Login> : <Reg changePage={setPage}></Reg>) : 
                    <Box>
                    {isAuthenticated && (
                        <View style={{ position: "absolute", top: 10, left: 10 }}>
                        <Button onPress={logout} colorScheme="red" variant="outline">Выйти</Button>
                        </View>
                    )}
                        <Box style={styles.container}>
                            <Text style={styles.title}>Профиль</Text>
                            <Text style={styles.label}>Имя:</Text>
                            <Text style={styles.text}>{user.name}</Text>
                            <Text style={styles.label}>Email:</Text>
                            <Text style={styles.text}>{user.email}</Text>
                            <Text style={styles.label}>Подписка:</Text>
                            {user.subscription ? (
                                <Text style={styles.text}>Активна до {new Date(user.subscriptionExpires).toLocaleDateString()}</Text>
                            ) : (
                                <>
                                    <Text style={styles.text}>Нет подписки</Text>
                                    <Text style={styles.text}>Осталось попыток: {5 - user.dailyUsage}</Text>
                                    <Text style={styles.text}>Обновление лимита: {new Date(user.lastUsageReset).toLocaleTimeString()}</Text>
                                    <Button onPress={handleSubscription}>Оформить подписку на месяц</Button>
                                </>
                            )}
                        </Box>
                    </Box>
                    }
                </NativeBaseProvider>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 25,
        padding: 10,
    },
    title: {
        fontSize: 22,
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
    },
});
