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

        // only one user-instance in the DB
        DB.user.find()
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
                return resolve(null);
            }
        })
        .catch((err) => {
            console.log('Failed to find user', err);
            reject(err);
        });
    });
}

function updateUser(id, data) {
    return DB.user.updateById(id, data);
}

// returns array (user.find result)
function _createUser() {
    const userId = DeviceInfo.getUniqueID() || Date.now();
    return DB.user.add({
        userId: userId
    })
    .then(() => {
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
