const productHelper = require("../../helper/product");
const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const ProductCategoryHelper = require("../../helper/productCategory");

//[get] product
module.exports.index = async(req,res)=>{
    
    const product = await Product.find({
        deleted:"false"
    }).sort({position:"desc"});
    // console.log(product);

    const newproduct = productHelper.priceNewproducts(product);

    res.render("client/pages/products/index",{
        pageTitle:"Trang sản phẩm",
        products:newproduct 
    });
}

//[get] product/:slugCategory
module.exports.category = async(req,res)=>{
    const category = await ProductCategory.findOne({
        slug:req.params.slugCategory,
        deleted:false,
        status:"active"
    });

    const listSubCategory = await ProductCategoryHelper.getSubCategory(category.id);
    const listSubCategoryId = listSubCategory.map(item => item.id);
   
    const products = await Product.find({
        product_category_id: {$in: [category.id, ...listSubCategoryId]},
        deleted:false
    }).sort( {position:"desc"} );

    const newproduct = productHelper.priceNewproducts(products);
   
    res.render("client/pages/products/index",{
        pageTitle:category.title,
        products:newproduct 
    });
}

//[get] product/detail/:slugProduct
module.exports.detail =  async (req,res)=>{
    try
    {
        const find = {
            deleted:false,
            status: "active",
            slug : req.params.slugProduct
        }
        
        const product = await Product.findOne(find);
        
        if(product.product_category_id) //(nếu sản phẩm đó có danh mục cha)
        {
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                deleted: false,
                status:"active"
            }); 
            product.category = category;
        }

        product.priceNew = productHelper.priceNewproduct(product);
       
        res.render("client/pages/products/detail",
            { 
                pageTitle: product.title,
                product:product
            }
        )
    }
    catch(error)
    {
        res.redirect("/products");
    }
    
}


