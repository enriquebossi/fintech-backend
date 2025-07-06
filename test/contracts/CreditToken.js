const { expect } = require("chai");

describe("CreditToken", function () {
  it("mints tokens", async function () {
    const [owner, user] = await ethers.getSigners();
    const CreditToken = await ethers.getContractFactory("CreditToken");
    const credit = await CreditToken.deploy(owner.address);
    await credit.mint(user.address, 1000);
    expect(await credit.balanceOf(user.address)).to.equal(1000);
  });
});
