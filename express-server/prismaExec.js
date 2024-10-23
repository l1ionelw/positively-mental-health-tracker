async function prismaExec(action) {
    const response = {"status": null, "transactionResponse": null};
    try {
        const transaction = await action();
        response.status = "Success";
        response.transactionResponse = transaction;
    } catch (e) {
        console.log(e.message);
        response.status = "Error";
        response.message = e.message;
    }
    return response;
}
module.exports = {prismaExec};