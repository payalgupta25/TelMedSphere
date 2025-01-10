import React, { useContext, useRef, useState } from 'react';
import commonContext from '../../contexts/common/commonContext';
import useOutsideClose from '../../hooks/useOutsideClose';
import useScrollDisable from '../../hooks/useScrollDisable';
import { Alert, CircularProgress } from "@mui/material";
import httpClient from '../../httpClient';

const AccountForm = ({ isSignup, setIsSignup }) => {
    const { isFormOpen, toggleForm } = useContext(commonContext);
    const [username, setUsername] = useState("");
    const [usertype, setUsertype] = useState("patient");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("male");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [passwd, setPasswd] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [isInvEmail, setIsInvEmail] = useState(false);
    const [isInvPass, setIsInvPass] = useState(false);
    const [isInvPhone, setIsInvPhone] = useState(false);
    const [isInvAge, setIsInvAge] = useState(false);
    const [isAlert, setIsAlert] = useState("");
    const [alertCont, setAlertCont] = useState("");
    const [isSuccessLoading, setIsSuccessLoading] = useState(false);
    const [doctorId, setDoctorId] = useState("");

    const formRef = useRef();

    useOutsideClose(formRef, () => {
        toggleForm(false);
        resetForm();
    });

    useScrollDisable(isFormOpen);

    const resetForm = () => {
        setUsername("");
        setUsertype("patient");
        setAge("");
        setGender("male");
        setPhone("");
        setEmail("");
        setPasswd("");
        setSpecialization("");
        setDoctorId("");
        setIsInvEmail(false);
        setIsInvPass(false);
        setIsInvPhone(false);
        setIsInvAge(false);
        setIsAlert("");
        setAlertCont("");
    };

    const checkAge = (a) => {
        const t = (parseInt(a) > 0 && parseInt(a) <= 120 && /^[0-9]{1,3}$/.test(a));
        setIsInvAge(!t);
        return t;
    };

    const checkEmail = (email) => {
        // eslint-disable-next-line
        const res = (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email));
        setIsInvEmail(!res);
        return res;
    };

    const checkPasswd = (passwd) => {
        const res = (/^.{6,}$/.test(passwd));
        setIsInvPass(!res);
        return res;
    };

    const validatePhoneNumber = (phoneNumber) => {
        const pattern = /^\+?1?\d{10,10}$/;
        const res = pattern.test(phoneNumber);
        setIsInvPhone(!res);
        return res;
    };

    // const handleForgotPassword = () => {
    //     if (!checkEmail(email)) {
    //         setIsAlert("error");
    //         setAlertCont("Please enter a valid email address");
    //         setTimeout(() => {
    //             setIsAlert("");
    //         }, 1500);
    //         return;
    //     }
    
    //     httpClient.post("/forgot_password", { email })
    //         .then(() => {
    //             setIsAlert("success");
    //             setAlertCont(`Password reset link sent to ${email}`);
    //             setTimeout(() => {
    //                 setIsAlert("");
    //             }, 1500);
    //         })
    //         .catch(err => {
    //             console.error("Error sending password reset link:", err.response?.data || err.message);
    //             setIsAlert("error");
    //             setAlertCont(`Failed to send password reset link: ${err.response?.data?.message || err.message}`);
    //             setTimeout(() => {
    //                 setIsAlert("");
    //             }, 1500);
    //         });
    // };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (isInvEmail || isInvPass || isInvPhone) {
            return;
        }

        setIsSuccessLoading(true);

        setTimeout(() => {
            setIsSuccessLoading(false);

            if (isSignup) {
                httpClient.post("/register", {
                    username,
                    registerer: usertype,
                    age,
                    gender,
                    phone: "91" + phone,
                    email,
                    passwd,
                    specialization
                })
                    .then(res => {
                        console.log(res);
                        setIsAlert("success");
                        setAlertCont("Signup Successful");
                        setTimeout(() => {
                            setIsAlert("");
                            toggleForm(false);
                            resetForm();
                        }, 1500);
                    })
                    .catch(err => {
                        console.log(err);
                        setIsAlert("error");
                        setAlertCont("User already exists");
                        setTimeout(() => {
                            setIsAlert("");
                        }, 1500);
                    });
            } else {
                httpClient.post("/login", {
                    email,
                    passwd
                })
                    .then(res => {
                        localStorage.setItem("token", res.data.access_token);
                        setIsAlert("success");
                        setAlertCont("Login Successful");
                        setTimeout(() => {
                            setIsAlert("");
                            toggleForm(false);
                            resetForm();
                        }, 1500);
                    })
                    .catch(err => {
                        console.log(err);
                        setIsAlert("error");
                        setAlertCont("Login Failed");
                        setTimeout(() => {
                            setIsAlert("");
                        }, 1500);
                    });
            }
        }, 1500);
    };

    const handleFormSwitch = () => {
        setIsSignup(!isSignup);
        resetForm();
    };

    return (
        <>
            {isFormOpen && (
                <div className="backdrop">
                    <div className="modal_centered">
                        <form id="account_form" ref={formRef} onSubmit={handleFormSubmit}>
                            {isAlert !== "" && <Alert severity={isAlert} className='form_sucess_alert'>{alertCont}</Alert>}

                            <div className="form_head">
                                <h2>{isSignup ? 'Signup' : 'Login'}</h2>
                            </div>

                            <div className="form_body">
                                {isSignup && (
                                    <>
                                        <div className="input_box">
                                            <label className="radio_label">Register as</label>
                                            <div className='radio_inputs'>
                                                <input
                                                    type="radio"
                                                    name="usertype"
                                                    className="radio_input_field"
                                                    value="patient"
                                                    checked={usertype === "patient"}
                                                    onChange={(e) => setUsertype(e.target.value)}
                                                /> <label className='radio_input_label'>Patient</label>
                                                <input
                                                    type="radio"
                                                    name="usertype"
                                                    className="radio_input_field"
                                                    value="doctor"
                                                    checked={usertype === "doctor"}
                                                    onChange={(e) => setUsertype(e.target.value)}
                                                /> <label className='radio_input_label'>Doctor</label>
                                            </div>
                                        </div>

                                        <div className="input_box">
                                            <input
                                                type="text"
                                                name="username"
                                                className="input_field"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                            <label className="input_label">Username</label>
                                        </div>

                                        {usertype === "doctor" && (
                                            <div className="input_box">
                                                <input
                                                    type="text"
                                                    name="specialization"
                                                    className="input_field"
                                                    value={specialization}
                                                    onChange={(e) => setSpecialization(e.target.value)}
                                                    required
                                                />
                                                <label className="input_label">Specialization {"(Eg. Cancer Surgeon)"}</label>
                                            </div>
                                        )}

                                        {usertype === "doctor" && (
                                            <div className="input_box">
                                                <input
                                                    type="text"
                                                    name="ID"
                                                    className="input_field"
                                                    value={doctorId}
                                                    onChange={(e) => setDoctorId(e.target.value)}
                                                    required
                                                />
                                                <label className="input_label">Doctor ID</label>
                                            </div>
                                        )}

                                        {usertype === "patient" && (
                                            <div>
                                                <div className="input_box">
                                                    <input
                                                        type="text"
                                                        name="age"
                                                        className="input_field"
                                                        value={age}
                                                        onChange={(e) => {
                                                            checkAge(e.target.value);
                                                            setAge(e.target.value);
                                                        }}
                                                        required
                                                    />
                                                    <label className="input_label">Age</label>
                                                </div>
                                                {age !== "" && isInvAge && <Alert severity="error" className='form_sucess_alert'>Invalid Age</Alert>}
                                            </div>
                                        )}

                                        <div className="input_box">
                                            <label className="radio_label">Gender</label>
                                            <div className='radio_inputs'>
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    className="radio_input_field"
                                                    value="male"
                                                    checked={gender === "male"}
                                                    onChange={(e) => setGender(e.target.value)}
                                                /> <label className='radio_input_label'>Male</label>
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    className="radio_input_field"
                                                    value="female"
                                                    checked={gender === "female"}
                                                    onChange={(e) => setGender(e.target.value)}
                                                /> <label className='radio_input_label'>Female</label>
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    className="radio_input_field"
                                                    value="other"
                                                    checked={gender === "other"}
                                                    onChange={(e) => setGender(e.target.value)}
                                                /> <label className='radio_input_label'>Other</label>
                                            </div>
                                        </div>

                                        <div className="input_box">
                                            <input
                                                type="text"
                                                name="phone"
                                                className="input_field"
                                                value={phone}
                                                onChange={(e) => {
                                                    validatePhoneNumber(e.target.value);
                                                    setPhone(e.target.value);
                                                }}
                                                required
                                            />
                                            <label className="input_label">Phone</label>
                                        </div>
                                        {phone !== "" && isInvPhone && <Alert severity="error" className='input_alert'>Invalid Phone Number</Alert>}
                                    </>
                                )}

                                <div>
                                    <div className="input_box">
                                        <input
                                            type="text"
                                            name="email"
                                            className="input_field"
                                            value={email}
                                            onChange={(e) => {
                                                checkEmail(e.target.value);
                                                setEmail(e.target.value);
                                            }}
                                            required
                                        />
                                        <label className="input_label">Email</label>
                                    </div>
                                    {email !== "" && isInvEmail && <Alert severity="error" className='input_alert'>Invalid Email</Alert>}
                                </div>

                                <div>
                                    <div className="input_box">
                                        <input
                                            type="password"
                                            name="password"
                                            className="input_field"
                                            value={passwd}
                                            onChange={(e) => {
                                                checkPasswd(e.target.value);
                                                setPasswd(e.target.value);
                                            }}
                                            required
                                            autoComplete=''
                                        />
                                        <label className="input_label">Password</label>
                                    </div>
                                    {isSignup && passwd !== "" && isInvPass && <Alert severity="warning" className='input_alert'>Password should contain atleast 6 characters</Alert>}
                                </div>

                                <button
                                    type="submit"
                                    className="btn login_btn"
                                    disabled={isInvAge || isInvEmail || isInvPass}
                                >
                                    {isSuccessLoading ? (
                                        <CircularProgress
                                            size={24}
                                            sx={{ color: "#f5f5f5" }}
                                        />
                                    ) : (
                                        isSignup ? 'Signup' : 'Login'
                                    )}
                                </button>

                                {/* {!isSignup && (
                                    <button
                                        type="button"
                                        className="btn forgot_password_btn"
                                        onClick={handleForgotPassword}
                                    >
                                        Forgot Password?
                                    </button>
                                )} */}

                                <div className="form_head">
                                    <p>
                                        {isSignup ? 'Already have an account ?' : 'New to TelMedSphere ?'}
                                        &nbsp;&nbsp;
                                        <button type="button" onClick={handleFormSwitch}>
                                            {isSignup ? 'Login' : 'Create an account'}
                                        </button>
                                    </p>
                                </div>
                            </div>

                            <div
                                className="close_btn"
                                title="Close"
                                onClick={() => {
                                    toggleForm(false);
                                    resetForm();
                                }}
                            >
                                &times;
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AccountForm;