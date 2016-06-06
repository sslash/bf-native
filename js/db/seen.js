import Store from 'react-native-store';
import DeviceInfo from 'react-native-device-info';

const DB = {

    /**
    * user = {
    *   userId: 1234
    *   lastSeenId: 0
    * }
    */
    user: Store.model('user')
};


function getUser(userId) {
    return DB.user.find({userId: userId});
}

function getOrCreateUser() {
    return new Promise((resolve, reject) => {

        clean()
        .then(() => {
            // only one user-instance in the DB
            return DB.user.find();
        })
        .then((user) => {
            if (user && user.length) {
                return user;
            } else {
                console.log('User didnt exist, will save');
                return _createUser();
            }
        })
        .then((res) => {
            if (res && res.length) {
                return resolve(res[0]);
            } else {
                // shouldnt happen
                console.log('Something went wrong when creating user. Empty result');
                return resolve({});
            }
        })
        .catch((err) => {
            console.log('Failed to find user', err);
            reject(err);
        });
    });
}

function clean () {
    if (__DEV__) {
        console.log('CLEANING');
        return DB.user.destroy();
    } else {
        return Promise.resolve();
    }
}

function updateUser(userId, data) {

    // just always overwrite this one. simple solution.
    data.seenIntro = true;
    console.log('Updating user, ', userId, data);
    return DB.user.update(data, {userId: userId});
}

// returns array (user.find result)
function _createUser() {
    const userId = DeviceInfo.getUniqueID() || Date.now();
    console.log('Creating user: ', userId);

    return DB.user.add({
        userId: userId,
        lastSeenId: 0
    })
    // res = Object {userId: "67FBF794-FC50-4527-80C0-DD88D024C2D6", lastSeenId: 0, _id: 1}
    .then((res) => {
        return DB.user.find();
    });
}

function _updateUser (user) {

};

module.exports = {
    getUser,
    getOrCreateUser,
    updateUser
};
