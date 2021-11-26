const Marketplace = artifacts.require('./Marketplace.sol')

require('chai')
.use(require('chai-as-promised'))
.should()
contract('Marketplace', ([deployer,seller,buyer]) => {
  let marketplace

  before(async () => {
    marketplace = await Marketplace.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await marketplace.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await marketplace.name()
      assert.equal(name, 'Dapp Marketplace')
    })

  })


  describe('products', async () => {
  	let result,productCount
    before(async () => {
    result= await marketplace.createProduct('iphonex',web3.utils.toWei('1','Ether'),{from:seller}) 
    productCount=await marketplace.productCount()
    })

    it('creates products', async () => {
      
      assert.equal(productCount,1)
      const event=result.logs[0].args
      assert.equal(event.id.toNumber(),productCount.toNumber(),"id is correct")
      assert.equal(event.name,'iphonex',"name is correct")
      assert.equal(event.price,'1000000000000000000',"price is correct")
      assert.equal(event.owner,seller,"owner is correct")
      assert.equal(event.purchased,false,"purchased is correct")
    

      await await marketplace.createProduct('',web3.utils.toWei('1','Ether'),{from:seller}).should.be.rejected;
      await await marketplace.createProduct('iphonex',0,{from:seller}).should.be.rejected;
    })

    it('lists products',async()=>
    {
    	const product=await marketplace.products(productCount)
    	assert.equal(product.id.toNumber(),productCount.toNumber(),"id is correct")
      assert.equal(product.name,'iphonex',"name is correct")
      assert.equal(product.price,'1000000000000000000',"price is correct")
      assert.equal(product.owner,seller,"owner is correct")
      assert.equal(product.purchased,false,"purchased is correct")

    })

    it('sells products',async()=>{
    	
    	let oldselleramt
    	oldselleramt=await web3.eth.getBalance(seller)
    	oldselleramt = new web3.utils.BN(oldselleramt)

      result=await marketplace.purchaseProduct(productCount,{from: buyer,value:web3.utils.toWei('1','Ether')})
      const event=result.logs[0].args
      assert.equal(event.id.toNumber(),productCount.toNumber(),"id is correct")
      assert.equal(event.name,'iphonex',"name is correct")
      assert.equal(event.price,'1000000000000000000',"price is correct")
      assert.equal(event.owner,buyer,"owner is correct")
      assert.equal(event.purchased,true,"purchased is correct")
      //check seller recived funds
      let newselleramt
      newselleramt =await web3.eth.getBalance(seller)
      newselleramt = new web3.utils.BN(newselleramt)

      let price
      price = web3.utils.toWei('1','Ether')
      price = new web3.utils.BN(price)

      const expectedbalance=oldselleramt.add(price)
      assert.equal(newselleramt.toString(),expectedbalance.toString())

      await marketplace.purchaseProduct(99, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;      // FAILURE: Buyer tries to buy without enough ether
  // FAILURE: Buyer tries to buy without enough ether
  await marketplace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;
  // FAILURE: Deployer tries to buy the product, i.e., product can't be purchased twice
  await marketplace.purchaseProduct(productCount, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
  // FAILURE: Buyer tries to buy again, i.e., buyer can't be the seller
  await marketplace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;



      

      


    
    })


  })





















})