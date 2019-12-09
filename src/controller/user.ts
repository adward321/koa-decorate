import * as Koa from 'koa';
import {get, post, put, deleteL, prefix, validator} from '../utils/decorators';
import {requestLog} from "../middlewares/log";

const userList = [
    {name: 'Adward', age: 40},
    {name: 'shikang', age: 21},
    {name: 'shara', age: 32}
];

@prefix('/validate')
class user {
    @get('/users', {middlewares: [requestLog]})
    public async list(ctx) {
        ctx.body = {status: 0, data: userList};
    }

    @get('/user', {middlewares: [requestLog]})
    @validator({
        query: {
            name: {type: 'string', required: true}
        }
    })
    public async getUserByName(ctx) {
        let filterUsers = userList.filter(user => user.name === ctx.query.name);
        if (filterUsers.length === 0) {
            ctx.body = {status: 0, data: null};
            return;
        }
        ctx.body = {status: 0, data: filterUsers[0]};
    }

    @post('/user', {middlewares: [requestLog]})
    @validator({
        body: {
            name: {type: 'string', required: true},
            age: {type: 'number', required: true}
        }
    })
    public async postUser(ctx) {
        userList.push(ctx.body);
        ctx.body = {status: 0};
    }

    @put('/user', {middlewares: [requestLog]})
    @validator({
        body: {
            name: {type: 'string', required: true},
            age: {type: 'number', required: true}
        }
    })
    public async putUser(ctx) {
        let i = 0;
        for (; i < userList.length; i++) {
            if (userList[i].name === ctx.query.targetName) {
                userList[i] = ctx.request.body;
                break;
            }
        }
        let status = i < userList.length ? 0 : 1;
        ctx.body = {status};
    }
    @deleteL('/user', {middlewares: [requestLog]})
    @validator({
        query: {
            targetId: {type: 'string', required: true}
        }
    })
    public async deleteLUser(ctx) {
        let i = 0;
        for (; i < userList.length; i++) {
            if (userList[i].name === ctx.query.targetId) {
                userList.splice(i,1)
                break;
            }
        }
        let status = i < userList.length ? 1 : 0;
        ctx.body = {status};
    }
}
 