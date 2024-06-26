import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity,Image } from 'react-native';
import MapView, { Marker, Polyline, MapType } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/FontAwesome';

const apuntadorImage = require('../../assets/apuntador.png');
const persona = require('../../assets/persona.png');
const Maps = ({ navigation }) => {
  const mapRef = useRef(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [permissionsGranted, setPermissionsGranted] = useState(false); // Estado para verificar permisos
  const [currentLocation, setCurrentLocation] = useState(null);

  const ApiKey = "";
  
  useEffect(() => {
    // Función para solicitar permiso de ubicación
    const requestLocationPermission = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          setPermissionsGranted(true); // Actualizar estado si se conceden permisos
        } else {
          Alert.alert('Permisos insuficientes', 'La aplicación necesita permiso para acceder a la ubicación', [{ text: 'OK' }]);
        }
      } catch (error) {
        console.error('Error al solicitar permisos de ubicación:', error);
      }
      
    };

    // Solicitar permiso de ubicación al cargar el componente
    requestLocationPermission();

    // Lista de coordenadas de los puntos a visitar
    const coords = [
      [-99.64135624393437, 19.28165451145221], // Punto de parada 1
      [-99.63217390710778, 19.284527342079123], // Punto de parada 2
      [-99.61065015646203, 19.287217676105403], // Punto de parada 3
      [-99.59438589159055, 19.286808932264414], // Punto de parada 4
      [-99.57370049447698, 19.28624409743481], // Punto de parada 5
      [-99.55618751216198, 19.285769135963836], // Punto de parada 6
      [-99.52887229771248, 19.2850762714248], // Punto de parada 7
      [-99.51184783694012, 19.2851666223549], // Punto de parada 8
      [-99.4759264593618, 19.342074129820688] // Punto de parada 9
    ];
    setCoordinates(coords);

    if (permissionsGranted) {

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1
        },
        (location) => {
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          });
        }
      );
      // Calcular la ruta utilizando la API de direcciones de Mapbox
      fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${coords.join(';')}?steps=true&geometries=geojson&access_token=${ApiKey}`)
        .then(response => response.json())
        .then(data => {
          const route = data.routes[0].geometry.coordinates.map(coord => ({
            latitude: coord[1],
            longitude: coord[0]
          }));
          setRouteCoordinates(route);
    

      
        })
        .catch(error => {
          console.error('Error al obtener la ruta:', error);
        });

        
    }
    
  }, [permissionsGranted]); // Ejecutar efecto cuando se actualiza el estado de los permisos
  const goToCurrentLocation = () => {  //Redirecciona a la ubicacion del usuario
    if (currentLocation) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {permissionsGranted ? (
        <MapView
        ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 19.28165451145221, // Latitud del primer punto de parada
            longitude: -99.64135624393437, // Longitud del primer punto de parada
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
          }}
        >
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={5}
              strokeColor="#3887be"
            />
          )}
          {coordinates.map((coord, index) => (
            <Marker
              key={`marker-${index}`}
              coordinate={{ latitude: coord[1], longitude: coord[0] }}
              title={`Cuervo Parada ${index + 1}`}>
              <Image source={apuntadorImage}  style={{ width: 50, height: 50 }}  //Icono de PARADAS
              />  
            </Marker>
          ))}
           {currentLocation && (
            <Marker
              coordinate={currentLocation}
             title="Tu ubicación"> 
             <Image source={persona}  style={{ width: 50, height: 50 }}  //Icono de PERSONA
              />  
            </Marker>
 
          )}
          
         
        </MapView>
      ) : (
        <Text>Esperando permisos de ubicación...</Text>

        
      )}



      <View style={styles.menu} //Barra de Menu
      >  
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="user" size={30} color="black"  onPress={() => navigation.navigate('student')}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}  onPress={goToCurrentLocation}  //Manda a la ubiacion del usuario
        >
        <Icon style={styles.ubicacion}  name="location-arrow" size={30} color="#000"  />
      </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="car" size={30} color="black" onPress={() => navigation.navigate('carro')} />
        </TouchableOpacity>
       
      </View>
    </View>

    
  );
};

export default Maps

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '85%'
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
  },
  menuItem: {
    alignItems: 'center',
  },
  ubicacion: {
    position: 'absolute',
    bottom:-1,
    padding: 30,
    borderRadius: 100,
    backgroundColor: 'green',
    color:'white'
  },


});

