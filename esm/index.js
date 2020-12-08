var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { stringify } from 'query-string';
import { fetchUtils } from 'ra-core';
/**
 * Maps react-admin queries to a Apiato's REST API
 *
 * This REST dialect is designed for Apiato
 *
 * @see https://github.com/apiato/apiato
 *
 * @example
 *
 * getList     => GET http://my.api.url/posts?limit=10&page=1
 * getOne      => GET http://my.api.url/posts/123
 * getMany     => GET http://my.api.url/posts
 * update      => PUT http://my.api.url/posts/123
 * create      => POST http://my.api.url/posts
 * delete      => DELETE http://my.api.url/posts/123
 *
 * @example
 *
 * import React from 'react';
 * import { Admin, Resource } from 'react-admin';
 * import apiatoRestProvider from 'ra-data-apaito-rest';
 *
 * import { PostList } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={apiatoRestProvider('http://path.to.my.api/')}>
 *         <Resource name="posts" list={PostList} />
 *     </Admin>
 * );
 *
 * export default App;
 */
export default (function (apiUrl, httpClient) {
    if (httpClient === void 0) { httpClient = fetchUtils.fetchJson; }
    return ({
        getList: function (resource, params) {
            var _a = params.pagination, page = _a.page, perPage = _a.perPage;
            var _b = params.sort, field = _b.field, order = _b.order;
            var query = {
                limit: perPage,
                page: page,
                orderBy: field,
                sortedBy: order,
                search: params.filter.q ? params.filter.q : ""
            };
            var url = apiUrl + "/" + resource + "?" + stringify(query);
            return httpClient(url).then(function (_a) {
                var headers = _a.headers, json = _a.json;
                return {
                    data: json.data,
                    total: json.meta.pagination.total,
                };
            });
        },
        getOne: function (resource, params) {
            return httpClient(apiUrl + "/" + resource + "/" + params.id).then(function (_a) {
                var json = _a.json;
                return ({
                    data: json.data,
                });
            });
        },
        getMany: function (resource, params) {
            var query = {
                in: JSON.stringify({ id: params.ids }),
            };
            var url = apiUrl + "/" + resource + "?" + stringify(query);
            return httpClient(url).then(function (_a) {
                var json = _a.json;
                return ({ data: json.data });
            });
        },
        getManyReference: function (resource, params) {
            var _a = params.pagination, page = _a.page, perPage = _a.perPage;
            var _b = params.sort, field = _b.field, order = _b.order;
            var query = {
                limit: perPage,
                page: page,
                orderBy: field,
                sortedBy: order,
            };
            var url = apiUrl + "/" + resource + "?" + stringify(query);
            return httpClient(url).then(function (_a) {
                var headers = _a.headers, json = _a.json;
                return {
                    data: json.data,
                    total: json.meta.pagination.total,
                };
            });
        },
        update: function (resource, params) {
            return httpClient(apiUrl + "/" + resource + "/" + params.id, {
                method: 'PATCH',
                body: JSON.stringify(params.data),
            }).then(function (_a) {
                var json = _a.json;
                return ({ data: json });
            });
        },
        // apiato-rest doesn't handle provide an updateMany route, so we fallback to calling update n times instead
        updateMany: function (resource, params) {
            return Promise.all(params.ids.map(function (id) {
                return httpClient(apiUrl + "/" + resource + "/" + id, {
                    method: 'PATCH',
                    body: JSON.stringify(params.data),
                });
            })).then(function (responses) { return ({ data: responses.map(function (_a) {
                    var json = _a.json;
                    return json.id;
                }) }); });
        },
        create: function (resource, params) {
            return httpClient(apiUrl + "/" + resource, {
                method: 'POST',
                body: JSON.stringify(params.data),
            }).then(function (_a) {
                var json = _a.json;
                return ({
                    data: __assign(__assign({}, params.data), { id: json.id }),
                });
            });
        },
        delete: function (resource, params) {
            return httpClient(apiUrl + "/" + resource + "/" + params.id, {
                method: 'DELETE',
            }).then(function (_a) {
                var json = _a.json;
                return ({ data: json });
            });
        },
        // apiato-rest doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
        deleteMany: function (resource, params) {
            return Promise.all(params.ids.map(function (id) {
                return httpClient(apiUrl + "/" + resource + "/" + id, {
                    method: 'DELETE',
                });
            })).then(function (responses) { return ({ data: responses.map(function (_a) {
                    var json = _a.json;
                    return json.id;
                }) }); });
        },
    });
});
