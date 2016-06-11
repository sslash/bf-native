export const customAnswers = {
    SHOW_NOTIFICATIONS: 1
};


const initialMessage = [
    {
        id: 0,
        text: 'Hi',
        image: 'https://media.giphy.com/media/BVStb13YiR5Qs/giphy.gif'
    },
    {
        text: 'Welcome to boyfriendr.',
    },
    {
        text: 'Do you want notifications?',
    },
    {
        answer_text: "Yes",
        answer_text_2: "No",

        // true, because an actual ID is used when an answer message comes
        // from the server. So this meanse its an answer, but its a custom
        // customAnswers one
        answer_post_id: true,
        meta: {
            customMessageId: customAnswers.SHOW_NOTIFICATIONS
        },
        text: 'Oki doki',
    },
    {
        text: 'So see you later then'
    }
];

module.exports = {
    message: initialMessage,
    customAnswers: customAnswers
};
