const IPFS = require("ipfs");
const all = require("it-all");

let node;
async function init() {
  node = await IPFS.create();
  console.log("Initialized IPFS node.");
}

const ipfsAPI = {
  async ipfsInit() {
    const node = await IPFS.create();
    return node;
  },

  async ipfsStore(input) {
    return await node.add(input);
  },

  async ipfsGet(cid) {
    const data = Buffer.concat(await all(node.cat(cid)));
    return data.toString();
  },

  async ipfsStoreFile(input) {
    let buffer = Buffer.from(input);
    return await this.ipfsStore(buffer);
  },

  async ipfsGetImage(cid) {
    const data = Buffer.concat(await all(node.cat(cid)));
    return data;
  },
};
init();

module.exports = ipfsAPI;
