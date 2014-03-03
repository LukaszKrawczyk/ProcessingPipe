var ProcessingPipe = require('../lib/processingPipe.js');
var should = require("should");

describe('ProcessingPipe', function(){

    describe('#pipe()', function() {
        it('should add objects to pipe (chain)', function() {
            var a = new ProcessingPipe();
            a.process = function(data, cb) {
                cb(data + 2);
            };
            var b = new ProcessingPipe();
            b.process = function(data, cb) {
                cb(data * 2);
            };
            
            a.pipe(b);
            a._pipe.should.eql([b]);
        });
    });

    // ASYNCHRONOUS

    describe('#input() - asynchronous', function() {
        it('should process data asynchronously - second argument callback', function(done) {
            var a = new ProcessingPipe();
            a.process = function(data, cb) {
                cb(data + 2);
            };
            var b = new ProcessingPipe();
            b.process = function(data, cb) {
                cb(data * 2);
            };

            a.pipe(b);
            a.input(5, function(result) {
                result.should.eql(14);
                done();
            });
        });

        it('should process data asynchronously - .done() callback', function(done) {
            var a = new ProcessingPipe();
            a.process = function(data, cb) {
                cb(data + 2);
            };
            var b = new ProcessingPipe();
            b.process = function(data, cb) {
                cb(data * 2);
            };

            a.pipe(b).done(function(result) {
                result.should.eql(14);
                done();
            });
            a.input(5);
        });
    });

    describe('#onInput() / onOutput()', function() {
        it('should execute onInput and onOutput event', function(done) {
            var a = new ProcessingPipe();
            a.process = function(data, cb) {
                cb(data + 2);
            };
            a.onInput = function(data) {
                data.should.eql(5);
                done();
                return data;
            };

            a.input(5);
        });

        it('should execute onInput and onOutput event', function(done) {
            var a = new ProcessingPipe();
            a.process = function(data, cb) {
                cb(data + 2);
            };
            a.onOutput = function(data) {
                data.should.eql(7);
                done();
                return data;
            };

            a.input(5);
        });
    });

    // SYNCHRONOUS

    describe('#input() - synchronous', function() {
        it('should process data synchronously', function() {
            var a = new ProcessingPipe(false);
            a.process = function(data, cb) {
                return data + 2;
            };
            var b = new ProcessingPipe(false);
            b.process = function(data, cb) {
                return data * 2;
            };

            a.pipe(b);
            var result = a.input(5);
            result.should.eql(14);
        });

        it('should process data synchronously - second argument callback', function() {
            var a = new ProcessingPipe(false);
            a.process = function(data, cb) {
                return data + 2;
            };
            var b = new ProcessingPipe(false);
            b.process = function(data, cb) {
                return data * 2;
            };

            // with second argument callback
            a.pipe(b);
            var result = a.input(5, function(result) {
                return result + 2;
            });
            result.should.eql(16);
        });

        it('should process data synchronously - .done() callback', function() {
            var a = new ProcessingPipe(false);
            a.process = function(data, cb) {
                return data + 2;
            };
            var b = new ProcessingPipe(false);
            b.process = function(data, cb) {
                return data * 2;
            };

            // with .done()
            a.pipe(b).done(function(result) {
                return result + 1;
            });
            var result = a.input(5);
            result.should.eql(15);
        });
    });

    // INHERITANCE

    describe('#extend() - synchronous', function() {
        it('should extend object', function() {
            var MyProcess = new ProcessingPipe().extend();
            var process = new MyProcess(false);

            process.should.have.property('process');
            process.should.have.property('async', false);
        });

        it('should extend object with custom constructor', function() {
            var MyProcess = new ProcessingPipe().extend(function(param, async) {
                ProcessingPipe.call(this, async);
                this.param = param || null;
            });
            var process = new MyProcess(15, false);

            process.should.have.property('process');
            process.should.have.property('async', false);
            process.should.have.property('param', 15);
        });
    });
});