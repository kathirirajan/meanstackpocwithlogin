myApp.factory('amplifyStorage', () => {
    'use strict';

    var save = (name, data) => {
        amplify.store(name, data);
    };

    var retrieve = (name) => {
        return amplify.store(name);
    };

    var clearStore = (name) => {
        return amplify.store(name, null);
    };

    var clearAllStore = () => {
        return angular.forEach(amplify.store(), function(value, storeKey) {
            amplify.store(storeKey, null);
        });
    }

    return {
        save: save,
        retrieve: retrieve,
        clearStore: clearStore,
        clearAllStore: clearAllStore
    }
});
