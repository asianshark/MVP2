import React, { useEffect, useState } from "react";
import { Box, Button, Input, Text, VStack, HStack, Center, NativeBaseProvider, Flex } from "native-base";
import { View, ScrollView} from "react-native"
import { TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import FileUpload from "@/components/FileUpload";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Login from "@/components/login";
import Reg from "@/components/reg";

const Calculator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [page, setPage] = useState('login')
  const [transport, setTransport] = useState("");
  const [energy, setEnergy] = useState("");
  const [water, setWater] = useState("");
  const [emission, setEmission] = useState<number>(0);
  const [treesToPlant, setTreesToPlant] = useState<number>(0)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [openRes, setOpenRes] = useState(false)
    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                console.log(token);
                if (!token) {
                setPage("login");
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
    const calculateCarbonFootprint = async () => {
        let transportCarbon = +transport * 0.167;
        let energyCarbon = +energy * 0.1829;
        let waterCarbon = +water * 0.92;
        setEmission(transportCarbon + energyCarbon + waterCarbon);
    }
    useEffect(()=>{
        if(emission > 0){
            setTreesToPlant(Math.ceil(emission / 22));
            setOpenRes(true)
            sendDataToServer()
        }else{
            setTreesToPlant(0)
            setOpenRes(false)
        }
    }, [emission])
    const sendDataToServer = async () =>{
        const data = {
            date: date,
            transport: transport,
            energy: energy,
            water: water,
            emission: emission
        };

        const token = await AsyncStorage.getItem('token');
        if (!token) {
            alert('Пожалуйста, войдите в систему');
            return;
        }

        try {
            await axios.post('http://localhost:3000/data', data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            alert('Ошибка при отправке данных');
            console.error(error);
        }
    }

  const handleFileUpload = async (file: any) => {
    if (!file) {
        alert('Пожалуйста, выберите файл');
        return;
    }

    const token = await AsyncStorage.getItem('token');
    
    try {
        await axios.post('http://localhost:3000/upload-carbon-footprint', file, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        }).then((response)=>{
            setTransport(response.data.transport || '');
            setEnergy(response.data.energy || '');
            setWater(response.data.water || '');
            if (transport && energy && water) {
                calculateCarbonFootprint();
            }
            alert('Данные успешно загружены и расчёт проведён!');
        });
    } catch (error) {
        alert('Ошибка при загрузке данных выбросов');
        console.error(error);
    }
  }
  const clearCalculator = () =>{
    setTransport('')
    setEnergy('')
    setWater('')
    setEmission(0);
  }
  return (
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <NativeBaseProvider>
                <Center flex={1} bg="white" p={5}>
                    {!isAuthenticated ? (page === 'login' ? <Login changePage={setPage}></Login> : <Reg changePage={setPage}></Reg>) : 
                    <div>
                    {isAuthenticated && (
                        <View style={{ position: "absolute", top: 10, left: 10 }}>
                        <Button onPress={logout} colorScheme="red" variant="outline">Выйти</Button>
                        </View>
                    )}
                    <VStack space={4} width="100%" marginTop="6">
                        <Text fontSize="xl" textAlign="center" marginY="2">Расчет углеродного следа</Text>
                        <Input placeholder="Км на бензине" keyboardType="numeric" value={transport} onChangeText={setTransport} />
                        <Input placeholder="Природный газ (кВт⋅ч)" keyboardType="numeric" value={energy} onChangeText={setEnergy} />
                        <Input placeholder="Электроэнергия (кВт⋅ч)" keyboardType="numeric" value={water} onChangeText={setWater} />
                        <HStack space={2} width="100%" justifyContent="center">
                            {openRes && (
                                <Button onPress={clearCalculator} flex={1} colorScheme="warning" variant="subtle">Очистить</Button>

                            )}    
                            <Button flex={1} onPress={calculateCarbonFootprint}>Рассчитать</Button>
                        </HStack>
                        {openRes ? 
                        <Box p={4} bg="gray.100" borderRadius="md" shadow={2}>
                            <Text fontSize="lg" fontWeight="bold">
                                Ваш углеродный след: {emission.toString()} кг CO₂
                            </Text>
                            <Text mt={2} fontSize="md">
                                Рекомендации по компенсации выбросов:
                            </Text>
                            <VStack mt={2} space={2}>
                                <Text>• Посадить {treesToPlant.toString()} дерева для компенсации.</Text>
                                <Text>• Поддержать проекты по возобновляемым источникам энергии.</Text>
                            </VStack>
                        </Box> : ''
                        }
                        {/* <Text fontSize="lg">Загрузите данные для расчёта</Text>
                        <HStack space={3} alignItems="center">
                            <Button onPress={handleFileUpload}>Выбрать файл</Button>
                            {file && <Text>{file.name}</Text>}
                        </HStack> */}
                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 16 }}>
                            <FileUpload uploadData={handleFileUpload}></FileUpload>
                        </View>
                    </VStack>
                    </div>
                    }
                </Center>
            </NativeBaseProvider>
        </View>
    </ScrollView>
  );
};

export default Calculator;
