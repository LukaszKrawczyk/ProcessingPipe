# ProcessingPipe
Chinable processing in a synchronous and an asynchronous manner.

## Asynchronous usage

```
var add = new ProcessingPipe();
add.process = function(data, cb) {
    data += 5;
    cb(data);
};

var multiply = new ProcessingPipe();
multiply.process = function(data, cb) {
    data *= 2;
    cb(data);
};

// define pipe
add.pipe(multiply);

// execute pipe
add.input(5, function(result) {
    // result = (5 + 5) * 2 = 20
});
```

## Synchronous usage

```
var add = new ProcessingPipe(false);
add.process = function(data, cb) {
    data += 5;
    return data;
};

var multiply = new ProcessingPipe(false);
multiply.process = function(data, cb) {
    data *= 2;
    return data;
};

// define pipe
add.pipe(multiply);

// execute pipe
var result = add.input(5);
// result = (5 + 5) * 2 = 20
```

## Events

### .onInput() / .onOutput()

```
var add = new ProcessingPipe(false);
add.onInput = function(data){
    // ...
    return data;
};

add.onOutput = function(data){
    // ...
    return data;
};
```

### .done()

```
var add = new ProcessingPipe(false);

// synchronous
var result = add.input(5).done(function(data) {
    return data + 4;
});
// result = 9

// asynchronous
var result = add.input(5).done(function(data) {
    result = data + 4;
    // result = 9
});
```

## Inheritance

```
// simple inheritance
var MyProcess = new ProcessingPipe().extend();

// inheritance with overwriting constructor
var MyProcess = new ProcessingPipe().extend(function (async, param) {
    ProcessingPipe.call(this, async);
    // set up other parameters
});
```