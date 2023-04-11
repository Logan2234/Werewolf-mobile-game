// ./components/Adresse.js
import { View, Text} from 'react-native';
import {useEffect, useState} from 'react';

export default function Adresse({ location }) {
    const [adresse, setAdresse] = useState(null);
    useEffect(()=>{
        if (location && location.coords)
            fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${location.coords.longitude}&lat=${location.coords.latitude}`)
                .then(res=>res.json())
                .then(json=>{setAdresse(json);});
    },[location]);
    return (
        <View>
            {adresse?
                <Text>{adresse.features[0].properties.label}</Text>
                :<Text>Adresse inconnue</Text>
            }
        </View>
    );
}