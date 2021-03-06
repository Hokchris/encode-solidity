const IPFS = require("ipfs");
const all = require("it-all");

let node;
async function init() {
  node = await IPFS.create();
  console.log("Initialized IPFS node.");
}

const ipfsApi = {
  async ipfsInit() {
    try {
      const node = await IPFS.create();
      return node;
    } catch (e) {
      console.log(e);
    }
  },

  async ipfsAdd(input) {
    try {
      return await node.add(input);
    } catch (e) {
      console.log(e);
    }
  },

  async ipfsGet(cid) {
    try {
      const data = Buffer.concat(await all(node.cat(cid)));
      return { 0: data.toString() };
    } catch (e) {
      console.log(e);
    }
  },

  async addFile(input) {
    try {
      let buffer = Buffer.from(input);
      return await this.ipfsAdd(buffer);
    } catch (e) {
      console.log(e);
    }
  },

  async ipfsGetImage(cid) {
    try {
      const data = Buffer.concat(await all(node.cat(cid)));
      return { 0: data };
    } catch (e) {
      console.log(e);
    }
  },
};
init();

module.exports = ipfsApi;
