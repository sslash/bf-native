'use strict';

import React, {Component} from 'react';
import {fetchConversations} from './data/actions';
var AppState = require('AppState');
import seen from './db/seen';
var PushNotificationsController = require('./PushNotificationsController');
var StyleSheet = require('StyleSheet');
var {View, StatusBar} = require('react-native');
import ChatScreen from './screens/ChatScreen';
var initialMessage = require('./helpers/initialMessage');
var { version } = require('./env.js');

function isFirstTimeUser (user) {
    return !user.seenIntro;
}

class BfApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            serverState: {},
            user: null,
            isFetching: false
        };

        (this: any).handleAppStateChange = this.handleAppStateChange.bind(this);
    }

    componentDidMount () {
        this.fetchConversations();
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount () {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange(appState) {
        if (appState === 'active') {
            // App went active! See if there are more routes!
            this.fetchConversations();
        }
    }

    fetchConversations () {
        this.setState({isFetching: true});

        seen.getOrCreateUser()
        .then((userRes) => {
            global.LOG('User fetched', userRes);
            this.setState({user: userRes});

            // fetchConversations(userRes.lastSeenId)
            fetchConversations(0)            
            .then(conversations => {

                // if its the first time we see the app,
                // render the initial first
                if (isFirstTimeUser(userRes)) {
                    conversations.result.unshift(initialMessage.message);
                }

                this.setState({
                    isFetching: false,
                    serverState: {
                        ...this.state.serverState,
                        conversations
                    }
                });
            })
            .catch(err => {
                global.LOG('Failed to fetch conversations: ', err);
                this.setState({
                    isFetching: false,
                    fetchError: 'Something went wrong. Please try again later'
                });
            });
        });
    }

    updateSeen = (lastSeenId) => {
        const user = {...this.state.user};
        if (user) {
            setTimeout(() => {
                this.setState({user: user});

                const updateData = {
                    lastSeenId: lastSeenId
                }

                seen.updateUser(user.userId, updateData);
            });
        } else {
            console.log('Failed to set seen on conversation id. User didnt exist');
        }
    }

    // show notification message.
    // cb is for continueing iteration of messages
    onCustomAnswerSubmit = (answer, message, cb) => {

        // if its a show notications message
        // and the user said yes
        if (message.meta.customMessageId === initialMessage.customAnswers.SHOW_NOTIFICATIONS) {
            if (answer === 'Yes') {
                return this.setState({
                    showNotificationBox: true,
                    notificationsCallback: cb
                });
            }
        }

        // if not, then just continue the flow.
        setTimeout(cb);
    }

    render () {
        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor="rgba(0, 0, 0, 0)"
                />
                <PushNotificationsController
                    showNotificationBox={this.state.showNotificationBox}
                    notificationsCallback={this.state.notificationsCallback}
                />
                <ChatScreen
                    conversations={this.state.serverState.conversations}
                    isFetching={this.state.isFetching}
                    updateSeen={this.updateSeen}
                    onCustomAnswerSubmit={this.onCustomAnswerSubmit}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

module.exports = BfApp;
