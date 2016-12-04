import { Observable, Observer } from 'rxjs/Rx'

const numbers = [1, 2, 3];

const sourse = Observable.from(numbers);

const anotherSource = Observable.create(observer => {
    for(let n of numbers) {
        observer.next(n);
    }

    observer.complete();
});

const asyncSource = Observable.create(observer => {
    let index = 0;
    const produceValue = () => {
        observer.next(numbers[index++]);

        if(index < 3) {
            setTimeout(produceValue, 2000);
        } else {
            observer.complete();
        }
    }

    produceValue();
});

class MyObserver implements Observer<number> {
    next(value) {
        console.log(`value: ${value * 10}`);
    }

    error(err) {
        console.log(`error: ${err}`);
    }

    complete() {
        console.log('complete');
    }
}

console.log('----1----');

sourse.subscribe(new MyObserver());

console.log('----2----');

sourse.subscribe(console.log);

console.log('----3----');

anotherSource.subscribe(
    console.log,
    console.error,
    () => console.log('complete')
);

console.log('----4----');

asyncSource.subscribe(new MyObserver());