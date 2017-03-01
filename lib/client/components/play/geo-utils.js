export const getCurrentPosition = _ => new Promise((resolve, reject) => {
    function success(position) {
        console.log(position);
        resolve(position);
    }

    function error(err) {
        reject(err);
    }

    navigator.geolocation.getCurrentPosition(success, error);
});
