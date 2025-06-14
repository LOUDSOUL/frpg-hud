import { workers } from "../utils/workers";


const activeWorkers = new Map();
const workerActions = new Set();

for (const worker of workers) {
    workerActions.add(worker.action);
    activeWorkers.set(worker.action, worker.listener);
}
const actionString = Array.from(workerActions).join("|");
const urlMatch = new RegExp(`worker\\.php\\?.*go=(${actionString})`);

const handleWorkerEvents = (response, url) => {
    const urlParameters = new URLSearchParams(url.split("?")[1]);
    const action = urlParameters.get("go");

    const worker = activeWorkers.get(action);
    worker(response, urlParameters);

    return response;
};

const workerListener = {
    name: "Worker Events",
    callback: handleWorkerEvents,
    urlMatch: [urlMatch],
    passive: true,
};

export default workerListener;
