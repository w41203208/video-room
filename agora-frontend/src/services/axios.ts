import axios, { AxiosInstance } from 'axios';
interface AxiosParams {
  url: string;
  method: string;
  data: object;
}

const token_instance = axios.create({
  // baseURL: 'https://backend.mingchejay.page/',
  baseURL: 'http://localhost:8082/',
});
const whiteboard_instance = axios.create({
  baseURL: 'http://localhost:3003/',
});

whiteboard_instance.interceptors.request.use((req) => {
  req.headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
  };
  console.log(req.data);
  return req;
});

token_instance.interceptors.request.use((req) => {
  req.headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
  };
  console.log(req.data);
  return req;
});

const createClient = (instance: any) => {
  return ({ url = '', method = 'get', data = {} }: AxiosParams) => {
    return (instance as any)[method](url, data);
  };
};

export const AxiosClient = createClient(whiteboard_instance);
export const AxiosTokenClient = createClient(token_instance);
