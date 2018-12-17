import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

class AuthService {

   TOKEN_KEY = 'auth_token';

    getToken(){
        return localStorage.getItem(this.TOKEN_KEY);
    }

    decode(token){
        return jwt.decode(token);
    }

    saveToken(token){
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    invalidateToken(){
        localStorage.removeItem(this.TOKEN_KEY);
    }

    getExpiration(token){
        const exp = this.decode(token).exp;
        return moment.unix(exp);
    }

    isValid(token){
        return moment().isBefore(this.getExpiration(token));
    }

    isAuthenticated(){
        const token = this.getToken();
        return (token && this.isValid(token)) ? true : false;
    }
}

export default new AuthService();