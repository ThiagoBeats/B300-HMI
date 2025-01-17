// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="./../Packages/Beckhoff.TwinCAT.HMI.Framework.12.752.0/runtimes/native1.12-tchmi/TcHmi.d.ts" />




function listUsers() {
    return new Promise((resolve, reject) => {
        TcHmi.Server.UserManagement.listUsers(
            function (data) {
                if (data.error === TcHmi.Errors.NONE) {
                    resolve(data.userDetails);
                } else {
                    console.log(`listUsers Error,  data.details.code = ${data.details.code}`);
                    reject(data.error);
                }
            }
        );
    });
}


function listUserProperty(userName) {
    return new Promise((resolve, reject) => {
        TcHmi.Server.UserManagement.listUsersEx(
            null,
            { timeout: 2000 },
            function (data) {
                if (data.error === TcHmi.Errors.NONE) {
                    for (const [key, value] of Object.entries(data.userDetails)) {
                        if (key.localeCompare(userName) == 0) {
                            resolve(value);
                            break;
                        }
                    }
                } else {
                    console.log(`listUsers Error,  data.details.code = ${data.details.code}`);
                    reject(data.error);
                }
            }
        );
    });
}



function listUsersInGroup(groupName) {
    return new Promise((resolve, reject) => {
        TcHmi.Server.UserManagement.listUsersInGroup(
            groupName,
            function (data) {
                if (data.error === TcHmi.Errors.NONE) {
                    resolve(data.userList); 
                } else {
                    console.log(`listUsersInGroup Error,  data.details.code = ${data.details.code}`);
                    reject(data.error);
                }
            });
    });
}


function listGroups() {
    return new Promise((resolve, reject) => {
        TcHmi.Server.UserManagement.listUserGroups(
            function (data) {

                if (
                    !data
                    || !data.groupDetailsList
                    || !data.groupDetailsList.__SystemGuests
                ) {
                    console.log('listGroups has no data');
                    return;
                }

                if (data.error === TcHmi.Errors.NONE) {
                    resolve(data.groupDetailsList);
                } else {
                    console.log(`listGroups Error,  data.details.code = ${data.details.code}`);
                    reject(data.error);
                }
            }
        );
    });
}


function AddUserEx(username, password, autologOut, group) {
    return new Promise((resolve, reject) => {
        var grp = ['__SystemGuests'];
        if (group == 1) {
            grp = ["__SystemAdministrators"];
        }
        if (group == 0) {
            grp = ['Users'];
        }

        var autologOutLocal = 'PT' + autologOut + 'M';
        TcHmi.Server.UserManagement.addUserEx(
            username,
            password,
            { groups: grp, enabled: true, autoLogout: autologOutLocal, locale: 'en' },
            { timeout: 2000 },
            function (data) {
                if (data.error === TcHmi.Errors.NONE) {
                    resolve(data.error);
                } else {
                    console.log(`AddUserEx Error,  data.details.code = ${data.details.code}`);
                    reject(data.error);
                }
            }
        );
    });
}



function EnableUser(username) {
    return new Promise((resolve, reject) => {
        TcHmi.Server.writeSymbol('TcHmiUserManagement.EnableUser', username, function (data) {
            if (data.error === TcHmi.Errors.NONE) {
                resolve(JSON.stringify(data));
                console.log('Enabling user');
            } else {
                const errorData = {
                    ErrorCode: data.error,
                    ErrorText: `Error in EnableUser, symbolParameter = ${username}`
                };
                reject(errorData);
            }
        });
    });
}



function AddUser(username, password) {
    return new Promise((resolve, reject) => {
        TcHmi.Server.UserManagement.addUser(
            username,
            password,
            function (data) {
                if (data.error === TcHmi.Errors.NONE) {
                    resolve(data.error);
                } else {
                    console.log(`AddUser Error,  data.details.code = ${data.details.code}`);
                    reject(data.error);
                }
            }
        );
    });
}

function UpdateUser(username, newName,password, autologOut, group) {
    return new Promise((resolve, reject) => {

        var grp = ['__SystemGuests'];
        if (group == 1) {
            grp = ["__SystemAdministrators"];
        }
        if (group == 0) {
            grp = ['Users'];
        }

        var autologOutLocal = 'PT' + autologOut + 'M';

        TcHmi.Server.UserManagement.updateUser(
            username,
            {
                domain: 'TcHmiUserManagement', // Only for adressing, not changeable
                enabled: true,
                newName: newName,
                password: password,
                autoLogout: autologOutLocal,
                locale: 'en',
                addGroups: grp
            },
            function (data) {

                if (data.error === TcHmi.Errors.NONE) {
                    resolve(data.error);
                } else {
                    console.log(`UpdateUser Error,  data.details.code = ${data.details.code}`);
                    reject(data.error);
                }
            }
        );
    });
}





function RemoveUser(userName) {
    return new Promise((resolve, reject) => {
        TcHmi.Server.UserManagement.removeUser(
            userName,
            function (data) {
                if (data.error === TcHmi.Errors.NONE) {
                    resolve(data.error);
                } else {
                    console.log(`RemoveUser Error,  data.details.code = ${data.details.code}`);
                    reject(data.error);
                }
            }
        );
    });
}





(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    // If you want to unregister an event outside the event code you need to use the return value of the method register()
    var destroyOnInitialized = TcHmi.EventProvider.register('onInitialized', function (e, data) {
        // This event will be raised only once, so we can free resources. 
        // It's best practice to use destroy function of the event object within the callback function to avoid conflicts.
        e.destroy();
        // ----------------------
        // Place your code here!
        // ----------------------
    });
})(TcHmi);
