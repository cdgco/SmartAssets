import axios from "axios";

export const getEvents = async item => {
    if (item.user) {
        var url = process.env.VUE_APP_API_URL + "/event/?limit=" + item.items + "&type=" + item.type + "&user=" + item.user
    } else if (item.asset) {
        var url = process.env.VUE_APP_API_URL + "/event/?limit=" + item.items + "&type=" + item.type + "&asset=" + item.asset
    } else {
        var url = process.env.VUE_APP_API_URL + "/event/?limit=" + item.items + "&type=" + item.type
    }
    let request = {
        url: url,
        method: "get",
        headers: {
            "Authorization": "Bearer " + item.token
        }
    };

    const response = await axios(request);
    return response;
};