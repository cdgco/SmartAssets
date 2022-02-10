import axios from "axios";

export const search = async item => {
    let request = {
        url: process.env.VUE_APP_API_URL + "/assets/nativesearch?q=" + item.query + "&limit=" + item.items + "&skip=" + ((item.page - 1) * item.items), // should be replaced after going to production with domain url
        method: "get",
        headers: {
            "Authorization": "Bearer " + item.token
        }
    };

    const response = await axios(request);
    return response;
};