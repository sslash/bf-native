import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Stl from './ChatScreenStl';
import ChatMessages from './ChatMessages';
import IdleScreen from './IdleScreen';
import Loader from '../components/Loader';

class ChatScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentConversationIndex: 0,

            // when there is no conversation, or waiting for a conversation
            renderIdleScreen: false
        };
    }

    hasNextConversation () {
        return this.state.currentConversationIndex <
            this.props.conversations.conversations - 1;
    }

    onDonePress = () => {

        this.setState({

            // render an empty screen, pretending
            // nothing is happening
            renderIdleScreen: true,

            // if we do have more, lets just wait
            // a bit, then render the next
            triggerNextAfterTimeout: this.hasNextConversation()
        });
    }

    onIdleScreenNext = () => {
        this.setState({
            renderIdleScreen: false,
            currentConversationIndex: this.state.currentConversationIndex + 1
        });
    }

    renderContent () {

        if (this.state.renderIdleScreen) {
            return (
                <IdleScreen
                    triggerNextAfterTimeout={this.state.triggerNextAfterTimeout}
                    onIdleScreenNext={this.onIdleScreenNext}
                />
        );

        } else if (this.props.conversations && this.props.conversations.conversations) {

            const currentConversationIndex = this.state.currentConversationIndex;
            const currentConversation = this.props.conversations
                .result[currentConversationIndex];

            const nextExists = this.hasNextConversation();

            // render one screen
            return (
                <ChatMessages
                    conversation={currentConversation}
                    nextExists={nextExists}
                    onDonePress={this.onDonePress}
                />
            );

        } else if (this.props.isFetching) {
            return <Loader />;
        } else {
            return <View />;
        }
    }

    render () {
        return (
            <View style={Stl.container}>
                {this.renderContent()}
            </View>
        );
    }
}

export default ChatScreen;
