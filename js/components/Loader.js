import React from 'react';
import {View} from 'react-native';
import Spinner from 'react-native-spinkit';
import Stl from '../screens/ChatScreenStl';

const Loader = () => (
    <View style={[Stl.container, Stl.centerContainer]}>
        <Spinner
            type="Pulse"
            style={{borderWidth: 0, alignSelf: 'center'}}
        />
    </View>
);

export default Loader;
