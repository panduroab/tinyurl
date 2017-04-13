class BaseModel {
    request(url, method, params = null) {
        return new Promise((resolve, reject) => {
            let data = {
                method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };
            if (params.body) {
                data.body = JSON.stringify(params.body);
            }
            if (params.filter) {
                url += "?filter=" + encodeURIComponent(JSON.stringify(params.filter));
            }
            return fetch(url, data)
                .then((response) => {
                    return response.json();
                })
                .then(resolve)
                .catch(reject);
        });
    }
}
export default BaseModel;