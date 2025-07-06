const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CreditToken", function () {
  it("mints tokens", async function () {
    const [owner, addr] = await ethers.getSigners();
    const Credit = await ethers.getContractFactory("CreditToken");
    const credit = await Credit.deploy(owner.address);
    await credit.mint(addr.address, 100);
    expect(await credit.balanceOf(addr.address)).to.equal(100);
  });
});

describe("CheckpointNFT", function () {
  it("mints nft and returns metadata", async function () {
    const [owner, addr] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("CheckpointNFT");
    const nft = await NFT.deploy(owner.address);
    await nft.mint(addr.address, 1, "open");
    const uri = await nft.tokenURI(1);
    expect(uri).to.contain("data:application/json;base64,");
    expect(await nft.ownerOf(1)).to.equal(addr.address);
  });
});
