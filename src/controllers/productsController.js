const { json } = require('express');
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const guardar = (dato) => fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json')
    , JSON.stringify(dato, null, 4), 'utf-8')

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		// Do the magic
		res.render('products',{
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		// Do the magic
		const id=+req.params.id;
		let product =products.find(product=> product.id===id);
			return res.render('detail',{
				product,
				toThousand
			})
		
	},

	// Create - Form to create
	create: (req, res) => {
		// Do the magic
		return res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		// Do the magic
		return res.send (req.file)

		let{name,price,discount,category,description}=req.body
		let productoNuevo={
			id:products[products.length-1].id + 1,
			name,
			price,
			discount,
			category,
			description,
			image: req.file.originalname !== "" ? req.file.filename: "default-image.png",
		}
		products.push(productoNuevo)
		guardar(products)

		res.redirect(`/products`)
	},

	// Update - Form to edit
	edit: (req, res) => {
		// Do the magic
		const id=+req.params.id;
		let product =products.find(product=> product.id===id);
		return res.render('product-edit-form',{
			productToEdit : product 
		})
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		
		idParams=+req.params.id

		let{name,price,discount,category,description}=req.body
		
		products.forEach(producto => {
			if (producto.id === idParams) {
				producto.name=name,
				producto.price=price,
				producto.discount=discount,
				producto.category=category,
				producto.description=description,
				producto.image =req.file ? req.file.filename: producto.image
			}
			
		});
		guardar(products)
		return res.redirect(`/products/${idParams}`)
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		// Do the magic
		idParams=+req.params.id

		let producto =products.find (product=>product.id===idParams)
		
		let ruta=fs.existsSync(path.join(__dirname,'..','..','public','images', 'products',producto.image))

		if (ruta && (producto.image !== "default-image.png")) {
			fs.unlinkSync(path.join(__dirname,'..','..','public','images', 'products',producto.image))
			
		}

		let productosModificados = products.filter(producto =>{
			return producto.id !==idParams
		})
		guardar(productosModificados)

		return res.redirect('/')
	}
};

module.exports = controller;