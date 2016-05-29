'use strict';

import React, {Component} from 'react';
import {fetchConversations} from './data/actions';
// var AppState = require('AppState');
// var LoginScreen = require('./login/LoginScreen');
// var PushNotificationsController = require('./PushNotificationsController');
var StyleSheet = require('StyleSheet');
// var F8Navigator = require('F8Navigator');
// var CodePush = require('react-native-code-push');
var {View, StatusBar} = require('react-native');
import ChatScreen from './screens/ChatScreen';
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

class BfApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            serverState: {}
        };
    }

    componentDidMount () {
        this.fetchConversations();
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

    fetchConversations () {



        this.setState({ isFetching: true });
        fetchConversations()
        .then(conversations => {
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

    }

    componentWillUnmount () {
        // AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange (appState) {
        // if (appState === 'active') {
        //     this.props.dispatch(loadSessions());
        //     this.props.dispatch(loadNotifications());
        //     this.props.dispatch(loadSurveys());
        //     CodePush.sync({installMode: CodePush.InstallMode.ON_NEXT_RESUME});
        // }
    }

    renderFetchingOrChat () {
        if (this.state.isFetching) {

        } else {
            return (
                <ChatScreen
                    conversations={this.state.serverState.conversations}
                    isFetching={this.state.isFetching}
                />
        );
        }
    }

    render () {
        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor="rgba(0, 0, 0, 0)"
                />
                {/* <PushNotificationsController />*/}
                {this.renderFetchingOrChat()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});

module.exports = BfApp;
