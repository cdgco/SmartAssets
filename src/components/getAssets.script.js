import axios from "axios";

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