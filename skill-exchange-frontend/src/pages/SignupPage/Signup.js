// import React, { useState, useRef, useEffect } from 'react';
// import './Signup.css';
// import logo from '../../assets/icons/singlogo.png';
// import signupImage from '../../assets/icons/signupside.webp';
// import { useNavigate } from 'react-router-dom';
// import { signup } from '../../api/auth';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { signInWithPopup } from 'firebase/auth';
// import { auths, googleProvider } from "../firebaseconfigration/config.js"
// import { googleLogin } from '../../api/auth';

// const Signup = () => {
//     const [step, setStep] = useState(1);
//     const [typedText, setTypedText] = useState('');
//     const [fullPrompt, setFullPrompt] = useState("Hi there! What's your name?");
//     const [typingIndex, setTypingIndex] = useState(0);

//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const nameRef = useRef();
//     const emailRef = useRef();
//     const passwordRef = useRef();
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (typingIndex < fullPrompt.length) {
//             const timeout = setTimeout(() => {
//                 setTypedText(prev => prev + fullPrompt.charAt(typingIndex));
//                 setTypingIndex(prev => prev + 1);
//             }, 40);
//             return () => clearTimeout(timeout);
//         }
//     }, [typingIndex, fullPrompt]);

//     const handleNext = async (e) => {
//         e.preventDefault();

//         if (step === 1) {
//             if (name.trim() === '') {
//                 toast.error("Please enter your name.");
//                 return;
//             }
//             setStep(2);
//             setTypedText('');
//             setFullPrompt(`Nice to meet you, ${name}! What's your email?`);
//             setTypingIndex(0);
//         } else if (step === 2) {
//             const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//             if (!emailRegex.test(email)) {
//                 toast.error("Please enter a valid email.");
//                 return;
//             }
//             setStep(3);
//             setTypedText('');
//             setFullPrompt(`Awesome, ${name}! Now set your password:`);
//             setTypingIndex(0);
//         } else if (step === 3) {
//             if (password.length < 5) {
//                 toast.error("Password must be at least 5 characters.");
//                 return;
//             }
//             await handleSignup();
//         }
//     };

//     const handleSignup = async () => {
//         try {
//             const formData = { name, email, password };
//             const res = await signup(formData);

//             toast.success(res.data.message || 'OTP sent to your email!');
//             localStorage.setItem('activationToken', res.data.activationToken);

//             setTimeout(() => navigate('/verify-otp'), 2000);
//         } catch (err) {
//             console.error("Signup error:", err);
//             toast.error(err.response?.data?.message || 'Signup failed. Try again.');
//         }
//     };



// // const signupWithGoogle = async () => {
// //     try {
// //       const result = await signInWithPopup(auths, googleProvider);
// //       const user = result.user;

// //       dispatch(
// //         setUser({
// //           user: {
// //             uid: user.uid,
// //             displayName: user.displayName,
// //             email: user.email,
// //             photoUrl: user.photoURL,
// //           },
// //           token: null,
// //           userID: user.uid,
// //         })
// //       );
// //       navigate("dashboard");
// //     }
// //     catch (error) {
// //       console.log(error)
// //       alert("Google sign-in failed. Please try again. ")
// //     }
// //   }

// const signupWithGoogle = async () => {
//   try {
//     const result = await signInWithPopup(auths, googleProvider);
//     const user = result.user;

//     // ✅ Get Firebase token
//     const token = await user.getIdToken();

//     // ✅ Send token to backend for JWT and user info
//     const res = await googleLogin({ token });

//     // ✅ Store in localStorage
//     localStorage.setItem('token', res.data.token);
//     localStorage.setItem('user', JSON.stringify(res.data.user));

//     // ✅ Navigate to dashboard
//     navigate('/dashboard');
//   } catch (error) {
//     console.error('Google Signup Error:', error);
//     alert('Google sign-in failed. Please try again.');
//   }
// };
//     return (
//         <div className="signup-container">
//             <div className="signup-card">
//                 <div className="login-left">
//                     <img src={signupImage} alt="Signup Graphic" className="welcome-image" />
//                     <h1>JOIN US</h1>
//                     <p className="greeting-text">Unlock your future. Sign up and start exchanging skills today!</p>
//                 </div>

//                 <div className="signup-right">
//                     <img src={logo} alt="Logo" className="signup-logo" />
//                     <form onSubmit={handleNext} className="signup-form">
//                         <p className="typewriter-text">{typedText}</p>

//                         {step === 1 && (
//                             <>
//                                 <input
//                                     ref={nameRef}
//                                     className="input-field"
//                                     type="text"
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                     placeholder="Your name"
//                                     required
//                                 />
//                                 <button type="submit" className="btn-primary">Next</button>
//                             </>
//                         )}

//                         {step === 2 && (
//                             <>
//                                 <input
//                                     ref={emailRef}
//                                     className="input-field"
//                                     type="email"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     placeholder="you@example.com"
//                                     required
//                                 />
//                                 <button type="submit" className="btn-primary">Next</button>
//                             </>
//                         )}

//                         {step === 3 && (
//                             <>
//                                 <input
//                                     ref={passwordRef}
//                                     className="input-field"
//                                     type="password"
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     placeholder="Create a password"
//                                     required
//                                 />
//                                 <button type="submit" className="btn-primary">Sign Up</button>
//                             </>
//                         )}
//                         <div className="google mt-4">

//                             <button type='submit' className='google-btn g-5'> <img
//                                 src="https://www.svgrepo.com/show/475656/google-color.svg"
//                                 alt="Google"
//                                 className="g-logo"
//                             />sign up with google</button>
//                         </div>
//                         <div className="extra-options">
//                             <p>
//                                 Already have an account?{' '}
//                                 <span onClick={() => navigate('/login')} className="link">Login</span>
//                                 <p onClick={() => navigate('/')} className="link">Back To Home</p>
//                             </p>
//                         </div>
//                     </form>
//                 </div>
//             </div>


//             <ToastContainer position="top-right" autoClose={3000} theme="colored" />
//         </div>
//     );
// };

// export default Signup;



import React, { useState, useRef, useEffect } from 'react';
import './Signup.css';
import logo from '../../assets/icons/singlogo.png';
import signupImage from '../../assets/icons/signupside.webp';
import { useNavigate } from 'react-router-dom';
import { signup, googleLogin } from '../../api/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signInWithPopup } from 'firebase/auth';
import { GoogleAuthProvider } from "firebase/auth";
import { auths } from '../../components/firebase/firebase';


const Signup = () => {
    const [step, setStep] = useState(1);
    const [typedText, setTypedText] = useState('');
    const [fullPrompt, setFullPrompt] = useState("Hi there! What's your name?");
    const [typingIndex, setTypingIndex] = useState(0);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (typingIndex < fullPrompt.length) {
            const timeout = setTimeout(() => {
                setTypedText(prev => prev + fullPrompt.charAt(typingIndex));
                setTypingIndex(prev => prev + 1);
            }, 40);
            return () => clearTimeout(timeout);
        }
    }, [typingIndex, fullPrompt]);

    const handleNext = async (e) => {
        e.preventDefault();

        if (step === 1) {
            if (name.trim() === '') {
                toast.error("Please enter your name.");
                return;

            }
            setStep(2);
            setTypedText('');
            setFullPrompt(`Nice to meet you, ${name}! What's your email?`);
            setTypingIndex(0);
        } else if (step === 2) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                toast.error("Please enter a valid email.");
                return;
            }
            setStep(3);
            setTypedText('');
            setFullPrompt(`Awesome, ${name}! Now set your password:`);
            setTypingIndex(0);
        } else if (step === 3) {
            if (password.length < 5) {
                toast.error("Password must be at least 5 characters.");
                return;
            }
            await handleSignup();
        }
    };

    const handleSignup = async () => {
        try {
            const formData = { name, email, password };
            const res = await signup(formData);

            toast.success(res.data.message || 'OTP sent to your email!');
            localStorage.setItem('activationToken', res.data.activationToken);

            setTimeout(() => navigate('/verify-otp'), 2000);
        } catch (err) {
            console.error("Signup error:", err);
            toast.error(err.response?.data?.message || 'Signup failed. Try again.');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auths, provider);
            const user = result.user;
            const idToken = await user.getIdToken();

            const res = await fetch("http://localhost:3000/auth/google-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: idToken }),
            });

            const data = await res.json();
            const userData = data.user;

            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(userData));
                //setUser(data.user);
                console.log("Google login successful:", data);

                navigate("/dashboard");
            } else {
                console.error("Login failed:", data.message);
                console.log(data);
                toast.error("Login failed: " + data.message);
            }
        } catch (error) {
            console.error("Google login error:", error);
            toast.error("Google login failed");
        } finally {
        }
    };
    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="login-left">
                    <img src={signupImage} alt="Signup Graphic" className="welcome-image" />
                    <h1>JOIN US</h1>
                    <p className="greeting-text">
                        Unlock your future. Sign up and start exchanging skills today!
                    </p>
                </div>

                <div className="signup-right">
                    <img src={logo} alt="Logo" className="signup-logo" />
                    <form onSubmit={handleNext} className="signup-form">
                        <p className="typewriter-text">{typedText}</p>

                        {step === 1 && (
                            <>
                                <input
                                    ref={nameRef}
                                    className="input-field"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    required
                                />
                                <button type="submit" className="btn-primary">Next</button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <input
                                    ref={emailRef}
                                    className="input-field"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                />
                                <button type="submit" className="btn-primary">Next</button>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <input
                                    ref={passwordRef}
                                    className="input-field"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
                                    required
                                />
                                <button type="submit" className="btn-primary">Sign Up</button>
                            </>
                        )}

                        <div className="extra-options mt-4">
                            <p>
                                Already have an account?{' '}
                                <span onClick={() => navigate('/login')} className="link">Login</span>
                                <p onClick={() => navigate('/')} className="link">Back To Home</p>
                            </p>
                        </div>
                    </form>

                  
                    <div className="google mt-4">
                        <button
                            type="button"
                            className="google-btn g-5"
                            onClick={handleGoogleLogin}
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="g-logo"
                            />
                            Sign up with Google
                        </button>
                    </div>
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </div>
    );
};

export default Signup;
