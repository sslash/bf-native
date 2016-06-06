import {StyleSheet} from 'react-native';

const textColor = '#626D82';

const Stl = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#F6F8FC'
    },

    chatContainer: {
        justifyContent: 'flex-end'
    },

    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    botMessage: {
        alignSelf: 'flex-end',
        padding: 12,
        paddingVertical: 10,
        marginVertical: 8,
        marginHorizontal: 5,
        backgroundColor: '#fff',
        borderRadius: 4,
        shadowColor: 'rgba(174,185, 206, 0.7)',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 10
    },

    messageText: {
        fontSize: 14,
        fontWeight: '500',
        color: textColor
    },

    userInput: {
        height: 45,
        padding: 10,
        marginVertical: 8,
        color: textColor,
        backgroundColor: '#fff'
    },
    buttonStyle: {
        alignSelf: 'flex-start',
        marginVertical: 20,
        backgroundColor: '#5DA8FC'
    },

    defaultBtn: {
        backgroundColor: '#ddd'
    },

    idleText: {
        color: '#8B99BD',
        fontSize: 20
    }
});

export default Stl;
