import { useState } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import Bouton from './Bouton';
import SizedText from './SizedText';
// Pour les dates
import RNDateTimePicker from '@react-native-community/datetimepicker';

export default function SelectDateHeure({ startDate, setStartDate, label }) {
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const showDatepicker = () => { showMode('date'); };
    const showTimepicker = () => { showMode('time'); };

    const showMode = (currentMode) => {
        if (Platform.OS === 'android') {
            setShow(true);
        }
        setMode(currentMode);
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setStartDate(currentDate);
    };

    return (
        <View style={styles.dateDiv}>
            <SizedText label={label} />
            <Bouton onPress={showDatepicker} label={startDate.toLocaleDateString('fr-FR')} />
            <Bouton onPress={showTimepicker} label={startDate.toLocaleTimeString('fr-FR', { hour: 'numeric', minute: 'numeric' })} />
            {show && (
                <RNDateTimePicker
                    testID="dateTimePicker"
                    value={startDate}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange}
                    minimumDate={new Date()}
                />
            )}
        </View>);
}

const styles = StyleSheet.create({
    dateDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15
    },
});
