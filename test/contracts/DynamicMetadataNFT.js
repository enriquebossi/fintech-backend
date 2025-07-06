const { expect } = require("chai");

describe("DynamicMetadataNFT", function () {
  it("mints and updates metadata", async function () {
    const [owner, user] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("DynamicMetadataNFT");
    const nft = await NFT.deploy(owner.address);
    const tokenId = await nft.mintWithURI.staticCall(user.address, "ipfs://meta1");
    await nft.mintWithURI(user.address, "ipfs://meta1");
    expect(await nft.ownerOf(tokenId)).to.equal(user.address);
    await nft.updateTokenURI(tokenId, "ipfs://meta2");
    expect(await nft.tokenURI(tokenId)).to.equal("ipfs://meta2");
  });
});
