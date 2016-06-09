import {serverURL as baseURL} from '../env';


export async function get(url) {
    let response = await fetch(`${baseURL}/api/v1/${url}`);
    let body = await response.json();
    return body;
}

export async function post(url, data) {
    let response = await fetch(`${baseURL}/api/v1/${url}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        );
    let body = await response.json();
    return body;
}
