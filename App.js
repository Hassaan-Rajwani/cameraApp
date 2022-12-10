import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import * as  ImagePicker from 'expo-image-picker';
import { Video, AVPlaybackStatus } from 'expo-av';
import captureImg from './images/camera.png';
import flip from './images/flip.png';
import flashOn from './images/on.png';
import flashOff from './images/off.png';
import start from './images/recording.png';
import stop from './images/stop.png';
import gallery from './images/gallery.png';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [currentImg, setCurrentImg] = useState();
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [recording, setRecording] = useState();
  const cameraRef = useRef(null);
  const video = useRef(null);
  const [status, setStatus] = useState({});

  useEffect(async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true
    });
    setHasPermission(status === 'granted');
  }, [])

  if (!hasPermission) {
    return <View>
      <Text>No access to camera</Text>
    </View>
  }

  const takePicture = async () => {
    const cameraa = cameraRef?.current;
    if (cameraa) {
      let photo = await cameraa.takePictureAsync();
      console.log(photo);
      setCurrentImg(photo.uri);
    }
  }
  const recordVideo = async () => {
    const cameraa = cameraRef?.current;
    if (cameraa) {
      setRecording(true);
      let video = await cameraa.recordAsync();
      console.log(video);
      // setCurrentImg(video.uri);
    }
  }
  const stopRecording = async () => {
    const cameraa = cameraRef?.current;
    if (cameraa) {
      let video = await cameraa.stopRecording();
      setRecording(false);

      console.log(video);
    }
  }
  const openImagePickerAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });
    console.log(result);
    if (!result.cancelled) {
      setCurrentImg(result.uri);
    }
  }
  return (
    <View style={styles.container}>
      {currentImg ?
        // <Video
        //   ref={video}
        //   style={styles.tinyLogo}
        //   source={{
        //     uri: currentImg
        //   }} /> 
        <Image source={{ uri: currentImg }} style={styles.tinyLogo} />
        :
        <Camera style={styles.camera} type={type} ref={cameraRef} flashMode={flash}>
          <View style={styles.buttonContainer2}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}>
              <Image source={flip} style={styles.flip} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setFlash(
                  flash === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.on
                    : Camera.Constants.FlashMode.off
                );
              }}
            >
              <Image source={flash === Camera.Constants.FlashMode.off ? flashOff : flashOn} />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
              <Image source={gallery} style={styles.gallery} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={takePicture}>
              <Image source={captureImg} style={styles.cameraImg} />
            </TouchableOpacity>

            {!recording ?
              <TouchableOpacity
                style={styles.button}
                onPress={recordVideo}>
                <Image source={start} style={styles.start} />
              </TouchableOpacity> :
              <TouchableOpacity
                style={styles.button}
                onPress={stopRecording}>
                <Image source={stop} style={styles.stop} />
              </TouchableOpacity>
            }
          </View>
        </Camera>
      }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  camera: {
    flex: 1,
  },
  text: {
    color: 'white',
    fontSize: 15,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 0.1,
    backgroundColor: 'skyblue',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    overflow: 'scroll',
    paddingBottom: 60,
  },
  buttonContainer2: {
    flex: 0.1,
    backgroundColor: 'skyblue',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 70,
    width: '100%',
    position: 'absolute',
    top: 0,
    overflow: 'scroll',
    paddingBottom: 10
  },
  tinyLogo: {
    width: '100%',
    height: 300,
    display: 'flex',
    flex: 1
  },
});
