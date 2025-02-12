import Login from '@/components/login';
import Reg from '@/components/reg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { View,StyleSheet, Text, TextInput, ScrollView} from "react-native";
import { Box, NativeBaseProvider, Button } from "native-base";
import axios from 'axios';
import EmissionsChart from '@/components/EmissionsChart';
import FileUpload from '@/components/FileUpload';
import ReloadIcon from '@/components/ReloadIcon';
import LoadingIcon from '@/components/LoadingIcon';
import _ from "lodash";


export default function HomeScreen() {
  const [page, setPage] = useState('login')
  const [date, setDate] = useState("");
  const [emission, setEmission] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
  useEffect(()=>{
    fetchData()
  },[])
  const logout = () => {
    setIsAuthenticated(false);
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('userName');
    setPage('home')
  };

  const fetchData = useCallback(
    _.throttle(async () => {
      setIsLoading(true);

      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.warn("No token found");
          setIsLoading(false);
          setPage('home')
          return;
        }

        const response = await axios.get("http://localhost:3000/data", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEntries(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false)
      }
    }, 2000), // Функция вызывается не чаще, чем раз в 3 секунд
    []
  );

  const addEntry = async () => {
    if (!date || !emission) return;
    const formattedDate = new Date(date).toLocaleDateString('ru-RU');
    const token =await AsyncStorage.getItem('token');
    await axios.post('http://localhost:3000/data', 
        { date: formattedDate, emission: parseFloat(emission) }, 
        { headers: { Authorization: `Bearer ${token}` } }
    );
    setDate('');
    setEmission('');
    fetchData();  
  };

  const uploadData = async (file: any) => {
    if (!file) {
        alert('Пожалуйста, выберите файл');
        return;
    }

    const token =await AsyncStorage.getItem('token');
    
    try {
        await axios.post('http://localhost:3000/upload', file, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });
        alert('Данные выбросов успешно загружены');
        fetchData();
    } catch (error) {
        alert('Ошибка при загрузке данных выбросов');
        console.error(error);
    }
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <NativeBaseProvider>
      {!isAuthenticated ? (page == 'login' ? <Login changePage={setPage}></Login> : <Reg changePage={setPage}></Reg>) : 
      <div>
      {isAuthenticated && (
        <View style={{ position: "absolute", top: 10, left: 10 }}>
          <Button onPress={logout} colorScheme="red" variant="outline">Выйти</Button>
        </View>
      )}

      <Box style={{alignItems: "center", marginTop: 25, padding: 10}}>
        <Text style={{ fontSize: 22, margin: 10 }}>Углеродный след</Text>
        {/* Поля ввода */}
        <TextInput
          style={styles.input}
          placeholder="Дата (ГГГГ-ММ-ДД)"
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Выбросы CO₂ (кг)"
          keyboardType="numeric"
          value={emission}
          onChangeText={setEmission}
        />

        {/* Кнопка добавления */}
        <Button onPress={addEntry} color="#007bff">Добавить</Button>
      </Box>

      
      {/* Загрузка данных */}
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 16 }}>
        <FileUpload uploadData={uploadData}></FileUpload>
      </View>

      {/* График выбросов (заглушка) */}
      <Box style={styles.chartPlaceholder}>
        <Text style={{fontSize: 22}}>График выбросов {!isLoading ? <ReloadIcon onPress={fetchData}></ReloadIcon> : <LoadingIcon></LoadingIcon>}</Text>
        {!isLoading ? <EmissionsChart entries={entries} /> : <Text style={{fontSize: 20}}>Loading ...</Text>}
      </Box>
      </div>
      }
      </NativeBaseProvider>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  chartPlaceholder: {
    marginTop: 20,
    padding: 30,
    backgroundColor: "#fffff",
    alignItems: "center",
    borderRadius: 10,
  },
  navigateButton: {
    marginTop: 20,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
  },
});