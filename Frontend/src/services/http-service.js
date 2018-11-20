import 'whatwg-fetch';

class HttpSerice {
    getJunks = () => {
        var promise = new Promise((resolve, reject) => {
            fetch('http://localhost:3001/junk')
            .then(response => {
                resolve(response.json());
            })
        });
        return promise;
    }
}

export default HttpSerice;
