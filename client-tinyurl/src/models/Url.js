import BaseModel from './BaseModel';
class Url extends BaseModel {
    encode(params) {
        return this.request('api/urls/encode', 'POST', params);
    }

    find(params = null) {
        return this.request('api/urls', 'GET', params);
    }
}

export default Url;