import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/flatMap';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/fromEvent';
import 'rxjs';

/* --- Moving circle --- */

const circle = document.getElementById('circle');
const sourse = Observable.fromEvent(document, 'mousemove')
    .map((event: MouseEvent) => ({ x: event.clientX, y: event.clientY }))
    .filter(value => value.x > 500)
    .delay(300);

sourse.subscribe(value => {
    circle.style.left = `${value.x}px`;
    circle.style.top = `${value.y}px`;
});

/* --- Fetching data --- */

const output = document.getElementById('output');
const button = document.getElementById('button');

const click = Observable.fromEvent(button, 'click');

click.subscribe(e => load('movies.json'));

function load(url: string) {
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

/* --- Fetching data 2 --- */

const output2 = document.getElementById('output2');
const button2 = document.getElementById('button2');

const click2 = Observable.fromEvent(button2, 'click');

loadWithFetch('movies.json')
    .subscribe(renderMovies);

click2
    .flatMap(e => load2('moviess.json'))
    .subscribe(
        renderMovies,
        console.log
    );

function load2(url: string) {
    return Observable.create(observer => {
        const xhr = new XMLHttpRequest();

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);

                observer.next(data);
                observer.complete();
            } else {
                observer.error(xhr.statusText);
            }
        });

        xhr.open('GET', url);
        xhr.send();
    })
    .retryWhen(retryStrategy());
}

function loadWithFetch(url) {
    return Observable.defer(() => Observable.fromPromise(fetch(url).then(r => r.json())));
}

function retryStrategy({ attempts = 4, delay = 1500} = {}) {
    return function(error) {
        return error
            .scan((acc, value) => acc + 1, 0)
            .takeWhile(acc => acc < attempts)
            .delay(delay);
    }
}

function renderMovies(movies) {
    movies.forEach(movie => {
        const div = document.createElement('div');
        
        div.innerText = movie.title;
        output2.appendChild(div);
    });
}

/* --- Fetching data 3 --- */
