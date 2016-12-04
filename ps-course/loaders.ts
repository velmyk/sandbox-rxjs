import { Observable } from 'rxjs/Rx';

export function load(url: string, output: HTMLElement) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', () => {
        const movies = JSON.parse(xhr.responseText);

        movies.forEach(movie => {
            const div = document.createElement('div');

            div.innerText = movie.title;
            output.appendChild(div);
        });
    });

    xhr.open('GET', url);

    xhr.send();
}

export function load2(url: string) {
    return Observable.create(observer => {
        const xhr = new XMLHttpRequest();
        const onLoad = () => {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);

                observer.next(data);
                observer.complete();
            } else {
                observer.error(xhr.statusText);
            }
        };

        xhr.addEventListener('load', onLoad);

        xhr.open('GET', url);
        xhr.send();

        return () => {
            xhr.removeEventListener('load', onLoad);
            xhr.abort();
        };
    })
    .retryWhen(retryStrategy());
}

export function loadWithFetch(url) {
    return Observable.defer(() => Observable.fromPromise(
        fetch(url).then(r => {
            if (r.status === 200) {
                return r.json();
            } else {
                return Promise.reject(r);
            }
        })
    )).retryWhen(retryStrategy());
}

function retryStrategy({ attempts = 4, delay = 1500} = {}) {
    return function(error) {
        return error
            .scan((acc, value) => {
                acc += 1;
                if (acc < attempts) {
                    return acc;
                } else {
                    throw new Error(value);
                } 
            }, 0)
            .delay(delay);
    }
}