export function defer(onFulfill, onReject) {
    return {
        _queue: [{
            onFulfill: onFulfill,
            onReject: onReject
        }],
        then: function(onFulfill, onReject) {
            this._queue.push({
                onFulfill: onFulfill,
                onReject: onReject
            });

            return this;
        }
    }
}