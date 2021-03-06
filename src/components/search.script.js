import axios from "axios";

export const search = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/assets/nativesearch?q=" + encodeURIComponent(item.query) + "&limit=" + item.items + "&skip=" + ((item.page - 1) * item.items),
        method: "get",
        headers: {
            "Authorization": "Bearer " + item.token
        }
    };

    const response = await axios(request);
    return response;
};