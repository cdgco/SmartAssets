import axios from "axios";

export const search = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/assets/search?q=" + item.query, // should be replaced after going to production with domain url
        method: "get",
        headers: {
            "X-API-KEY": "b57a83f9-9e39-4bc3-94cd-a3ca1388dea0"
        }
    };

    const response = await axios(request);
    return response;
};