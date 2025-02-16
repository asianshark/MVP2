import axios from "axios";
import React, { useState } from "react";
import { Box, Button, Input, Text, VStack } from "native-base";
import { NativeBaseProvider } from 'native-base';
import { View } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_HOST } from "@/constants/API_HOST";


const Login = ({changePage}: any) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const login = async () => {
        try {
            const response = await axios.post(API_HOST+'/login', {
                email: email,
                password: password
            });
            AsyncStorage.setItem('token', response.data.token);
            AsyncStorage.setItem('userName', response.data.userName);
            setMessage('Успешный вход');
            // router.replace("/"); // Переход на главную страницу
            changePage('home')

        } catch (error) {
            setMessage('Ошибка входа');
            console.error(error);
        }
    }
    const goToRegister = () => {
        // router.push("/(tabs)/reg"); // Переход на главную страницу
        changePage('reg')
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <NativeBaseProvider>
                <Box flex={1} background={'rgb(255, 255, 255)'} justifyContent="center" alignItems="center" padding={5}>
                    <Text fontSize="2xl" fontWeight="bold" marginBottom={4}>
                        Логин
                    </Text>
                    <VStack space={3} width="90%">
                        <Input 
                        placeholder="Email" 
                        value={email} 
                        onChangeText={setEmail} 
                        variant="outline"
                        />
                        <Input 
                        placeholder="Пароль" 
                        value={password} 
                        onChangeText={setPassword} 
                        type="password" 
                        variant="outline"
                        />
                        <VStack space={2} alignItems="center">
                        <Button variant="outline" colorScheme="primary" onPress={goToRegister}>
                            Нет аккаунта?
                        </Button>
                        <Button colorScheme="success" onPress={login}>
                            Войти
                        </Button>
                        </VStack>
                        {message ? <Text color="gray.500">{message}</Text> : null}
                    </VStack>
                </Box>
            </NativeBaseProvider>
        </View>

)}

export default Login