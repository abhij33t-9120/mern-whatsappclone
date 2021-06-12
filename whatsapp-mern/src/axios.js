import axios from 'axios'

const instance =axios.create({
    baseURL:' https://mern-whatsappclone.herokuapp.com/'
})

export default instance