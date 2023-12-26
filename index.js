let express=require('express');
let app=express();

app.use(express.json());
let post=[];
app.get('/home',(req,res)=>{
    res.status(201,send({ massage:"Hello World" }));
});

app.post('/createProduct',(req,res)=>{
    let obj=req.body;
    obj.id=post.length+1;
    obj.isDeleted="false";
    post.push(obj);
    res.send({
        "isSuccess":true,
        "message":"Data is Successfully Created",
        "Data":post
    });
});

app.put('/updateProduct',(req,res)=>{
    let ProductName=req.query.ProductName;
    let obj=req.body;

    let idx=post.findIndex((fld)=>( fld.ProductName==ProductName ));
    console.log(ProductName,idx);
    post[idx].ProductName=obj.ProductName;
    post[idx].Price=obj.Price;
    res.send(post[idx]);
    console.log(fld.ProductName,"Updated by", post[idx].ProductName);
});

app.get('/getProductByName',(req,res)=>{
    let ProductName=req.query.ProductName;
    let Product=post.find((fld)=>( fld.ProductName=ProductName ));
    res.send(Product);
});

app.delete('/deleteProductByName',(req,res)=>{
    let ProductName=req.query.ProductName;
    let idx=post.findIndex((fld)=>( fld.ProductName=ProductName ));

    if(idx==-1)
    {
        res.status(404,send("Product is not found,Try Another ProductName"));
    }
    else
    {
        post[idx].isDeleted="true";
        res.send(post[idx]);
    }  
});

app.get('/getProduct',(req,res)=>{
    let Product=post.map((val,index)=>{
        if(val.isDeleted=="false"){
            return val;
        }
    });
    res.send({Product});
});

app.delete('/hardDeleteProduct',(req,res)=>{
    let ProductName=req.query.ProductName;
    let idx=post.findIndex((fld)=>( fld.ProductName=ProductName ));
    
    if(idx>=0)
    {
        post.splice(idx,1);

    res.send({post});
    }
    else
    {
        res.status(404,send({massage:"Product is not Found"}));
    }
});

app.get('/getProductByRange',(req,res)=>{
    let arr=post.filter((fld)=>{
        if(fld.isDeleted=="false")
        {
            return fld;
        }
    });

    if(req.query.minval)
    {
        arr=arr.filter((fld)=>{
        if(fld.Price>=req.query.minval)
        {
            return fld;
        }
    });
    }
    else
    {
        res.send("Not Defined MinValue");
    }
    
    if(req.query.maxval)
    {
        arr=arr.filter((fld)=>{
        if(fld.Price<=req.query.maxval)
        {
            return fld;
        }
    });
    }
     else
    {
        res.send("Not Defined MaxValue");
    }

    res.send({ "Product":arr });
});

app.get('/sortProductByPrice',(req,res)=>{
    let arr=post.filter((fld)=>{
        if(fld.isDeleted=="false")
        {
            return fld;
        }
    });

    if(req.query.sort)
    {
        if(req.query.sort=='asc')
        {
            console.log(req.query.sort);
            arr=arr.sort((a,b)=>{
               return  a.Price-b.Price;
            });
            console.log('arr1',arr)
        }
        else if(req.query.sort=="dsc")
        {
            arr=arr.sort((a,b)=>{
                return b.Price-a.Price;
            });
        }
        else
        {
            res.send("Give the correct type");
        }
        res.send({"Product":arr});
    }
    else
    {
        res.send("Provide the Query Parameter");
    }
});

app.listen(4000,()=>{
    console.log("Server Created by Express");
});

