let allRoles = []
let authUser;
$(document).ready(function() {
    getAllRoles().then(function (roles) {
        allRoles = roles;
        $.ajax({
            url: '/api/user/',
            method: 'GET',
            success: function (user) {
                authUser = user;
                createHeader(user);
                createNavMenu(user);
                createFormAddNewUser();
                addRolesEditForm();
                addRolesDeleteForm();
            },
            error: function (xhr, status, error) {
                console.log("error");
            }
        });
    });

    $('#edit-button-form').on('click', function (e) { 
        e.preventDefault();

        let rolesSelected = [];

        $('#selected-roles-user option:selected').each(function () {
            let option = $(this);
            rolesSelected.push({
                id: option.val(),
                role: option.text()
            });
        });

        if (rolesSelected.length === 0) {
            return
        }

        let userData = {
            id: $('#id-edit-user').val(),
            name: $('#name-edit-user').val(),
            surname: $('#surname-edit-user').val(),
            age: $('#age-edit-user').val(),
            salary: $('#salary-edit-user').val(),
            email: $('#email-edit-user').val(),
            password: $('#password-edit-user').val(),
            roles: rolesSelected,
        };
        $.ajax({
            url: '/api/admin/',
            method: 'patch',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function () {
                updateTabsBodyUser(userData);
                $('#edit-close-button').click();
            }
        })
    });
    
    $('#delete-button-form').on('click', function (e) {
        e.preventDefault();
        let idUserDelete = $('#id-delete-user').val();
        $.ajax({
            url: `/api/admin/${idUserDelete}`,
            method: 'delete',
            success: function () {
                updateTabsBodyUser({id: idUserDelete});
                $('#delete-close-button ').click();
            }
        });
    });
});

function updateTabsBodyUser(userData) {
    if (userData.id == authUser.id){
        $('#button-logout').click();
    }
    $('#table-body-all-user').empty();
    createTableBodyAllUser();
}

function getAllRoles() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: '/api/role/',
            method: 'GET',
            success: function (roles) {
                resolve(roles);
            },
            error: function (xhr, status, error) {
                console.log("error");
            }
        });
    });
}

function createFormAddNewUser() {
    let addButton = $('#add-user-btn');
    let selectRoles = $('#role-new-user');

    allRoles.forEach(function (role) {
        let option = $('<option>', {value: role.id, text:role.role})
        selectRoles.append(option)
    })

    addButton.on('click', function (e) {
        e.preventDefault();

        let rolesSelected = [];
        $('#role-new-user option:selected').each(function () {
            let option = $(this);
            rolesSelected.push({
                id: option.val(),
                role: option.text()
            });
        });

        if (rolesSelected.length === 0) {
            return
        }
        let userData = {
            name: $('#name-new-user').val(),
            surname: $('#surname-new-user').val(),
            salary: $('#salary-new-user').val(),
            age: $('#age-new-user').val(),
            email: $('#email-new-user').val(),
            password: $('#password-new-user').val(),
            roles: rolesSelected,
        };

        $.ajax({
            url: '/api/admin/',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function (user) {
                clearForm();
                displayUsers(user);
            }
        })
    });
}

function clearForm() {
    $('#name-new-user').val('');
    $('#surname-new-user').val('');
    $('#age-new-user').val('');
    $('#salary-new-user').val('');
    $('#email-new-user').val('');
    $('#password-new-user').val('');
    $('#role-new-user').val([]);
}

function createHeader(user) {
    
    let headUserInfo = $('#header-text-info-user');
    let emailUser = $('<strong>', {text: user.email});
    let additionalText = $('<span>', {
        text: ' with roles: '
    });
    let rolesUser = $('<strong>', {});

    user.roles.forEach(function (role, index) {
        if (index > 0) {
            rolesUser.append(', ');
        }
        rolesUser.append(role.role);
    })
    headUserInfo.append(emailUser).append(additionalText).append(rolesUser);
}

function createNavMenu(user) {
    let adminNavLink = $('#v-pills-home-tab');
    let userNavLink = $('#v-pills-profile-tab');

    if (user.roles.some(role => role.role === 'ROLE_ADMIN')) {
        adminNavLink.addClass('active');
        $('#v-pills-home').addClass('show').addClass('active');

        createTableBodyAllUser();

        if (user.roles.some(role => role.role === 'ROLE_USER')) {
            showUserAuthInfo(user);
        } else {
            userNavLink.remove();
        }
    } else {
        userNavLink.addClass('active');
        $('#v-pills-profile').addClass('show').addClass('active');

        showUserAuthInfo(user);

        adminNavLink.remove();
    }
}

function addRolesEditForm() {
    let roleEdit = $('#selected-roles-user');

    allRoles.forEach(function (role) {
        let option = $('<option>', {value: role.id, text: role.role});
        roleEdit.append(option);
    });
}

function addRolesDeleteForm() {
    let roleDelete = $('#roles-delete-user');

    allRoles.forEach(function (role) {
        let option = $('<option>', {value: role.id, text: role.role});
        roleDelete.append(option);
    });
}

function createTableBodyAllUser() {
    $.ajax({
        url: '/api/admin/',
        method: 'GET',
        success: function (allUser) {
            displayUsers(allUser);
        }
    });
}

function displayUsers(allUser) {
    let tableBodyAllUser = $('#table-body-all-user');

    if (!Array.isArray(allUser)) {
        allUser = [allUser];
    }

    allUser.forEach(function (user) {
        let userLineTable = displayUser(user);
        tableBodyAllUser.append(userLineTable);
        addEditButton(userLineTable, user);
        addDeleteButton(userLineTable, user);
    });
}

function displayUser(user) {
    let tr = $('<tr>');
    let idUser = $('<td>', {text: user.id});
    let tdName = $('<td>', {text: user.name});
    let tdSurname = $('<td>', {text: user.surname});
    let tdEmail = $('<td>', {text: user.email});
    let tdAge = $('<td>', {text: user.age});
    let tdSalary = $('<td>', {text: user.salary});
    let tdRole = $('<td>');
    user.roles.forEach(function (role, index) {
        if (index > 0) {
            tdRole.append(', ');
        }
        tdRole.append(role.role);
    })
    tr.append(idUser)
        .append(tdName)
        .append(tdSurname)
        .append(tdEmail)
        .append(tdAge)
        .append(tdSalary)
        .append(tdRole);
    return tr;
}

function addEditButton(userLineTable, user) {
    let tdButtonEdit = $('<td>');
    let buttonEdit = $('<button>', {
        type: 'button',
        class: 'btn btn-info',
        'data-toggle': 'modal',
        'data-target': `#editModal`,
        text: 'Edit',
    });

    buttonEdit.click(function () {
        $('#id-edit-user').val(user.id);
        $('#name-edit-user').val(user.name);
        $('#surname-edit-user').val(user.surname);
        $('#age-edit-user').val(user.age);
        $('#salary-edit-user').val(user.salary);
        $('#email-edit-user').val(user.email);
        $('#password-edit-user').val('');
    });

    tdButtonEdit.append(buttonEdit);
    userLineTable.append(tdButtonEdit);
}

function addDeleteButton(userLineTable, user) {
    let tdButtonDelete = $('<td>');
    let buttonDelete = $('<button>', {
        type: 'button',
        class: 'btn btn-danger',
        'data-toggle': 'modal',
        'data-target': `#deleteModal`,
        text: 'Delete',
    });
    tdButtonDelete.append(buttonDelete);
    userLineTable.append(tdButtonDelete);

    buttonDelete.click(function () {
        let userRolesFormDelete = $('#roles-delete-user');

        userRolesFormDelete.val([]);

        $('#id-delete-user').val(user.id);
        $('#name-delete-user').val(user.name);
        $('#surname-delete-user').val(user.surname);
        $('#age-delete-user').val(user.age);
        $('#salary-delete-user').val(user.salary);
        $('#email-delete-user').val(user.email);

        user.roles.forEach(function (role) {
            $(`#roles-delete-user option[value="${role.id}"]`).prop('selected', true);
        });
        userRolesFormDelete.trigger('change');
    });
}

function showUserAuthInfo(user) {
    let tableAuthUser = $('#user-info-profile');
    let tableBodyAuthUser = displayUser(user);
    tableAuthUser.append(tableBodyAuthUser);
}