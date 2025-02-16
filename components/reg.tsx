import { Box, Button, Input, NativeBaseProvider, Text, VStack } from "native-base";
import { View } from "react-native";
import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_HOST } from "@/constants/API_HOST";

const Reg = ({changePage}: any) => {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const register = async () => {
        try {
            const response = await axios.post(API_HOST+'/register', {
                name: name,
                email: email,
                password: password
            });
            AsyncStorage.setItem('token', response.data.token);
            AsyncStorage.setItem('userName', response.data.userName);
            // router.replace("/"); // Переход на главную страницу
            changePage('home')
        } catch (error) {
            setMessage('Ошибка регистрации');
            console.error(error);
        }
    }
    const goToLogin = () => {
        // router.push("/(tabs)/login"); // Переход на главную страницу
        changePage('login')
    }
    return(
        <View style={{ flex: 1, backgroundColor: "white" }}>
        <NativeBaseProvider>
            <Box flex={1} background={'rgb(255, 255, 255)'} justifyContent="center" alignItems="center" padding={5}>
                <Text fontSize="2xl" fontWeight="bold" marginBottom={4}>
                    Регистрация
                </Text>
                <VStack space={3} width="90%">
                    <Input 
                    placeholder="Name" 
                    value={name} 
                    onChangeText={setName} 
                    variant="outline"
                    />
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
                    <Button variant="outline" colorScheme="primary" onPress={goToLogin}>
                        Есть аккаунт?
                    </Button>
                    <Button colorScheme="success" onPress={register}>
                        Зарегистрироваться
                    </Button>
                    </VStack>
                    {message ? <Text color="gray.500">{message}</Text> : null}
                </VStack>
            </Box>
        </NativeBaseProvider>
    </View>
    )
}

export default Reg;