import axios from "axios";

export const getEvents = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/event/?limit=" + item.items + "&type=" + item.type,
        method: "get",
        headers: {
            "Authorization": "Bearer " + item.token
        }
    };

    const response = await axios(request);
    return response;
};