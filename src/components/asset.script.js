import axios from "axios";
import { date } from "express-openapi-validator/dist/framework/base.serdes";

export const getAsset = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/assets/" + item.query,
        method: "get",
        headers: {
            "Authorization": "Bearer " + item.token
        }
    };

    const response = await axios(request);
    return response;
};

export const getAssets = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/assets/?limit=" + item.items + "&skip=" + ((item.page - 1) * item.items) + "&sort=desc",
        method: "get",
        headers: {
            "Authorization": "Bearer " + item.token
        }
    };

    const response = await axios(request);
    return response;
};

export const createAsset = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/assets",
        method: "post",
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + item.token
        },
        data: JSON.stringify(item)
    };

    const response = await axios(request);
    return response;
};