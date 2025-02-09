import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "native-base";


const FileUpload = ({ uploadData }: any) => {
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result.canceled) {
        console.log("Выбор файла отменен");
        return;
      }

      setFile(result.assets[0]); // В Expo result.assets — это массив
      console.log("Выбранный файл:", result.assets[0]);
    } catch (err) {
      console.error("Ошибка:", err);
    }
  };

  const uploadFIle = () => {
    if (!file) {
      alert("Сначала выберите файл!");
      return;
    }
    uploadData(file)
  };

  return (
    <View style={{
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center", 
        margin: 10
        }}>
        <View style={{ margin: 8 }}><Button onPress={handleFileUpload} variant="outline">Выбрать файл</Button></View>
        <View style={{ margin: 8 }}><Button onPress={uploadFIle} color="#007bff">Загрузить данные</Button></View>  
    </View>
  );
};

export default FileUpload;
