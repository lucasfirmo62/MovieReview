import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vertuz.pythonanywhere.com/',
})

api.interceptors.request.use(
  async (config) => {
    if (config.url.endsWith('/api/token/') || ((config.url.endsWith('/usuarios/') && config.method === 'post'))) {
      return config;
    }

    let access = localStorage.getItem('tokenUser');
    let refresh = localStorage.getItem('refreshTokenUser');
    access = access.substring(1, access.length - 1)
    refresh = refresh.substring(1, refresh.length - 1)

    const headers = {
      'Content-Type': 'application/json',
    };

    if (access && refresh) {
      try {
        await axios.post('https://vertuz.pythonanywhere.com/api/token/verify/', { token: access }, { headers });
      } catch (error) {
        if (error.response.status === 401) {
          try {
            const response = await axios.post('https://vertuz.pythonanywhere.com/api/token/refresh/', { refresh: refresh }, { headers });
            const newAccess = response.data.access;

            localStorage.setItem('tokenUser', JSON.stringify(newAccess));

            config.headers.Authorization = `Bearer ${newAccess}`;
          } catch (error) {
            console.log(error);
          }
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;