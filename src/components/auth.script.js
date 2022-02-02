import axios from "axios";

export const signup = async item => {
    let data = {
        username: item.username,
        email: item.email,
        password: item.password,
        roles: ["user"]
    };
    let request = {
        url: process.env.VUE_APP_API_URL + "/auth/signup", // should be replaced after going to production with domain url
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        data: JSON.stringify(data)
    };

    const response = await axios(request);
    return response;
};

export const login = async item => {
    let data = {
        username: item.username,
        password: item.password
    };
    let request = {
        url: process.env.VUE_APP_API_URL + "/auth/signin", // should be replaced after going to production with domain url
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        data: JSON.stringify(data)
    };

    const response = await axios(request);
    return response;
};