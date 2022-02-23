import axios from "axios";

export const getAsset = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/assets/" + encodeURIComponent(item.query),
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

export const updateAsset = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/assets/" + item.id,
        method: "put",
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + item.token
        },
        data: JSON.stringify(item)
    };

    const response = await axios(request);
    return response;
};

export const deleteAsset = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/assets/" + item.id,
        method: "delete",
        headers: {
            "Authorization": "Bearer " + item.token
        }
    };

    const response = await axios(request);
    return response;
};