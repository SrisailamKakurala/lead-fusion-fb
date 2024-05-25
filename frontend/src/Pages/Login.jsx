import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import axios from 'axios';
import FullScreenImage from '../components/FullScreenImage';
import logo from '../assets/logo.png';
import { createBrowserHistory } from 'history';

const Login = () => {

    const API = 'https://otp-1.onrender.com';
    useEffect(() => {
        if (JSON.parse(localStorage.getItem('profileFormData'))) {
            navigate('/profile');
        }
    });

    const history = createBrowserHistory();

    const handleGoBack = () => {
        history.back(); // Navigate to the previous page
    };

    const [countryCode, setCountryCode] = useState('+91');
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [isChecked, setIsChecked] = useState(false); // State for terms and conditions checkbox

    const navigate = useNavigate(); // Initialize useNavigate hook

    const sendOtp = async () => {
        try {
            setStep(2); // Move to OTP input step
            const response = await axios.post(`${API}/api/otp/send-otp`, {
                country_code: countryCode,
                mobile_number: mobileNumber
            });
            // console.log(response);
            console.log('OTP sent:', response.data);
            
        } catch (error) {
            console.error('Error sending OTP:', error);
        }
    };

    const verifyOtp = async () => {
        try {
            const response = await axios.post(`${API}/api/otp/verify-otp`, {
                country_code: countryCode,
                mobile_number: mobileNumber,
                otp: otp
            });
            // console.log('OTP verified:', response.data);
            // console.log('OTP verified:', response.data.message);
            console.log(response.data.access_token);
            localStorage.setItem('token', response.data.access_token); // Save JWT token
            navigate('/profile/create'); // Use navigate to navigate
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };

    // Array of country codes
    const countryCodes = [
        { code: '+1', name: '🇺🇸' }, // United States
        { code: '+44', name: '🇬🇧' }, // United Kingdom
        { code: '+91', name: '🇮🇳' }, // India
        { code: '+61', name: '🇦🇺' }, // Australia
        { code: '+81', name: '🇯🇵' }, // Japan
        { code: '+86', name: '🇨🇳' }, // China
        { code: '+49', name: '🇩🇪' }, // Germany
        { code: '+33', name: '🇫🇷' }, // France
        { code: '+55', name: '🇧🇷' }, // Brazil
        { code: '+7', name: '🇷🇺' }  // Russia
    ];

    return (
        <div className='w-[100vw] h-[100vh] bg-green-100 flex justify-center items-center'>
            <FullScreenImage />
            <div className=" h-40 relative lg:w-[40%] md:w-[50%] sm:w-[100%]  w-[100%] lg:h-[70%] md:h-[70%] sm:h-[100%]  h-[100%] bg-white p-8 flex flex-col justify-center items-center  gap-3 md:rounded-2xl lg:rounded-2xl shadow-2xl  ">
                {step === 1 ? (
                    <>
                        <img className='w-[130px]' src={logo} alt="" />
                        <h1 className="text-xl font-bold text-green-900 mt-2">Let's get started</h1>
                        <p className="font-semibold text-slate-500">Enter your mobile number to proceed</p>
                        <div className="flex gap-2 mt-5">
                            {/* Select tag for country codes */}
                            <select
                                className='w-24 p-2 rounded-lg bg-slate-100 focus:ring focus:ring-green-600'
                                value={countryCode}
                                onChange={e => setCountryCode(e.target.value)}
                            >
                                <option value="">Select Country Code</option>
                                {countryCodes.map((country, index) => (
                                    <option key={index} value={country.code}>
                                        {country.name} ({country.code})
                                    </option>
                                ))}
                            </select>
                            <input
                                className='p-2 rounded-lg bg-slate-100 w-40 focus:ring focus:ring-green-600'
                                type="text"
                                placeholder="Mobile Number"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-center">
                            <input
                                className='mr-3'
                                type="checkbox"
                                name="t&c"
                                id="t&c"
                                checked={isChecked} // Bind to isChecked state
                                onChange={(e) => setIsChecked(e.target.checked)} // Update state on change
                            />
                            I agree to the <span className='underline text-green-600 mx-1'>terms</span> and <span className='mx-1 underline text-green-600'>conditions</span>
                        </div>
                        <button
                            className={`mt-6 ${isChecked && mobileNumber ? 'bg-green-800 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'} duration-200 shadow-xl rounded-md py-2 px-4 text-white font-semibold`}
                            onClick={sendOtp}
                            disabled={!isChecked || !mobileNumber} // Disable button if isChecked is false or mobileNumber is empty
                        >
                            Send OTP
                        </button>
                    </>
                ) : (
                    <>
                        <i onClick={handleGoBack} className="absolute top-5 left-5 cursor-pointer text-green-600 fa-solid fa-chevron-left fa-xl"></i>
                        <div className="flex flex-col justify-center items-center px-8 text-center gap-2 mt-5">
                            <>
                                <h1 className="text-xl font-bold text-green-900 mt-2">Verification code</h1>
                                <p className="font-semibold text-slate-500 mb-3">We have sent the verification code to your mobile number</p>
                                <p className="text-green-600 mt-3 font-semibold">({countryCode}) {mobileNumber} </p>
                                <input
                                    className='mt-5 mb-2 py-2 text-center font-bold tracking-widest focus:bg-green-100 rounded-lg bg-slate-100 w-40 focus:ring focus:ring-green-600'
                                    type="text"
                                    placeholder="OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <button className='mt-8 bg-green-800 hover:bg-green-600 duration-200 shadow-xl text-lg rounded-md py-2 px-6 text-white font-semibold' onClick={verifyOtp}>Verify OTP</button>
                                <p onClick={sendOtp} className="cursor-pointer text-green-600 mt-3 font-semibold">Resend code</p>
                            </>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
