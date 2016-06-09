import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import Stl from './ChatScreenStl';
import * as Animatable from 'react-native-animatable';


const Button = ({onPress, text}) => (
    <Animatable.View style={styles.button} animation="fadeIn">
        <TouchableOpacity
            style={[Stl.botMessage, Stl.buttonStyle, styles.buttonInner]}
            onPress={onPress}>
            <Text style={{color: '#fff'}}>{text}</Text>
        </TouchableOpacity>
    </Animatable.View>

);

class IdleScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount () {
        if (this.props.triggerNextAfterTimeout) {
            this.setTimeoutBeforeGoToNextMessage();
        }
    }

    setTimeoutBeforeGoToNextMessage = () => {
        setTimeout(this.renderNextButton.bind(this), 10000);
    }

    renderNextButton() {
        this.setState({renderNextButton: true});
    }

    render () {
        return (
            <View style={[Stl.container, Stl.centerContainer]}>
                <Text style={Stl.idleText}>Nothing here for now.</Text>
                {this.state.renderNextButton &&
                    <Button
                        onPress={this.props.onIdleScreenNext}
                        text="Hello?"
                    />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        alignSelf: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        marginTop: 40
    },
    buttonInner: {
        alignSelf: 'center'
    }
})
export default IdleScreen;
