import { Observable } from 'rxjs';

console.log('--- Error Handling ---');

const source = Observable.merge(
    Observable.of(1),
    Observable.from([2, 3, 4]),
    Observable.throw(new Error('Stop!')),
    Observable.of(5)
).catch(e => {
    console.log(e);

    return Observable.of(10);
});

source.subscribe(
    console.log,
    console.log,
    () => console.log('complete')
);

