var test = {
    _isSleep: false,
    _cacheList: [],
    sleep: function (time) {
        if (this._isSleep) {
            this._cacheList.push({
                fn: this.sleep,
                param: time
            });
            return this;
        }
        if (!time || typeof time !== 'number') return this;
        this._isSleep = true;
        console.log('sleep:', time);
        setTimeout(() => {
            this._isSleep = false;
            while (this._cacheList.length) {
                var cacheItem = this._cacheList.shift();
                cacheItem.fn.call(this, cacheItem.param);
                if (cacheItem.fn == this.sleep) {
                    break;
                }
            }
        }, time);
        return this;
    },
    init: function () {
        if (this._isSleep) {
            this._cacheList.push({
                fn: this.init
            });
            return this;
        }
        console.log('init!!!!');
        return this;
    }
};

var test2 = {
    _promiseList: Promise.resolve(),
    init: function () {
        this._promiseList = this._promiseList.then(() => {
            console.log('init');
        });
        return this;
    },
    sleep: function (time) {
        this._promiseList = this._promiseList.then(() => {
            return new Promise(resolve => {
                console.log('sleep: ', time);
                setTimeout(resolve, time);
            });
        });
        return this;
    }
};

// test.init().sleep(1000).init().sleep(3000).init().init();
test2.init().sleep(1000).sleep(2000).init().sleep(3000).init().init();
