import axios from "axios";

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