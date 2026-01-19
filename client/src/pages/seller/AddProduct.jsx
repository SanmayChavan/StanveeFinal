import React, { useState } from 'react';
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const { axios } = useAppContext();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // prevent double submit
    if (loading) return;

    try {
      setLoading(true);

      const productData = {
        name,
        description: description.split('\n'),
        category,
        price,
        offerPrice,
      };

      const formData = new FormData();
      formData.append('productData', JSON.stringify(productData));

      files.forEach((file) => {
        if (file) formData.append('images', file);
      });

      const { data } = await axios.post('/api/product/add', formData);

      if (data.success) {
        toast.success(data.message);
        setName('');
        setDescription('');
        setCategory('');
        setPrice('');
        setOfferPrice('');
        setFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <form
        onSubmit={onSubmitHandler}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        {/* Images */}
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill('')
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    disabled={loading}
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <img
                    className={`max-w-24 cursor-pointer ${
                      loading ? 'opacity-50' : ''
                    }`}
                    src={
                      files[index]
                        ? URL.createObjectURL(files[index])
                        : assets.upload_area
                    }
                    alt="upload"
                    width={100}
                    height={100}
                  />
                </label>
              ))}
          </div>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Name</label>
          <input
            disabled={loading}
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Description</label>
          <textarea
            disabled={loading}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
          />
        </div>

        {/* Category */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium">Category</label>
          <select
            disabled={loading}
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Select Category</option>
            {categories.map((item, index) => (
              <option key={index} value={item.path}>
                {item.path}
              </option>
            ))}
          </select>
        </div>

        {/* Prices */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Product Price</label>
            <input
              disabled={loading}
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>

          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Offer Price</label>
            <input
              disabled={loading}
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className={`px-8 py-2.5 font-medium rounded transition cursor-pointer ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary text-white'
          }`}
        >
          {loading ? 'Adding Product...' : 'ADD'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
