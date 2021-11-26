pragma solidity ^0.5.0;

contract Marketplace
{
	string public name;
	uint public productCount=0;
	mapping(uint => Product) public products;
	struct Product{
		uint id;
		string name;
		uint price;
		address payable owner;
		bool purchased;
	}
	constructor() public{
	name="Dapp Marketplace";
	}

	event ProductCreated(
		uint id,
		string name,
		uint price,
		address payable owner,
		bool purchased);

	event ProductPurchase(
		uint id,
		string name,
		uint price,
		address payable owner,
		bool purchased
		);
	
	function createProduct(string memory _name,uint _price) public
	{

		require(bytes(_name).length>0);

		require (_price>0);	
		
		//make sure product is correct
		//create product
		productCount++;
		products[productCount]=Product(productCount,_name,_price,msg.sender,
			false);
		//trigger event
		emit ProductCreated(productCount,_name,_price,msg.sender,
			false);

	}  

	function purchaseProduct(uint _id) public payable
	{		
		//Fetch product
		Product memory _product= products[_id];
		address payable _seller=_product.owner;	
		//Product is valid

		require (_id>0 && _id<=productCount);

		require (msg.value>=_product.price);

		require (_product.purchased==false);


		require (_seller!=msg.sender);		
		//Fectch owner		
		//Tranfer Ownerhip
		_product.owner=msg.sender;
		//purchase it
		_product.purchased=true;
		//update product
		products[_id]=_product;
		//Pay seller
		address(_seller).transfer(msg.value);
		//trigger event
		
		emit ProductPurchase(productCount,_product.name,_product.price,msg.sender,
			true);

	}
}