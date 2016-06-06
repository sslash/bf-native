import React from 'react';
import {View} from 'react-native';
import Spinner from 'react-native-spinkit';
import Stl from '../screens/ChatScreenStl';
import * as Animatable from 'react-native-animatable';

const Loader = () => (
    <Animatable.View style={{flex: 1}} animation="fadeIn" duration={400}>
        <View style={[Stl.container, Stl.centerContainer]}>
            <Spinner
                type="Pulse"
                style={{marginBottom: 50}}
                isVisible
                size={50}
                color="#626D82"
            />
        </View>
    </Animatable.View>
);

export default Loader;
