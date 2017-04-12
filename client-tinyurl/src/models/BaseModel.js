class BaseModel {
    request(url, method, body) {
        return new Promise((resolve, reject) => {
            return fetch(url, {
                method,
                body: JSON.stringify(body),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    return response.json();
                })
                .then(resolve)
                .catch(reject);
        });
    }
}
export default BaseModel;