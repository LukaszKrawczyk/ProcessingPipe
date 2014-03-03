/**
 * ProcessingPipe
 * Chinable processing in synchronous and asynchronous manner.
 * 
 * @author Lukasz Krawczyk <lukasz@abeja.asia>
 * @license MIT
 */
var ProcessingPipe = function(async) {
    this.async = (typeof async !== 'undefined') ? async : true;
    this._pipe = [];
    this._pipePointer = 0;
};

ProcessingPipe.prototype = {
    /**
     * Add function to pipe
     *
     * @example
     * <code>
     * a.pipe(b).pipe(c).pipe(d);
     * a.input(1);
     * </code>
     *
     * @param {ProcessingPipe} obj
     * @returns {ProcessingPipe}
     * @access public
     */
    pipe: function(obj) {
        if (typeof obj !== 'object')
            throw new TypeError('Parameter in pipe must be an object');
        this._pipe.push(obj);
        this._pipePointer++;
        return obj;
    },
    
    /**
     * Input method
     *
     * @param {*} data
     * @param {function} cb
     * @returns {void}
     * @access public
     */
    input: function(data, cb) {
        var self = this;
        this._pipePointer = 0;
        data = this.onInput(data);

        if (this.async) {
            if (this.process.length < 2)
                throw new Error('Please define callback argument for function .process() or change to synchronous mode.');
            this.process(data, function(data) {
                data = self.onOutput(data);
                self._next(data, cb);
            });
        } else {
            var result = this.process(data);
            return this._next(result, cb);
        }
    },

    /**
     * Clear pipe
     *
     * @returns {void}
     */
    clear: function() {
        this._pipe = [];
        return this;
    },

    /**
     * Processing method
     *
     * @param {*} data
     * @param {function} cb
     * @returns {void}
     * @access public
     */
    process: function(data, cb) {
        return (typeof cb === 'function') ? cb(data) : data;
    },
    
    /**
     * Assign event called at the end of pipe
     * 
     * @example
     * <code>
     * a.pipe(b).done(function(data){ alert(data) });
     * a.input(1);
     * </code>
     * 
     * @param {function} cb
     * @returns {ProcessingPipe}
     * @access public
     */
    done: function(cb){
        this._doneCallback = cb;
        return this;
    },

    /**
     * Assign pre-processing event
     *
     * @param {function} cb
     * @returns {ProcessingPipe}
     * @access public
     */
    onInput: function(data){
        return data;
    },

    /**
     * Assign post-processing event
     *
     * @param {function} cb
     * @returns {ProcessingPipe}
     * @access public
     */
    onOutput: function(data) {
        return data;
    },

    /**
     * Execute next function after input.
     * If there are some functions in the pipe, execute it
     * otherwise finish with done() and additional callback (if exists)
     *
     * @param {*} data
     * @param {function} cb
     * @returns {undefined}
     * @access protected
     */
    _next: function(data, cb) {
        if (this._pipePointer < this._pipe.length) {
            return this._pipe[this._pipePointer++].input(data, cb);
        } else {
            return (typeof cb === 'function')
                ? cb(data)
                : this._doneCallback(data);
        }
    },

    /**
     * Default event called at the end of pipe
     *
     * @param {*} data
     * @returns {*}
     * @access protected
     */
    _doneCallback: function(data) {
        return data;
    },

    /**
     * Class inheritance
     * @example
     * <code>
     * MyProcess = new ProcessingPipe().extend();
     * </code>
     * @param {type} obj
     * @returns {unresolved}
     */
    extend: function(obj) {
        if (typeof obj === 'undefined') {
            var obj = function (async) {
                ProcessingPipe.call(this, async);
            };
        }
        obj.prototype = Object.create(ProcessingPipe.prototype);
        obj.prototype.constructor = obj;
        return obj;
    }
};

if (typeof module !== 'undefined' && module.exports)
    module.exports = ProcessingPipe;