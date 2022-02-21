import axios from "axios";

export const getCompanies = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/company",
        method: "get",
        headers: {
            "Authorization": "Bearer " + item.token
        }
    };

    const response = await axios(request);
    return response;
};

export const getLocations = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/location",
        method: "get",
        headers: {
            "Authorization": "Bearer " + item.token
        }
    };

    const response = await axios(request);
    return response;
};

export const getManufacturers = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/manufacturer",
        method: "get",
        headers: {
            "Authorization": "Bearer " + item.token
        }
    };

    const response = await axios(request);
    return response;
};

export const getModels = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/model",
        method: "get",
        headers: {
            "Authorization": "Bearer " + item.token
        }
    };

    const response = await axios(request);
    return response;
};

export const getSuppliers = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/supplier",
        method: "get",
        headers: {
            "Authorization": "Bearer " + item.token
        }
    };

    const response = await axios(request);
    return response;
};

export const getTags = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/tags",
        method: "get",
        headers: {
            "Authorization": "Bearer " + item.token
        }
    };

    const response = await axios(request);
    return response;
};

export const getTypes = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/type",
        method: "get",
        headers: {
            "Authorization": "Bearer " + item.token
        }
    };

    const response = await axios(request);
    return response;
};