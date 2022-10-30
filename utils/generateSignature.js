export function generateSignature(callback, paramsToSign) {
    fetch(`/api/sign`, {
        method: "POST",
        body: JSON.stringify({
            paramsToSign,
        }),
    })
        .then((response) => response.json())
        .then(({ signature }) => {
            callback(signature);
        });
}