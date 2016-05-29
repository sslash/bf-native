'use strict';

var BfApp = require('./BfApp');
var React = require('React');
var {serverURL} = require('./env');

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
