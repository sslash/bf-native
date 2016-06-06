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
        return (this.state.currentConversationIndex <
            this.props.conversations.conversations - 1) &&

            // dont show more then 2 messages
            this.state.currentConversationIndex < 1;
    }

    componentWillReceiveProps(newProps, newState) {
        const convs = this.props.conversations;
        const newConvs = newProps.conversations;
        if ((newConvs && newConvs.conversations) && (!convs || !convs.conversations)) {

            // list of messages
            const conversation = this.getNextConversation(newProps);

            // messages have a conversation_id, which is the one we save
            this.updateSeen(conversation);
        }
    }

    updateSeen (conversation) {
        if (conversation && conversation.length) {
            this.props.updateSeen(conversation[0].conversations_id);
        }
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
        const nextIndex = this.state.currentConversationIndex + 1;

        const conversation = this.props.conversations
            .result[nextIndex];

        this.updateSeen(conversation);

        this.setState({
            renderIdleScreen: false,
            currentConversationIndex: nextIndex
        });
    }

    getNextConversation (props) {
        const currentConversationIndex = this.state.currentConversationIndex;

        return props.conversations
            .result[currentConversationIndex];
    }

    renderContent () {
        if (this.props.isFetching) {
            return <Loader />;
        }

        else if (this.state.renderIdleScreen) {
            return (
                <IdleScreen
                    triggerNextAfterTimeout={this.state.triggerNextAfterTimeout}
                    onIdleScreenNext={this.onIdleScreenNext}
                />
        );

        } else if (this.props.conversations && this.props.conversations.conversations) {

            const currentConversation = this.getNextConversation(this.props);
            const nextExists = this.hasNextConversation();

            // render one screen
            return (
                <ChatMessages
                    conversation={currentConversation}
                    nextExists={nextExists}
                    onDonePress={this.onDonePress}
                    onCustomAnswerSubmit={this.props.onCustomAnswerSubmit}
                />
            );

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
