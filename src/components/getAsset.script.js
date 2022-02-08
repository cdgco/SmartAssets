import axios from "axios";

export const getAsset = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/assets/" + item.query,
        method: "get",
        headers: {
            "X-API-KEY": "b57a83f9-9e39-4bc3-94cd-a3ca1388dea0"
        }
    };

    const response = await axios(request);
    return response;
};