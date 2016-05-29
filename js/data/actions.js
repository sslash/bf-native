import * as req from './request';

export function fetchConversations() {
    return req.get('conversations');
}
