import {serverURL as baseURL} from '../env';


export async function get(url) {
    let response = await fetch(`${baseURL}/api/v1/${url}`);
    let body = await response.json();
    return body;
}
