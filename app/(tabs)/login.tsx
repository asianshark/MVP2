import axios from "axios";
import React, { useState } from "react";
import { Box, Button, Input, Text, VStack } from "native-base";

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const login = async () => {
        try {
            const response = await axios.post('/login', {
                email: email,
                password: password
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userName', response.data.userName);
            setMessage('Успешный вход');
            window.open('/home', '_self')
        } catch (error) {
            setMessage('Ошибка входа');
            console.error(error);
        }
    }
    const goToRegister = () => {
        window.open('/reg', '_self')
    }

    return (
    <Box flex={1} justifyContent="center" alignItems="center" padding={5}>
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
)}

export default Login