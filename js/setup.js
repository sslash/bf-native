'use strict';
var React = require('React');
var BfApp = require('./BfApp');
var {View} = require('react-native');
var {serverURL} = require('./env');
var Notifications = require('./PushNotificationsController');

function setup(): React.Component {
    // console.disableYellowBox = true;

    class Root extends React.Component {
        constructor() {
            super();
             console.disableYellowBox = true;
            this.state = {
            };
        }
        render() {

            return <BfApp />
            // return (
            //     <View>
            //         <Notifications />
            //     </View>
            // );
        }
    }
    return Root;
}

global.LOG = (...args) => {
    console.log('/------------------------------\\');
    console.log(...args);
    console.log('\\------------------------------/');
    return args[args.length - 1];
};

module.exports = setup;
