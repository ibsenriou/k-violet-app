import axios from 'axios'

// This is the base URL of the API that will be used in all requests.
// You can change it if you want to use another API, or if the domain changes.
export const api = axios.create({
    baseURL: 'http://localhost:8000/api'
})
