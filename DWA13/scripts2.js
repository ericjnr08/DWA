const products = [
    { product: 'banana', price: "2" },
    { product: 'mango', price: 6 },
    { product: 'potato', price: ' ' },
    { product: 'avocado', price: "8" },
    { product: 'coffee', price: 10 },
    { product: 'tea', price: '' },
  ]

  console.log(
    products.forEach(product => console.log(product.product))
  );

  console.log(
    products.filter(product => product.length <= 5)
  );

  console.log(
    products
      .filter(product => {
        const price = product.price;
        return typeof price === 'string' ? price.trim() !== '' && !isNaN(Number(price)) : !isNaN(price);
      })
      .map(product => ({
        ...product,
        price: typeof product.price === 'string' ? Number(product.price) : product.price
      }))
      .reduce((total, product) => total + product.price, 0)
  );

  console.log(
    products.reduce((acc, product, index) => {
        if(index === 0)
            return product;

        if (index === products.length - 1)
            return `${acc} ${product}`;
        
        return `${acc}, ${product}`
    }, '')
  )

  console.log(
    (
      products
        .filter(product => {
          const price = product.price;
          return typeof price === 'string' ? price.trim() !== '' && !isNaN(Number(price)) : !isNaN(price);
        })
        .map(product => ({
          ...product,
          price: typeof product.price === 'string' ? Number(product.price) : product.price
        }))
        .reduce((acc, product) => {
          if (product.price > acc.highest.price) acc.highest = product;
          if (product.price < acc.lowest.price) acc.lowest = product;
          return acc;
        }, { highest: { product: '', price: -1 }, lowest: { product: '', price: 1 } })
    )
  );

  console.log(
    products.map(product => 
      Object.entries(product).reduce((acc, [key, value]) => {
        if (key === 'product') acc['name'] = value;
        else if (key === 'price') acc['cost'] = value;
        return acc;
      }, {})
    )
  );
  