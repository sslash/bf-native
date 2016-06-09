import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import Stl from './ChatScreenStl';
import ConversationIterator from './ConversationIterator';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';


const Message = ({message}) => (
    <Animatable.View style={Stl.botMessage} animation="fadeInRight" duration={200}>
        <View style={{flex: 1}} />
        <View style={{flex: 2}}>
            <Text style={Stl.messageText}>{message.text}</Text>
        </View>
    </Animatable.View>
);

const UserInput = ({onSubmit}) => (
        <TextInput
            style={Stl.userInput}
            placeholder="Your name, please"
            onSubmitEditing={e => onSubmit(e.nativeEvent.text)}
        />
);

const Button = ({onPress, text, style, textStyle}) => (
    <Animatable.View animation="fadeInLeft" duration={200}>
        <TouchableOpacity
            style={[Stl.botMessage, Stl.buttonStyle, style]}
            onPress={onPress}>
            <Text style={[{color: '#fff'}, textStyle]}>{text}</Text>
        </TouchableOpacity>
    </Animatable.View>
);

const defaultState = {
    messages: [],

    // answer button
    renderAnswerText: null,

    // when user must submit input
    renderUserInput: null,

    // when user must submit input, this is the value
    currentAnswer: null,

    // when finished, you'll see this one
    renderDoneButton: null
};

class ChatMessages extends Component {

    constructor(props) {
        super(props);
        this.state = Object.assign({}, defaultState);

        this.convIterator = new ConversationIterator(this.props.conversation);
    }

    componentDidMount () {
        this.continueChat(1);
    }

    componentWillReceiveProps (newProps) {
        if (this.props.conversation !== newProps.conversation) {
            this.convIterator = new ConversationIterator(newProps.conversation);
            this.setState(Object.assign({}, defaultState));
            this.continueChat(1);
        }
    }

    continueChat = (msgLength) => {
        this._timeout = setTimeout(this.emitMessage, msgLength * 40);
    }

    emitMessage = () => {
        const message = this.convIterator.next();

        if (message && message.answer_post_id) {
            this.waitForAnswer(message);
        } else {
            this.iterateNextMessage(message);
        }
    }

    waitForAnswer(message) {

        // user can submit input field
        if (message.user_input_answer ) {
            this.setState({renderUserInput: true});

        // user can press button (called answer text)
        } else if (message.answer_text) {
            this.setState({
                renderAnswerText: message.answer_text,
                renderAnswerText2: message.answer_text_2 // currently only for custom messages
            });
        }
    }

    iterateNextMessage (message) {
        if (message) {
            if (this.state.currentAnswer) {
                message.text = message.text.replace('$1', this.state.currentAnswer);
                this.setState({currentAnswer: null, renderUserInput: null});
            }
            this.setState({
                messages: [...this.state.messages, message]
            });

            // length of the next message determines the wait time
            const nextMessage = this.convIterator.peek();
            const nextMsgLen = nextMessage && nextMessage.text ?
                nextMessage.text.length : 1;

            this.continueChat(nextMsgLen);

        // last message was seen. Let the user see the next one if exists
        } else {
            this.setState({renderDoneButton: true});
        }
    }

    //
    // EVENTS
    //

    onSubmitAnswer = (userInputText) => {

        // happens when user has submitted text in input field
        if (userInputText) {
            this.setState({currentAnswer: userInputText});

        // otherwise its a button (answer button)
        } else {
            this.setState({renderAnswerText: null});
        }

        // setTimeout(() => {
        this.iterateNextMessage(this.convIterator.prev());
        // });
    }

    onSubmitCustomAnswer = (answer) => {
        // will trigger a noticiation popup
        // then when user has clicked, it will go back here.
        this.props.onCustomAnswerSubmit(
            answer,
            this.convIterator.prev(),
            () => {
                this.setState({
                    renderAnswerText: null,
                    renderAnswerText2: null
                });
                this.iterateNextMessage(this.convIterator.prev());
            }
        );
    }

    //
    // RENDERS
    //

    renderMessages () {
        return this.state.messages.map(msg => <Message message={msg} />);
    }

    renderUserInput () {
        if (this.state.renderUserInput) {
            return <UserInput onSubmit={this.onSubmitAnswer}/>
        }
    }

    renderAnswerText () {
        if (this.state.renderAnswerText) {

            if (this.state.renderAnswerText2) {
                return (
                    <View style={{flexDirection: 'row'}}>
                        <Button
                            onPress={() => this.onSubmitCustomAnswer(this.state.renderAnswerText)}
                            text={this.state.renderAnswerText}
                        />
                        <Button
                            onPress={() => this.onSubmitCustomAnswer(this.state.renderAnswerText2)}
                            text={this.state.renderAnswerText2}
                            style={Stl.defaultBtn}
                            textStyle={{color: '#222'}}
                        />
                    </View>
                );
            }

            return (
                <Button
                    onPress={() => this.onSubmitAnswer()}
                    text={this.state.renderAnswerText}
                />
            );
        } else {
            return null;
        }
    }

    renderDoneButton () {
        if (this.state.renderDoneButton) {
            return <Button text="Bye." onPress={this.props.onDonePress} />
        }
    }

    render () {
        return (
            <KeyboardAwareView animated={true}>
                <View style={[Stl.container, Stl.chatContainer]}>
                    {this.renderMessages()}
                    {this.renderUserInput()}
                    {this.renderAnswerText()}
                    {this.renderDoneButton()}
                </View>
            </KeyboardAwareView>
        );
    }
}

export default ChatMessages;
