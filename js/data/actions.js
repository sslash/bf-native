import * as req from './request';

export function fetchConversations(lastSeenId) {
    lastSeenId = lastSeenId || 0;
    return req.get('conversations?lastSeenId=' + lastSeenId);
}

// TODO: CONTINUNE HERE SAVE TOKEN
/**
 * data: {os, token}
 */
export function saveDeviceToken(data) {
    return req.post('users/from-token', data);
}
