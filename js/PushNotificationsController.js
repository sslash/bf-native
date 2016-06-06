'use strict';

var React = require('react-native');
var Platform = require('Platform');
import {saveDeviceToken} from './data/actions';

// $FlowIssue
var PushNotification = require('react-native-push-notification');
import PushNotificationIOS from 'PushNotificationIOS';

class PushNotificationsController extends React.Component {
    props: {};

    constructor() {
        super();
    }

    listenToPushNotifications = () => {

        PushNotification.configure({
            // onRegister: (token) => this.storeDeviceToken(token),
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

        // TODO: handle on not accept notifications,
        // call notificationsCallback();
        if (Platform.OS === 'ios') {
            PushNotificationIOS.addEventListener('register', (token) => {
                // token is a string '33c448292db4d6234eceb03574bec6ec2c28c2daff77c9f4b21d2edbeffd4b3f'
                this.storeDeviceToken(token);
            });
        }


        // insert me when testing notifications
        // this.timeout = setTimeout(() => {
        //     console.log('pretending to have received token');
        //     this.props.notificationsCallback();
        // }, 3000);
    }

    componentDidUpdate (prevProps) {
        if (!prevProps.showNotificationBox && !prevProps.notificationsCallback &&
            (this.props.showNotificationBox && this.props.notificationsCallback)) {
                setTimeout(this.listenToPushNotifications);
            }
    }

    // TODO: continue here!!
    storeDeviceToken = (token) => {
        console.log('token!!!', token);
        const os = Platform.OS;
        saveDeviceToken({
            token,
            os
        });
        this.props.notificationsCallback();
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
