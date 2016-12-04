import { Observable } from 'rxjs/Rx';

import { load, load2, loadWithFetch } from './loaders';
import './errorHandling';

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

click.subscribe(e => load('movies.json', output));

/* --- Fetching data 2 --- */

const output2 = document.getElementById('output2');
const button2 = document.getElementById('button2');

const click2 = Observable.fromEvent(button2, 'click');

loadWithFetch('moviess.json')
    .subscribe(
        renderMovies,
        console.log,
        () => console.log('loadWithFetch complete'));

const subscription = load2('movies.json')
    .subscribe(
        renderMovies,
        console.log,
        () => console.log('load2 with unsubscription complete'));

subscription.unsubscribe();

click2
    .flatMap(e => load2('moviess.json'))
    .subscribe(
        renderMovies,
        console.log
    );

function renderMovies(movies) {
    movies.forEach(movie => {
        const div = document.createElement('div');
        
        div.innerText = movie.title;
        output2.appendChild(div);
    });
}
