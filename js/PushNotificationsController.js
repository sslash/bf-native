'use strict';

var React = require('react-native');
var Platform = require('Platform');
import {saveDeviceToken} from './data/actions';

// $FlowIssue
var PushNotification = require('react-native-push-notification');
const WAIT_FOR_POPUP_PRESS_TIME = 6000;

class PushNotificationsController extends React.Component {
    props: {};

    constructor(props) {
        super(props);
        this.state = {
            tokenWasSet: false
        };
    }

    listenToPushNotifications = () => {

        PushNotification.configure({
            onRegister: (token) => this.storeDeviceToken(token),
            onNotification: (notif) => this.receivePushNotification(notif),
            // ANDROID ONLY: (optional) GCM Sender ID.
            // senderID: "YOUR GCM SENDER ID",
            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
            * IOS ONLY: (optional) default: true
            * - Specified if permissions will requested or not,
            * - if not, you must call PushNotificationsHandler.requestPermissions() later
            */
            requestPermissions: true,
        });


        this.handleDontAllowPress();
    }

    componentDidUpdate (prevProps) {
        if (!prevProps.showNotificationBox && !prevProps.notificationsCallback &&
            (this.props.showNotificationBox && this.props.notificationsCallback)) {
                setTimeout(this.listenToPushNotifications);
            }
    }

    handleDontAllowPress () {
        // insert me when testing notifications
        this.timeout = setTimeout(() => {
            console.log('pretending to have received token. Token set? ', this.state.tokenWasSet);
            if (!this.state.tokenWasSet) {
                this.props.notificationsCallback();
            }
        }, WAIT_FOR_POPUP_PRESS_TIME);
    }

    // TODO: continue here!!
    storeDeviceToken = (res) => {
        const os = Platform.OS;
        const token = res.token;
        global.LOG('Saving device token', token, os);

        saveDeviceToken({
            token,
            os
        });
        this.setState({tokenWasSet: true});

        if (this.props.notificationsCallback) {
            this.props.notificationsCallback();
        }
    }

    /**
     * {
             foreground: false, // BOOLEAN: If the notification was received in foreground or not
             message: 'My Notification Message', // STRING: The notification message
             data: {}, // OBJECT: The push data
         }
     */
    receivePushNotification = (notification) => {

    }

    render() {
        return null;
    }
}

module.exports = PushNotificationsController;
