import * as req from './request';

export function fetchConversations(lastSeenId) {
    return req.get('conversations?lastSeenId=' + lastSeenId);
}

export function saveDeviceToken(data) {
    return req.post('users?save-token', data);
}
