export const API_URL = 'http://localhost:8082';
export const BASIC_AUTH_CLIENT =
    'Basic Y29udHJvbGUtY2VydG8tY2xpZW50OndlYjEyMw==';

export function TOKEN_USER_AUTH(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username.value);
    formData.append('password', password.value);
    formData.append('grant_type', 'password');

    console.log(formData.toString());

    return fetch('http://localhost:8082/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic Y29udHJvbGUtY2VydG8tY2xpZW50OndlYjEyMw==',
        },
        body: formData.toString(),
    })
        .then((response) => {
            console.log('response 401:' + response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Success:', data);
            const accessToken = data.access_token;
            console.log('Access Token:', accessToken);
            return accessToken; // Return the access token
        })
        .catch((error) => {
            console.error('Error:', error);
            throw error; // Rethrow the error to be handled by the caller
        });
}

export function POST_USER_AUTH(body) {
    return {
        url: 'http://localhost:8082/v1/oauth/register',
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic Y29udHJvbGUtY2VydG8tY2xpZW50OndlYjEyMw==',
            },
            body: JSON.stringify(body),
        },
    };
}

export function POST_USER(body, accessToken) {
    return {
        url: 'http://localhost:8082/v1/user',
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + accessToken,
            },
            body: JSON.stringify(body),
        },
    };
}

export function GET_USER(token) {
    return {
        url: 'http://localhost:8082/v1/user/document',
        options: {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
        },
    };
}

export function TOKEN_VALIDATE(token) {
    const formData = new URLSearchParams();
    formData.append('token', token);
    return {
        url: 'http://localhost:8082/oauth/check_token',
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic Y29udHJvbGUtY2VydG8tY2xpZW50OndlYjEyMw==',
            },
            body: formData.toString(),
        },
    };
}

export function TESTE(body) {
    console.log(body);
    return {
        url: 'http://localhost:8082/oauth/token',
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic Y29udHJvbGUtY2VydG8tY2xpZW50OndlYjEyMw==',
            },
            body: body.toString(),
        },
    };
}

export function GET_CATEGORY_USER() {
    return {
        url: 'http://localhost:8082/v1/category',
        options: {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + window.localStorage.getItem('token'),
            },
        },
    };
}

export function GET_EXPENSE_USER(month, year) {
    return {
        url: 'http://localhost:8082/v1/expense/current-month',
        options: {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + window.localStorage.getItem('token'),
                month: parseInt(month),
                year: parseInt(year),
            },
        },
    };
}

export function GET_MONTHLY_BUDGET(month, year) {
    return {
        url: 'http://localhost:8082/v1/monthly/current-month',
        options: {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + window.localStorage.getItem('token'),
                month: parseInt(month),
                year: parseInt(year),
            },
        },
    };
}

export function GET_LAST_MONTHLY_BUDGET() {
    return {
        url: 'http://localhost:8082/v1/monthly/last-month',
        options: {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + window.localStorage.getItem('token')
            },
        },
    };
}


export function POST_EXPENSE_USER(requestBody) {
    return {
        url: 'http://localhost:8082/v1/expense',
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + window.localStorage.getItem('token'),
            },
            body: JSON.stringify(requestBody),
        },
    };
}

export function POST_REQUEST_TOKEN_PASSWORD(username, email) {
    return {
        url: 'http://localhost:8082/v1/password-reset/request',
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                username: username,
                email: email,
            },
        },
    };
}

export function POST_VALIDATE_TOKEN_PASSWORD(token, password) {
    return {
        url: 'http://localhost:8082/v1/password-reset/validate-token',
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: token,
                newPassword: password,
            },
        },
    };
}

export function POST_CATEGORY_USER(body) {
    return {
        url: 'http://localhost:8082/v1/category',
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + window.localStorage.getItem('token'),
            },
            body: JSON.stringify(body),
        },
    };
}

export function DELETE_CATEGORY_USER(categoryId) {
    return {
        url: 'http://localhost:8082/v1/category/' + categoryId,
        options: {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + window.localStorage.getItem('token'),
            },
        },
    };
}

export function POST_BUDGET_USER(body) {
    return {
        url: 'http://localhost:8082/v1/monthly',
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + window.localStorage.getItem('token'),
            },
            body: JSON.stringify(body),
        },
    };
}

export function GET_CEP(cep) {
    return {
        url: `https://viacep.com.br/ws/${cep}/json`,
        options: {
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-Type': 'application/json',
            },
        },
    };
}

export function DELETE_CATEGORY(id) {
    return {
        url: `http://localhost:8082/v1/category/${id}`,
        options: {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + window.localStorage.getItem('token'),
            },
        },
    };
}

export function DELETE_EXPENSE(body) {
    return {
        url: `http://localhost:8082/v1/expense/${body.id_despesa}`,
        options: {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                type: body.tipo_despesa,
                month: body.month,
                year: body.year,
                Authorization: 'Bearer ' + window.localStorage.getItem('token'),
            },
        },
    };
}

export function DELETE_MONTHLY_BUDGET(id) {
    return {
        url: `http://localhost:8082/v1/monthly/${id}`,
        options: {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + window.localStorage.getItem('token'),
            },
        },
    };
}

export function PUT_USER_PROFILE(body) {
    return {
        url: `http://localhost:8082/v1/user`,
        options: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + window.localStorage.getItem('token'),
            },
            body: JSON.stringify(body)
        },
    };
}

export function POST_CHANGE_PASSWORD_ON_APP(body) {
    return {
        url: `http://localhost:8082/v1/password-reset/change-password`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + window.localStorage.getItem('token'),
            },
            body: JSON.stringify(body)
        },
    };
}

export function GET_USERS_ADM() {
    return {
        url: `http://localhost:8082/v1/user/all`,
        options: {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + window.localStorage.getItem('token'),
            },
        },
    };
}

export function DELETE_USER(id) {
    return {
        url: `http://localhost:8082/v1/user/${id}`,
        options: {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + window.localStorage.getItem('token'),
            },
        },
    };
}



