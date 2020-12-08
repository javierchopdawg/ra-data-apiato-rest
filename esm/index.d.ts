import { fetchUtils, DataProvider } from 'ra-core';
declare const _default: (apiUrl: any, httpClient?: (url: any, options?: fetchUtils.Options) => Promise<{
    status: number;
    headers: Headers;
    body: string;
    json: any;
}>) => DataProvider;
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
export default _default;
