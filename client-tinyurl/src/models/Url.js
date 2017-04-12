import BaseModel from './BaseModel';
class Url extends BaseModel {
    encode(params) {
        return this.request('api/urls/encode', 'POST', params);
    }
}

export default Url;