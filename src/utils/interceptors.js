export const interceptXHR = (handler) => {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
        this._interceptedUrl = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
        this.addEventListener("readystatechange", () => {
            if (this.readyState === 4 && this.status === 200) {
                const originalResponse = this.responseText;
                const modified = handler(originalResponse, this._interceptedUrl, "ajax");

                Object.defineProperty(this, "responseText", {
                    get: () => modified
                });
            }
        }, false);

        return originalSend.apply(this, arguments);
    };
};

export const interceptFetch = (handler) => {
    const originalFetch = unsafeWindow.fetch;

    unsafeWindow.fetch = (input, init) => {
        const req = new Request(input, init);

        return originalFetch(input, init).then(response => {
            const cloned = response.clone();

            return cloned.text().then(text => {
                const modifiedText = handler(text, req.url, "fetch");

                return new Response(modifiedText, {
                    status: cloned.status,
                    statusText: cloned.statusText,
                    headers: cloned.headers
                });
            });
        });
    };
};
