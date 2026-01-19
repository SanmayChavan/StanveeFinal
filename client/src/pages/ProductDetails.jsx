import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
    const {
        products,
        navigate,
        currency,
        addToCart,
        user,
        setShowUserLogin
    } = useAppContext();

    const { id } = useParams();

    const [thumbnail, setThumbnail] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const product = products.find(item => item._id === id);

    /* Scroll to top when product changes */
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    /* Set default thumbnail */
    useEffect(() => {
        if (product?.image?.length) {
            setThumbnail(product.image[0]);
        }
    }, [product]);

    /* Get related products */
    useEffect(() => {
        if (!product || products.length === 0) return;

        const related = products
            .filter(
                item =>
                    item.category === product.category &&
                    item._id !== product._id &&
                    item.inStock
            )
            .slice(0, 5);

        setRelatedProducts(related);
    }, [products, product]);

    if (!product) return null;

    return (
        <div className="mt-12 px-4 md:px-16">
            {/* Breadcrumb */}
            <p className="text-sm">
                <Link to="/">Home</Link> /
                <Link to="/products"> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`}>
                    {' '}
                    {product.category}
                </Link>{' '}
                /
                <span className="text-primary"> {product.name}</span>
            </p>

            {/* Product Section */}
            <div className="flex flex-col md:flex-row gap-16 mt-4">
                {/* Images */}
                {/* Images */}
                <div className="flex gap-6">
                    {/* Thumbnails */}
                    <div className="flex flex-col gap-3">
                        {product.image?.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setThumbnail(image)}
                                className={`border rounded overflow-hidden cursor-pointer w-14 md:w-20 h-20 flex-shrink-0 ${thumbnail === image
                                        ? "border-primary"
                                        : "border-gray-300"
                                    }`}
                            >
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="border border-gray-300 rounded overflow-hidden flex-shrink-0 w-[250px] h-[300px] md:w-[400px] md:h-[400px]">
                        {thumbnail && (
                            <img
                                src={thumbnail}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>
                </div>


                {/* Product Info */}
                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    {/* Rating */}
                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5)
                            .fill('')
                            .map((_, i) => (
                                <img
                                    key={i}
                                    src={
                                        i < 4
                                            ? assets.star_icon
                                            : assets.star_dull_icon
                                    }
                                    className="md:w-4 w-3.5"
                                    alt="rating star"
                                />
                            ))}
                        <p className="text-base ml-2">(4)</p>
                    </div>

                    {/* Price */}
                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">
                            MRP: {currency}
                            {product.price}
                        </p>
                        <p className="text-2xl font-medium">
                            Price: {currency}
                            {product.offerPrice}
                        </p>
                        <span className="text-gray-500/70">
                            (inclusive of all taxes)
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product.description?.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    {/* Actions */}
                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button
                            onClick={() =>
                                user
                                    ? addToCart(product._id)
                                    : setShowUserLogin(true)
                            }
                            className="w-full py-3.5 font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
                        >
                            Add to Cart
                        </button>

                        <button
                            onClick={() => {
                                if (user) {
                                    addToCart(product._id);
                                    navigate('/cart');
                                } else {
                                    setShowUserLogin(true);
                                }
                            }}
                            className="w-full py-3.5 font-medium bg-primary text-white hover:bg-primary-dull transition"
                        >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            <div className="flex flex-col items-center mt-20">
                <div className="flex flex-col items-center w-max">
                    <p className="text-3xl font-medium">Related products</p>
                    <div className="w-20 h-0.5 rounded-full bg-primary mt-2"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6 w-full">
                    {relatedProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>

                <button
                    onClick={() => {
                        navigate('/products');
                        window.scrollTo(0, 0);
                    }}
                    className="mx-auto px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
                >
                    See more
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;
