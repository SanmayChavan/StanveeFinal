// import React, { useEffect, useState } from 'react';
// import { assets } from '../assets/assets';
// import { useAppContext } from '../context/AppContext';
// import toast from 'react-hot-toast';

// const InputField = ({type, placeholder, name, handleChange, address}) => (
//     <input className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none 
//     text-gray-500 focus:border-primary transition'
//     type={type}
//     placeholder={placeholder}
//     onChange={handleChange}
//     name={name}
//     value={address[name]}
//     required />
// )

// const AddAddress = () => {

//   const { user, axios, navigate} = useAppContext() ;
  
//   const [address, setAddress] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     street: '',
//     city: '',
//     state: '',
//     zipcode: '',
//     country: '',
//     phone: '',
//   }) ;

//   const handleChange = (e) => {
//     const {name, value} = e.target ;
//     setAddress((prevAddress) => ({
//       ...prevAddress,
//       [name]: value,
//     }))
//   }

//   const onSubmitHandler = async(e) => {
//     e.preventDefault() ;
//     try{
//       const { data } = await axios.post('/api/address/add', {address}) ;
//       if(data.success){
//         toast.success(data.message) ;
//         navigate('/cart') ;
//       }else{
//         console.log(data.message) ;
//         toast.error(data.message) ;
//       }
//     }catch(err){
//       console.log(err.message) ;
//       toast.error(err.message) ;
//     }
//   }

//   useEffect(()=> {
//     if(!user){
//       navigate('/cart') ;
//     }
//   }, [])

//   return (
//     <div className='mt-16 pb-16 px-4'>
//         <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping <span className='font-semibold text-primary'>Address</span></p>
//         <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
//           <div className='flex-1 max-w-md'>
//             <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>

//               <div className='grid grid-cols-2 gap-4'>
//                 <InputField handleChange={handleChange} address={address} value={address.firstName} name='firstName' type='text' placeholder='First Name'/>
//                 <InputField handleChange={handleChange} address={address} value={address.lastName} name='lastName' type='text' placeholder='Last Name'/>
//               </div>

//               <InputField handleChange={handleChange} address={address} value={address.email} name='email' type='email' placeholder='Email address'/>
//               <InputField handleChange={handleChange} address={address} value={address.street} name='street' type='text' placeholder='Street'/>

//               <div className='grid grid-cols-2 gap-4'>
//                 <InputField handleChange={handleChange} address={address} value={address.city} name='city' type='text' placeholder='City'/>
//                 <InputField handleChange={handleChange} address={address} value={address.state} name='state' type='text' placeholder='State'/>
//               </div>

//               <div className='grid grid-cols-2 gap-4'>
//                 <InputField handleChange={handleChange} address={address} value={address.zipcode} name='zipcode' type='number' placeholder='Zip code'/>
//                 <InputField handleChange={handleChange} address={address} value={address.country} name='country' type='text' placeholder='Country'/>
//               </div>

//               <InputField handleChange={handleChange} address={address} value={address.phone} name='phone' type='text' placeholder='Phone'/>

//               <button className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase'>
//                 Save address
//               </button>
              
//             </form>
//           </div>
//           <img className='md:mr-16 mb-16 md:mt-0' src={assets.add_address_iamge} alt="Add address" />
//         </div>
//     </div>
//   )
// }

// export default AddAddress



import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const InputField = ({ type, placeholder, name, handleChange, address, error }) => (
  <div className='w-full'>
    <input
      className={`w-full px-2 py-2.5 border rounded outline-none 
        text-gray-500 focus:border-primary transition
        ${error ? 'border-red-500' : 'border-gray-500/30'}`}
      type={type}
      placeholder={placeholder}
      onChange={handleChange}
      name={name}
      value={address[name]}
      required
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const AddAddress = () => {
  const { user, axios, navigate } = useAppContext();

  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // clear error on change
  };

  // Validation function
  const validate = () => {
    const newErrors = {};

    if (!address.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!address.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!address.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(address.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!address.street.trim()) newErrors.street = 'Street is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.country.trim()) newErrors.country = 'Country is required';

    // Indian PIN code validation
    if (!address.zipcode) {
      newErrors.zipcode = 'PIN code is required';
    } else if (!/^[1-9][0-9]{5}$/.test(address.zipcode)) {
      newErrors.zipcode = 'Invalid PIN code (6 digits, cannot start with 0)';
    }

    // Indian phone validation (10 digits, starts with 6-9)
    if (!address.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(address.phone)) {
      newErrors.phone = 'Phone must be 10 digits starting with 6-9';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true if no errors
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return; // stop submission if validation fails

    try {
      const { data } = await axios.post('/api/address/add', { address });
      if (data.success) {
        toast.success(data.message);
        navigate('/cart');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/cart');
    }
  }, []);

  return (
    <div className='mt-16 pb-16 px-4'>
      <p className='text-2xl md:text-3xl text-gray-500'>
        Add Shipping <span className='font-semibold text-primary'>Address</span>
      </p>
      <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
        <div className='flex-1 max-w-md'>
          <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>
            <div className='grid grid-cols-2 gap-4'>
              <InputField
                handleChange={handleChange}
                address={address}
                error={errors.firstName}
                name='firstName'
                type='text'
                placeholder='First Name'
              />
              <InputField
                handleChange={handleChange}
                address={address}
                error={errors.lastName}
                name='lastName'
                type='text'
                placeholder='Last Name'
              />
            </div>

            <InputField
              handleChange={handleChange}
              address={address}
              error={errors.email}
              name='email'
              type='email'
              placeholder='Email address'
            />
            <InputField
              handleChange={handleChange}
              address={address}
              error={errors.street}
              name='street'
              type='text'
              placeholder='Street'
            />

            <div className='grid grid-cols-2 gap-4'>
              <InputField
                handleChange={handleChange}
                address={address}
                error={errors.city}
                name='city'
                type='text'
                placeholder='City'
              />
              <InputField
                handleChange={handleChange}
                address={address}
                error={errors.state}
                name='state'
                type='text'
                placeholder='State'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <InputField
                handleChange={handleChange}
                address={address}
                error={errors.zipcode}
                name='zipcode'
                type='number'
                placeholder='PIN code'
              />
              <InputField
                handleChange={handleChange}
                address={address}
                error={errors.country}
                name='country'
                type='text'
                placeholder='Country'
              />
            </div>

            <InputField
              handleChange={handleChange}
              address={address}
              error={errors.phone}
              name='phone'
              type='tel'
              placeholder='Phone'
            />

            <button className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase'>
              Save address
            </button>
          </form>
        </div>

        <img className='md:mr-16 mb-16 md:mt-0' src={assets.add_address_iamge} alt='Add address' />
      </div>
    </div>
  );
};

export default AddAddress;
