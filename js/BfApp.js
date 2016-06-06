'use strict';

import React, {Component} from 'react';
import {fetchConversations} from './data/actions';
var AppState = require('AppState');
import seen from './db/seen';
// var AppState = require('AppState');
// var LoginScreen = require('./login/LoginScreen');
var PushNotificationsController = require('./PushNotificationsController');
var StyleSheet = require('StyleSheet');
// var F8Navigator = require('F8Navigator');
// var CodePush = require('react-native-code-push');
var {View, StatusBar} = require('react-native');
import ChatScreen from './screens/ChatScreen';
var initialMessage = require('./helpers/initialMessage');
// var {
//  loadConfig,
//  loadMaps,
//  loadNotifications,
//  loadSessions,
//  loadFriendsSchedules,
//  loadSurveys,
// } = require('./actions');
// var { updateInstallation } = require('./actions/installation');
// var { connect } = require('react-redux');

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
            isFetching: true
        };

        (this: any).handleAppStateChange = this.handleAppStateChange.bind(this);
    }

    componentDidMount () {
        this.fetchConversations();
        AppState.addEventListener('change', this.handleAppStateChange);
        // AppState.addEventListener('change', this.handleAppStateChange);

        // TODO: Make this list smaller, we basically download the whole internet
        // this.props.dispatch(loadNotifications());
        // this.props.dispatch(loadMaps());
        // this.props.dispatch(loadConfig());
        // this.props.dispatch(loadSessions());
        // this.props.dispatch(loadFriendsSchedules());
        // this.props.dispatch(loadSurveys());
        // updateInstallation({version});
        // CodePush.sync({installMode: CodePush.InstallMode.ON_NEXT_RESUME});
    }

    componentWillUnmount () {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange(appState) {
        if (appState === 'active') {
            // App went active! Do stuff
            this.fetchConversations();
        }
    }

    fetchConversations () {

        seen.getOrCreateUser()
        .then((userRes) => {
            console.log('User fetched', userRes);
            this.setState({user: userRes});

            fetchConversations(userRes.lastSeenId)
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
